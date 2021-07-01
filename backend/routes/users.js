const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const router = require("express").Router();
const User = require("../models/user.model");
const passport = require("passport");
const utils = require("../lib/utils");
const { isAdmin, authUser, setUser } = require("../lib/permisions");
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const readline = require("readline");
const fs = require("fs");

const mailgun = require("mailgun-js");
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const frameRights = {
  isAdmin: false,
  canReadProjects: [],
  canWriteInProjects: [],
};

router.post("/login", function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "ACEST UTILIZATOR NU EXISTA" });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          _id: user._id,
        });
      } else {
        res.status(401).json({ success: false, msg: "PAROLA GRESITA" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/register", function (req, res, next) {
  const saltHash = utils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const { username, email, rights } = req.body;
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) res.status(400).json("EXISA DEJA UN USER CU ACEST EMAIL");

    try {
      const token = jwt.sign(
        { username, email, rights, hash, salt },
        process.env.JWT_ACTIVATE_ACOUNT,
        { expiresIn: "10m" }
      );

      const data = {
        from: req.body.email,
        to: process.env.MY_EMAIL,
        subject: "Solicitare adaugare user in aplicatia de avize",
        html: `<h2>Buna ziua!</h2>
        <h2> Va rog sa binevoiti a inregistra in aplicatia de avize userul cu numele </h2>
        <strong>${req.body.username}</strong>
        <h2>Accesati urmatorul link
        <a href=${process.env.CLINET_URL}/activate-account/${token}>${process.env.CLINET_URL}/activate-account/${token}</a>
        </h2>`,
      };

      mg.messages().send(data, function (error, body) {
        if (error) {
          return res.json({
            err: err.message,
          });
        }
        return res.json({
          message:
            "Emailul de activare a fost trimis spre aprobare.Veti fi notificat ulterior pe email",
        });
      });
      1;
    } catch (err) {
      res.json({ success: false, msg: err });
    }
  });
});

router.post("/forgot-password", function (req, res, next) {
  const email = req.body.email;
  try {
    const token = jwt.sign({ email }, process.env.JWT_FORGOT_PASSWORD, {
      expiresIn: "10m",
    });

    const data = {
      from: "noreply@avize.com",
      to: email,
      subject: "Modificare parola in aplicatie de avize",
      html: `<h2>Buna ziua!</h2>
      <h2>Ai primit acest email pentru ca ai solicitat modificarea parolei in aplicatia de avize</h2>
      <h2>Te rugam sa accesezi urmatorul link si sa urmezi instructiunile date.
      <a href=${process.env.CLINET_URL}/reset-password/${token}>${process.env.CLINET_URL}/reset-password/${token}</a>
      </h2>`,
    };

    mg.messages().send(data, function (error, body) {
      if (error) {
        return res.json({
          err: err.message,
        });
      }
      return res.json({
        message: "Va rugam sa verificati instructiunile furnizate pe email",
      });
    });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

router.post("/reset-password", function (req, res, next) {
  const token = req.body.token;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_FORGOT_PASSWORD,
      function (err, decodedToken) {
        if (err) {
          res
            .status(400)
            .json({ error: "LINKUL ACCESAT ESTE INCORECT SAU EXPIRAT" });
        }
        const { email } = decodedToken;
        const saltHash = utils.genPassword(req.body.password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        User.find({ email: email })
          .then((user) => {
            user[0].hash = hash;
            user[0].salt = salt;
            user[0]
              .save()
              .then(() =>
                res.json(
                  "Parola pentru acest utilizator a fost modificata cu succes"
                )
              )
              .catch((err) => res.status(400).json("Error: " + err));
          })
          .catch((err) => res.status(400).json("Error: " + err));
      }
    );
  } else {
    res.json({ error: "Something went wrong" });
  }
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  setUser,
  // authUser,
  isAdmin(),
  (req, res, next) => {
    User.find()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
      });
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  setUser,
  // authUser,
  (req, res, next) => {
    User.findById(req.query.UserId)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
      });
  }
);

router.post(
  "/update-rights",
  passport.authenticate("jwt", { session: false }),
  setUser,
  // authUser,
  isAdmin(),
  (req, res, next) => {
    const { userId, projectId, isAdmin, rightOfRead, rightOfWrite } = req.body;
    User.findById(userId)
      .then((user) => {
        if (isAdmin) {
          if (user.rights.isAdmin === false) user.rights.isAdmin = true;
        }
        if (rightOfRead) {
          if (user.rights.canReadProjects.indexOf(ObjectId(projectId)) == -1)
            user.rights.canReadProjects.push(ObjectId(projectId));
        }
        if (rightOfWrite) {
          if (user.rights.canWriteInProjects.indexOf(ObjectId(projectId)) == -1)
            user.rights.canWriteInProjects.push(ObjectId(projectId));
        }
        user
          .save()
          .then(() =>
            res.json({
              msg: "Drepturile acestui utilizator au fost modificate cu succes",
            })
          )
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

router.get(
  "/activate-account/:token",
  passport.authenticate("jwt", { session: false }),
  setUser,
  // authUser,
  isAdmin(),
  (req, res, next) => {
    const token = req.params.token;
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACTIVATE_ACOUNT,
        function (err, decodedToken) {
          if (err) {
            res.status(400).json({ error: "LINK INCORECT SAU EXPIRAT" });
          }
          const { username, email, rights, hash, salt } = decodedToken;
          const newUser = new User({
            username: username,
            email: email,
            rights: frameRights,
            hash: hash,
            salt: salt,
          });

          const newData = {
            from: "noreply@avize.com",
            to: email,
            subject: "Activare cont aplicatie avize",
            html: `<h2>Buna ziua!</h2>
                <h2>
                 Va informam ca solicitara dvs in legatura cu activarea contului a fost onorata cu succes.Puteti sa va 
                 logati folosind datele furnizate la creearea contului. 
                </h2>`,
          };

          mg.messages().send(newData, function (error, body) {
            if (error) {
              return res.json({
                error: error.message,
              });
            }
            newUser.save().then((user) => {
              res.json({ success: true, user: user });
            });
          });
        }
      );
    } else {
      res.json({ error: "Something went wrong" });
    }
  }
);

router.get("/log-activity/:day", (req, res, next) => {
  const day = new Date(req.params.day);
  let aux = day.toISOString().slice(0, 10);
  let aux1 = aux.split("");
  if (aux1[5] == 0) aux1[5] = "*";
  if (aux1[8] == 0) aux1[8] = "*";
  let finalDate = aux1
    .filter((elem) => {
      return elem != "*";
    })
    .join("");

  let reqPath = path.join(__dirname, "../access.log");

  const readInterface = readline.createInterface({
    input: fs.createReadStream(reqPath),
    output: null,
    console: false,
  });

  let result = [];
  for (let i = 0; i < 24; i++) result[i] = 0;
  readInterface
    .on("line", function (line) {
      let auxLine = line.slice(12, 34);
      if (auxLine.includes(finalDate)) {
        let aux2 = auxLine.split(" ")[1];
        aux2 = aux2.slice(0, 8).split(":")[0];
        let indice = parseInt(aux2);
        result[indice]++;
      }
    })
    .on("close", function () {
      res.send(result);
    });
});

module.exports = router;
