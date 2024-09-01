const express = require("express");
const {
  getAllUsers,
  updateUserPermissions,
  updateTask,
  updateLocation,
} = require("../controllers/admin");
const { protectAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/users", protectAdmin, getAllUsers);
router.put("/updatePermissions", protectAdmin, updateUserPermissions);
router.put("/updateTask", updateTask);
router.put("/updateLocation", updateLocation);

module.exports = router;
