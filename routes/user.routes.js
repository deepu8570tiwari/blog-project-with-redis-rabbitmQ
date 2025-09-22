const express=require("express");
const router=express.Router();
const {LoginUser}=require("../controllers/user.controller.js");
router.post("/login", LoginUser);
module.exports=router;