// User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "User" },
    tasks: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        isImportant: { type: Boolean, default: false },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
