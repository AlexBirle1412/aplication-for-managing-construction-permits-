var express = require("express");
var router = express.Router();

router.use("/users", require("./users"));
router.use("/projects", require("./projects"));

module.exports = router;
