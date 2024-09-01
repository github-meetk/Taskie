const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  due_date: { type: Date, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
