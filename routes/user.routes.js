const express=require("express");
const router=express.Router();
const {LoginUser, myProfile, getUserProfile,updateUserProfile}=require("../controllers/user.controller.js");
const isAuth = require("../middleware/isAuth.js")
router.post("/login", LoginUser);
router.get("/me",isAuth,myProfile)
router.get("/user/:id",isAuth,getUserProfile)
router.put("/user/update",updateUserProfile)
module.exports=router;