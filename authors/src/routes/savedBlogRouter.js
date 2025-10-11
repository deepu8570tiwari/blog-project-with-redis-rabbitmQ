const express= require("express");
const router=express.Router();
const isAuth=require("../middleware/isAuth");
const {savedBlog} =require("../controllers/savedBlog");
router.post("/{userid}/{blog_id}/savedblog",isAuth,savedBlog)
module.exports=router;