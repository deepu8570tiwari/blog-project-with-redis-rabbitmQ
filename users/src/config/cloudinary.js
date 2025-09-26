const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.NODE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NODE_CLOUDINARY_API_KEY,
  api_secret: process.env.NODE_CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
