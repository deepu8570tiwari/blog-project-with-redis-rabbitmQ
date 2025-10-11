const express= require("express");
const router=express.Router();
const isAuth=require("../middleware/isAuth");
const {addComment,getComment,deleteComment} =require("../controllers/comment.js");
router.post("/{blog_id}/comment",isAuth,addComment)
router.get("/comment/{blog_id}",isAuth,getComment)
router.delete("/comment/{blog_id}",isAuth,deleteComment)
module.exports=router;