const express= require("express");
const router=express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const isAuth=require("../middleware/isAuth");
const {createBlog,updateBlog,deleteBlog,alTitleResponse,alDescriptionResponse}=require("../controllers/authors.js");
const {addComment,getComment} =require("../controllers/comment.js");
router.post("/blog/create", isAuth, upload.single('image'), createBlog);
router.put("/blog/:id", isAuth, upload.single('image'), updateBlog);
router.delete("/blog/:id", isAuth, deleteBlog);
router.post("/blog/ai/title", isAuth,alTitleResponse)
router.post("/blog/ai/description", isAuth,alDescriptionResponse)
module.exports=router;