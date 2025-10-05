const express = require("express");
const dotenv = require("dotenv");
const {connectDB} =require("./configs/db")
const authorRoutes=require("./routes/routes");
const {connectRabbitMq,publicToQueue,invalidateCacheJob}=require("../src/utils/rabbitmQ");
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectRabbitMq();
const PORT = process.env.NODE_PORT || 5000;
app.use("/api/v1",authorRoutes)
connectDB().then(()=>{
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
})
