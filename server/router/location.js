const express = require("express");
const {
  createLocation,
  getLocations,
  deleteLocation,
} = require("../controllers/location");
const router = express.Router();

router.get("/getLocation", getLocations);
router.post("/createLocation", createLocation);
router.delete("/deleteLocation/:id", deleteLocation);

module.exports = router;
