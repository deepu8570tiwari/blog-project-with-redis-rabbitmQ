const express=require("express");
const router=express.Router();
const {LoginUser, myProfile}=require("../controllers/user.controller.js");
const isAuth = require("../middleware/isAuth.js")
router.post("/login", LoginUser);
router.get("/me",isAuth,myProfile)
module.exports=router;