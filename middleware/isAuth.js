const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User=require("../models/user");
dotenv.config();

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please login, no JWT token found" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid JWT token" });
    }

    // Fetch full user and attach to req
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;  
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Try login again - JWT error" });
  }
};
module.exports=isAuth;
