// src/configs/redis.js
const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis successfully!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

module.exports = redisClient;
