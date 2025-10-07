const express= require("express");
const app= express();
const dotenv= require("dotenv");
const blogRoutes= require("./routes/blog");
const redisClient = require("../src/configs/redis");
const {startCacheConsumer}=require("../src/utils/consumer");
app.use("/api/v1", blogRoutes)
dotenv.config();
const port=process.env.PORT;
startCacheConsumer();
// Make Redis client accessible in routes (optional)
app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

app.listen(port, ()=>{
    console.log(`Server is runing on ${port}`);
})