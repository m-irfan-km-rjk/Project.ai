const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  description: { type: String },
  category: { type: String }, // e.g., Web App, AI, etc.
  tags: [{ type: String }],
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  stack: [{ type: String }], // e.g., React, Node.js, Python
  steps: [{type: Object}], // embed step documents
  progress: { type: Number, default: 0 }, // % completed
  images: [{ type: String, }], // URLs to project images
  notes: [{ 
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);