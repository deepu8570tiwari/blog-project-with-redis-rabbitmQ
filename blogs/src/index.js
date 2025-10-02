const express= require("express");
const app= express();
const dotenv= require("dotenv");
const blogRoutes= require("./routes/blog");
app.use("/api/v1", blogRoutes)
dotenv.config();
const port=process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server is runing on ${port}`);
})