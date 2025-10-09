// src/utils/consumer.js
const amqp = require("amqplib");
const redisClient = require("../configs/redis");
const { postGreSql } = require("../configs/db");
const dotenv=require("dotenv");
dotenv.config();
const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
        protocol:process.env.RabbitMQ_protocol,
        hostname: process.env.RabbitMQ_hostname,
        port: process.env.RabbitMQ_port,
        username: process.env.RabbitMQ_username,
        password:process.env.RabbitMQ_password
    });

    const channel = await connection.createChannel();
    const queueName = "cache-invalidation";
    await channel.assertQueue(queueName, { durable: true });

    console.log("✅ Blog service waiting for cache invalidation messages...");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log("📩 Received cache invalidation message:", content);

          if (content.action === "invalidateCache") {
            const patterns = Array.isArray(content.key)
              ? content.key
              : [content.key];

            for (const pattern of patterns) {
              const keys = await redisClient.keys(pattern);
              if (keys.length > 0) {
                await redisClient.del(...keys);
                console.log(`🧹 Deleted ${keys.length} cache keys matching: ${pattern}`);
                // Rebuild cache (optional)
                const blog = await postGreSql`SELECT * FROM blogs ORDER BY created_at DESC`;
                const cacheKey = `blog::all`;
                await redisClient.set(cacheKey, JSON.stringify(blog), { EX: 3600 });
                console.log("✅ Cache rebuilt with key:", cacheKey);
              }
            }
          }

          channel.ack(msg);
        } catch (err) {
          console.error("❌ Error processing cache invalidation:", err);
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (err) {
    console.error("🚫 Failed to start RabbitMQ Consumer:", err);
  }
};

module.exports = { startCacheConsumer };
