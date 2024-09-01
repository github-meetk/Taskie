const express = require("express");
const { createTask, getTasks, deleteTask } = require("../controllers/task");
const router = express.Router();

router.get("/getTask", getTasks);
router.post("/createTask", createTask);
router.delete("/deleteTask/:id", deleteTask);

module.exports = router;
