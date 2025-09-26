const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

dotenv.config();
const app = express();

// ✅ Must be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1", userRoutes);

// connect to DB
connectDB();

app.listen(process.env.NODE_PORT, () => {
  console.log("Server running on port", process.env.NODE_PORT);
});
