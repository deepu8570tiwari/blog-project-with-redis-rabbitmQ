const express= require("express");
const router=express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const isAuth=require("../middleware/isAuth");
const {createBlog}=require("../controllers/authors.js");
router.post("/blog", isAuth, upload.single('image'), createBlog);
module.exports=router;