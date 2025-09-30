const { tryCatch } = require("../utils/trycatch");
const { uploadToCloudinary } = require('../middleware/upload');
const {postGreSql} = require("../configs/db");

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

  const insertInDB = await postGreSql `
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
    blog: insertInDB,  // Neon returns array directly
    public_id: result.public_id,
  });
});

const updateBlog = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { title, description, blogcontent, category } = req.body;
  const file = req.file;

  const blog = await postGreSql`SELECT * FROM blogs WHERE id=${id}`;

  if (!blog.length) {
    return res.status(404).json({ message: "No blog with this Id" });
  }

  if (String(blog[0].author) !== String(req.user?.id)) {
    return res.status(401).json({ message: "You are not author of this blog" });
  }

  let imageURl = blog[0].image;

  if (file) {
    const result = await uploadToCloudinary(file.buffer, 'blog_images');
    imageURl = result.secure_url;
  }

  const UpdatedBlog = await postGreSql`
    UPDATE blogs SET 
      title=${title || blog[0].title},
      description=${description || blog[0].description},
      blogcontent=${blogcontent || blog[0].blogcontent},
      category=${category || blog[0].category},
      image=${imageURl}
    WHERE id=${id}
    RETURNING *
  `;

  return res.status(200).json({
    message: "Blog Updated successfully",
    data: UpdatedBlog[0],
  });
});


module.exports = { createBlog,updateBlog };
