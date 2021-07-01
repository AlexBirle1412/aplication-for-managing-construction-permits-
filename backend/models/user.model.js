const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true, min: 4, trim: true },
  rights: {
    isAdmin: { type: Boolean },
    canReadProjects: [{ type: ObjectId }],
    canWriteInProjects: [{ type: ObjectId }],
  },
  hash: String,
  salt: String,
});

//Prin "write in" se intelege ca poate modifica; proiecte noi poate creea doar admin-ul
const User = mongoose.model("User", UserSchema);
module.exports = User;
