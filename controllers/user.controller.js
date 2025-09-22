const User = require("../models/user");
const jwt = require("jsonwebtoken");

const LoginUser = async (req, res) => {
  try {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log(req.body);
    const { name, email, image } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, image });
    }

    const token = jwt.sign({ user }, process.env.JWTSECRET, {
      expiresIn: "5d",
    });

    res.status(200).json({
      message: "login successfully",
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { LoginUser };
