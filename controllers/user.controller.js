const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {tryCatch}=require("../utils/trycatch");


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
  console.log("Decoded userId:", req.userId);

 const user = await User.findById(req.userId); 
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
})
module.exports = { LoginUser,myProfile };
