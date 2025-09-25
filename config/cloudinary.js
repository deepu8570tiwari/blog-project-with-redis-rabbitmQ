const cloudinary=require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();


cloudinary.config({
  cloud_name: process.env.NODE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NODE_CLOUDINARY_API_KEY,
  api_secret: process.env.NODE_CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
