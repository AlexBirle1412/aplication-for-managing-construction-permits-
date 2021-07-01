const Project = require("../models/project.model");
const User = require("../models/user.model");

function setUser(req, res, next) {
  const userId = req.query.UserId;
  if (userId) {
    User.findById(userId)
      .then((user) => {
        req.thisUser = user;
        next();
      })
      .catch((err) => {
        res.status(400).json("Error: " + err);
        next();
      });
  }
}

function isAdmin() {
  return (req, res, next) => {
    if (!req.thisUser || req.thisUser.rights.isAdmin !== true) {
      return res.status(401).json("Not allowed for this user");
    }
    next();
  };
}

function authUser(req, res, next) {
  if (req.thisUser === null || req.thisUser === undefined) {
    return res.status(403).json("You need to sign in");
  }

  next();
}

function canViewProject(user, projectId) {
  let hasAcces = user.rights.canReadProjects.indexOf(projectId);
  return user.rights.isAdmin === true || hasAcces != -1;
}

function canReadProject() {
  return (req, res, next) => {
    if (!canViewProject(req.thisUser, req.params.id)) {
      return res.status(401).json("Not allowed for this user");
    }
    next();
  };
}

function scopedProjects(user) {
  if (user.rights.isAdmin === true) {
    return Project.find().exec();
  }
  return Project.find({ _id: { $in: user.rights.canReadProjects } }).exec();
}

function canDeleteProject(user, project) {
  return project.userId === user.id;
}

module.exports = {
  isAdmin,
  authUser,
  canReadProject,
  scopedProjects,
  setUser,
};
