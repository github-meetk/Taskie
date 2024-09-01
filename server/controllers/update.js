const CompanyUpdate = require("../models/Update");

// Get all company updates
exports.getAllUpdates = async (req, res) => {
  try {
    const updates = await CompanyUpdate.find().sort({ date: -1 });
    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new company update (Admin only)
exports.addUpdate = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newUpdate = new CompanyUpdate({ title, description });
    await newUpdate.save();
    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a company update (Admin only)
exports.deleteUpdate = async (req, res) => {
  const { updateId } = req.params;

  try {
    const update = await CompanyUpdate.findByIdAndDelete(updateId);
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }
    res.status(200).json({ message: "Update deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
