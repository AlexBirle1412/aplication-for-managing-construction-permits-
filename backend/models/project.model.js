const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ContentProjectSchema = new Schema(
  {
    email: { type: String, required: false },
    //can pass true down here
    document: { type: String, required: false },
    //can pass true down here
    entity: { type: String, required: false },
    contact: { type: String, required: false },
    //can pass true down here
    procedure: { type: String, required: false },
    //can pass true down here
    payments: { type: String, required: false },
    //can pass true down here
    status: { type: String, required: false },
    teamMembers: { type: Array, required: false },
  },
  {
    timestamps: true,
  }
);

const projectSchema = new Schema(
  {
    coordinator: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },
    content: [ContentProjectSchema],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
