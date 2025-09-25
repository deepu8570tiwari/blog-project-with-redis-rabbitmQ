const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {tryCatch}=require("../utils/trycatch");
const getDataUri = require("../utils/dataUri");
const cloudinary =require("../config/cloudinary");

const LoginUser = tryCatch(async (req, res) => {
  const { name, email, image } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, image });
  }

  // keep JWT lightweight
  const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
    expiresIn: "5d",
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user, // you can still send full user in response, just not in token
  });
});

const myProfile=tryCatch(async(req,res)=>{
  console.log("Decoded userId:", req.user._id);

 const user = await User.findById(req.user._id); 
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
})

const getUserProfile=tryCatch(async(req,res)=>{
 const user = await User.findById(req.user._id); 
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({message:user});
})

const updateUserProfile = tryCatch(async (req, res) => {
   console.log(req.user._id + " test"); // works now
  const { name, bio, instagram, facebook, linkedin } = req.body;

  const user = await User.findByIdAndUpdate(
     req.user._id,
    { name, bio, instagram, facebook, linkedin },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
    expiresIn: "5d",
  });

  res.status(200).json({ message: "User Profile updated", token, user });
});
const updateUserProfilePic=tryCatch(async(req,res)=>{
  if(!req.file){
    return res.status(400).json({message:"No file to upload"})
  }
  const fileBuffer=getBuffer(req.file);
  if(!fileBuffer || !fileBuffer.content){
    return res.status(400).json({message:"failed to generate buffer"})
  }
   // upload to cloudinary
    const result = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "user_profiles", // optional folder
    });

    res.status(200).json({
      message: "File uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
})
module.exports = { 
  LoginUser,
  myProfile,
  getUserProfile,
  updateUserProfile,
  updateUserProfilePic
};
