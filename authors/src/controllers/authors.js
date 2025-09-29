const { tryCatch } = require("../utils/trycatch");
const { uploadToCloudinary } = require('../middleware/upload');
const postGreSql = require("../configs/db");

const createBlog = tryCatch(async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "No form fields provided" });
  }
  const { title, description, blogcontent, category } = req.body;

  // Validate required fields
  if (!title || !description || !blogcontent || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check file upload
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const result = await uploadToCloudinary(req.file.buffer, 'blog_images');
  
  // Ensure req.user exists
   if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

const insertInDB = await postGreSql`
  INSERT INTO blogs (title, description, image, blogcontent, category, author)
  VALUES (${title}, ${description}, ${result.url}, ${blogcontent}, ${category}, ${req.user.id})
  RETURNING *
`;

if (!insertInDB || insertInDB.length === 0) {
  console.error("Neon insert returned undefined — check values:", {
    title, description, blogcontent, category, image: result.url, author: req.user.id
  });
  return res.status(500).json({ message: "Database insert failed" });
}

  console.log("insertInDB =", insertInDB);

  res.status(200).json({
    message: "File uploaded successfully",
    blog: insertInDB[0],  // Neon returns array directly
    public_id: result.public_id,
  });
});

module.exports = { createBlog };
