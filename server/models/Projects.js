const mongoose = require("mongoose");
const StepSchema = require("./Steps").schema;

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // e.g., Web App, AI, etc.
  tags: [{ type: String }],
  steps: [StepSchema], // embed step documents
  progress: { type: Number, default: 0 }, // % completed
  notes: [{ 
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);