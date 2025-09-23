const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAuth = (req, res, next) => {
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

    // Attach userId to req
    req.userId = decoded.id;  // 👈 this is critical
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Try login again - JWT error" });
  }
};
module.exports=isAuth;
