const express=require("express");
const router=express.Router();
const {LoginUser, myProfile, getUserProfile,updateUserProfile,updateUserProfilePic}=require("../controllers/user.controller.js");


const isAuth = require("../middleware/isAuth.js")
router.post("/login", LoginUser);
router.get("/me",isAuth,myProfile)
router.get("/user/:id",isAuth,getUserProfile)
router.put("/user/update",isAuth, updateUserProfile)
router.post("/user/update/upload", upload.single("image"), updateUserProfilePic);
module.exports=router;