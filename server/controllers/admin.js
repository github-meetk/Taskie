const User = require("../models/User");
const Task = require("../models/TaskModule");
const Location = require("../models/LocationModule");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user permissions
exports.updateUserPermissions = async (req, res) => {
  const { userId, canCreateTask, canCreateLocation } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.permissions.canCreateTask = canCreateTask;
    user.permissions.canCreateLocation = canCreateLocation;
    await user.save();

    res.status(200).json({ message: "Permissions updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  const { taskId, name, status, due_date } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { name, status, due_date },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  const { locationId, name, address, capacity } = req.body;
  try {
    const location = await Location.findByIdAndUpdate(
      locationId,
      { name, address, capacity },
      { new: true }
    );
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
