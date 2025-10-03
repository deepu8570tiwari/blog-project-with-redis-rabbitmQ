const express= require("express");
const app= express();
const dotenv= require("dotenv");
const blogRoutes= require("./routes/blog");
const Redis = require("ioredis");
app.use("/api/v1", blogRoutes)
dotenv.config();
const port=process.env.PORT;
// Create Redis client
const redisClient = new Redis(process.env.REDIS_URL); // e.g., redis://localhost:6379
// Optional: test connection
redisClient.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Make Redis client accessible in routes (optional)
app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

app.listen(port, ()=>{
    console.log(`Server is runing on ${port}`);
})