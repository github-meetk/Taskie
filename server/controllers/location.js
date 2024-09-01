const Location = require("../models/LocationModule"); // Adjust the path as necessary

// Controller for creating a location
const createLocation = async (req, res) => {
  try {
    const { name, address, capacity } = req.body;
    const newLocation = new Location({
      name,
      address,
      capacity,
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for reading all locations
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a location by ID
const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLocation,
  getLocations,
  deleteLocation,
};
