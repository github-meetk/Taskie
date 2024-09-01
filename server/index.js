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
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

app.use("/api/v1", taskRoutes);
app.use("/api/v1", locationRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1/admin", adminRoutes);

// Define routes
// app.use('/api/users', require('./routes/users'));
// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/locations', require('./routes/locations'));
// app.use('/api/permissions', require('./routes/permissions'));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
