var express = require("express");
const fs = require("fs");
const Project = require("../models/project.model");
const ObjectId = require("mongodb").ObjectID;
const User = require("../models/user.model");
var router = express.Router();
const passport = require("passport");
const fileUpload = require("express-fileupload");
const path = require("path");
const isImage = require("is-image");

const {
  isAdmin,
  authUser,
  canReadProject,
  scopedProjects,
  setUser,
} = require("../lib/permisions");

router.use(fileUpload({ createParentPath: true }));

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  setUser,
  //authUser,
  (req, res, next) => {
    scopedProjects(req.thisUser)
      .then((projects) => {
        res.json(projects);
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
      });
  }
);

//DOAR ADMINUL POATE ADAUGA UN NOU PROIECT
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  setUser,
  //authUser,
  isAdmin(),
  (req, res, next) => {
    const coordinator = req.body.coordinator;
    const status = req.body.status;
    const description = req.body.description;
    const content = [];

    let correctStatus;
    switch (status) {
      case "Suspendat":
        correctStatus = "suspended";
        break;
      default:
        correctStatus = "active";
        break;
    }

    const newProject = new Project({
      coordinator,
      status: correctStatus,
      description,
      content,
    });
    newProject
      .save()
      .then((savedProject) => {
        User.findOne({ username: coordinator })
          .then((user) => {
            user.rights.canReadProjects.push(savedProject._id);
            user.rights.canWriteInProjects.push(savedProject._id);
            user.save();
          })
          .catch((err) => res.status(400).json({ err: "Error: " + err }));

        res.json("Project added!");
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  setUser,
  // authUser,
  canReadProject(),
  (req, res, next) => {
    Project.findById(req.params.id)
      .then((project) => res.json(project))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  setUser,
  //authUser,
  isAdmin(),
  (req, res, next) => {
    Project.findById(req.params.id)
      .then((project) => {
        User.find({
          "rights.canReadProjects": {
            $elemMatch: { $eq: ObjectId(project._id) },
          },
        })
          .then((users) => {
            users.forEach((user) => {
              user.rights.canReadProjects.pull(project._id);
              user.save();
            });
          })
          .catch((err) => console.log(err));

        User.find({
          "rights.canWriteInProjects": {
            $elemMatch: { $eq: ObjectId(project._id) },
          },
        })
          .then((users) => {
            users.forEach((user) => {
              user.rights.canWriteInProjects.pull(project._id);
              user.save();
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    Project.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json("Project deleted.");
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

//MODIFICAM DATELETE UNUI ANUMIT PROIECT,NU ACTIVITATILE ACESTUIA
router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    Project.findById(req.params.id)
      .then((project) => {
        project.coordinator = req.body.coordinator;
        switch (req.body.status) {
          case "Activ":
            project.status = "active";
            break;
          case "Suspendat":
            project.status = "suspended";
            break;
          case "Finalizat":
            project.status = "finalized";
            break;
          //undefined
          default:
            break;
        }
        project.description = req.body.description;
        project
          .save()
          .then(() => {
            //console.log("MODIFICARE DATE PROIECT");
            res.status(200).json("Project updated!");
          })
          .catch((err) => res.status(400).json("Error: " + err));
      })
      // .then(() => res.status(200).json("Project updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

//SA VEDEM CONTENTUL=TOATE ACTIVITATILE UNUI ANUMIT PROIECT
router.get(
  "/:id/content",
  passport.authenticate("jwt", { session: false }),
  setUser,
  //authUser,
  canReadProject(),
  (req, res, next) => {
    Project.findById(req.params.id)
      .then((project) => res.json(project.content))
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// SA ADAUGAM O ACTIVITATE IN CONTENTUL UNUI PROIECT(IMBOGATIM CONTENTUL)
router.post(
  "/:id/content/add",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    var contentProject = { ...req.body };
    Project.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: {
          content: contentProject,
        },
      }
    )
      .then(() =>
        res.json("New content was added succesfully for this project!")
      )
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// SA MODIFICAM O ANUMITE ACTIVITATE DIN CONTENTUL UNUI PROIECT(UN RAND DIN TABEL)
router.post(
  "/:id/content/update/:idRow",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    const objectInContentForUpdate = { ...req.body };
    Project.find({ _id: req.params.id })
      .then((project) => {
        var thisIndex;
        for (let i = 0; i < project[0].content.length; i++)
          if (project[0].content[i]._id == req.params.idRow) {
            thisIndex = i;
            break;
          }

        if (Boolean(req.body.document))
          project[0].content[thisIndex].document = req.body.document;
        if (Boolean(req.body.entity))
          project[0].content[thisIndex].entity = req.body.entity;
        if (Boolean(req.body.contact))
          project[0].content[thisIndex].contact = req.body.contact;
        if (Boolean(req.body.procedure))
          project[0].content[thisIndex].procedure = req.body.procedure;
        if (Boolean(req.body.payments))
          project[0].content[thisIndex].payments = req.body.payments;
        if (Boolean(req.body.status))
          project[0].content[thisIndex].status = req.body.status;

        project[0]
          .save()
          .then(() =>
            res.json("Content for this project was updated succesfully!")
          )
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

// SA STERGEM O ACTIVITATE DIN CONTENTUL UNUI PROIECT(MICSARORAM CONTENTUL)
router.delete(
  "/:id/content/delete/:idRow",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Project.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: { content: { _id: req.params.idRow } },
      }
    )
      .then(() => {
        res.json("Some content inside this project was deleted succesfully.");
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

router.post(
  "/:projectId/content/upload/:activityId",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    Project.findById(req.params.projectId)
      .then((project) => {
        const file = req.files.file;
        let reqPath = path.join(
          __dirname,
          "../public/uploads/" + project.description + "/"
        );
        file.mv(reqPath + `${file.name}`, (err) => {
          if (err) {
            // console.error(err);
            return res.status(500).send(err);
          }

          res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
        });
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
);

router.get(
  "/:projectId/content/get-all-files",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    Project.findById(req.params.projectId).then((project) => {
      let reqPath = path.join(
        __dirname,
        "../public/uploads/" + project.description + "/"
      );
      fs.readdir(reqPath, function (err, files) {
        if (err) {
          res.json({
            message: "Nu sunt documente disponibile pentru vizualizare!",
          });
        } else {
          let fileInfos = [];
          if (files) {
            files.forEach((file) => {
              fileInfos.push({
                name: file,
                url: reqPath + file,
                isImage: isImage(file),
              });
            });
            res.status(200).json({ fileInfos: fileInfos, project: project });
          } else {
            if (err) {
              res.json({
                message: "Nu sunt documente disponibile pentru vizualizare!",
              });
            }
          }
        }
      });
    });
  }
);

router.get(
  "/:projectId/content/get-image/:name",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    const fileName = req.params.name;
    Project.findById(req.params.projectId).then((project) => {
      let reqPath = path.join(
        __dirname,
        "../public/uploads/" + project.description + "/"
      );
      res.sendFile(reqPath + fileName);
    });
  }
);

router.get(
  "/:projectId/content/get-file/:name",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    const fileName = req.params.name;
    Project.findById(req.params.projectId).then((project) => {
      let reqPath = path.join(
        __dirname,
        "../public/uploads/" + project.description + "/"
      );

      res.download(reqPath + fileName, fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
      });
    });
  }
);

router.delete(
  "/:projectId/content/delete-file/:name",
  passport.authenticate("jwt", { session: false }),
  setUser,
  (req, res, next) => {
    const fileName = req.params.name;
    Project.findById(req.params.projectId).then((project) => {
      let reqPath = path.join(
        __dirname,
        "../public/uploads/" + project.description + "/"
      );

      fs.unlink(reqPath + fileName, (err) => {
        if (err)
          res.status(500).send({
            message: "Could not delete the file. " + err,
          });

        res.status(200).send({
          message: "The file was deleted succesfully. ",
        });
      });
    });
  }
);

module.exports = router;
