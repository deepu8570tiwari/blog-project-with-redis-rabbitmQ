const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {tryCatch}=require("../utils/trycatch");
const { uploadToCloudinary } = require('../middleware/upload');
const  oauth2Client  = require("../utils/googleConfig");
const axios=require("axios");

const LoginUser = tryCatch(async (req, res) => {
  const {code}=req.body;
  if(!code){
    return res.status(400).json({
      message:"Authorization code is required"
    })
  }
  const accessToken = req.body.code;
  const userResponse = await axios.get(
  `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
);

const { name, email, picture } = userResponse.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, picture });
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

const updateUserProfilePic = tryCatch(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const result = await uploadToCloudinary(req.file.buffer, 'user_profiles');
  res.status(200).json({
    message: 'File uploaded successfully',
    url: result.secure_url,
    public_id: result.public_id,
  });
});



module.exports = { 
  LoginUser,
  myProfile,
  getUserProfile,
  updateUserProfile,
  updateUserProfilePic
};
