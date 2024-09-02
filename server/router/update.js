const express = require("express");
const {
  getAllUpdates,
  addUpdate,
  deleteUpdate,
} = require("../controllers/update");
const { protectAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/updates", getAllUpdates);
router.post("/addUpdate", protectAdmin, addUpdate);
router.delete("/deleteUpdate/:updateId", protectAdmin, deleteUpdate);

module.exports = router;
