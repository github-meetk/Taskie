const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((error) => {
    console.log("DB connection failed");
    console.error(error);
    process.exit(1);
  });

const taskRoutes = require("./router/task");
const locationRoutes = require("./router/location");
const authRoutes = require("./router/auth");
const adminRoutes = require("./router/admin");
const companyUpdateRoutes = require("./router/update");

//Route definition
app.use("/api/v1", taskRoutes);
app.use("/api/v1", locationRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", companyUpdateRoutes);

//setup root
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
