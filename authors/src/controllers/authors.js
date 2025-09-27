const { tryCatch } = require("../utils/trycatch");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require('../middleware/upload');


const createBlog=tryCatch(async(req, res)=>{
    const {title, description,blogcontent,category}=req.body;
    if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const result = await uploadToCloudinary(req.file.buffer, 'blog_images');
  const insertInDB=await postgre `INSERT INTO blogs (title, description,image, blogcontent,category,author) VALUES(${title},${description},${blogcontent}, ${category},${req.user._id}) RETURNING *`
    res.status(200).json({
        message: 'File uploaded successfully',
        url: insertInDB[0],
        public_id: result.public_id,
    });
  })
  module.exports = {createBlog }