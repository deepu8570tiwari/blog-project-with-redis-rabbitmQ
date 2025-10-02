const express= require("express");
const router=express.Router();
const {getAllBlogs,getDetailedBlog}=require("../controllers/blog");
router.get("/blogs", getAllBlogs)
router.get("/blogs/:id", getDetailedBlog)
module.exports= router;