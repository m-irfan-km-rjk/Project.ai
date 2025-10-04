const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
});

module.exports = mongoose.model("User", userSchema);