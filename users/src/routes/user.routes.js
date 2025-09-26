const express=require("express");
const router=express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {LoginUser, myProfile, getUserProfile,updateUserProfile,updateUserProfilePic}=require("../controllers/user.controller.js");


const isAuth = require("../middleware/isAuth.js")
router.post("/login", LoginUser);
router.get("/me",isAuth,myProfile)
router.get("/user/:id",isAuth,getUserProfile)
router.put("/user/update",isAuth, updateUserProfile)
router.put("/user/update/upload", isAuth, upload.single('image'), updateUserProfilePic);
module.exports=router;