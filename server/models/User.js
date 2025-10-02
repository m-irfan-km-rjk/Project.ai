const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // later you should hash it with bcrypt
});

module.exports = mongoose.model("User", userSchema);