const { tryCatch } = require("../utils/trycatch");
const { uploadToCloudinary } = require('../middleware/upload');
const {postGreSql} = require("../configs/db");
const { invalidateCacheJob } = require("../utils/rabbitmQ");
const { GoogleGenAI }= require("@google/genai");
const { GoogleGenerativeAI }= require("@google/generative-ai");
const dotenv=require("dotenv");
dotenv.config();
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
  await invalidateCacheJob(["blogs:*"]);
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
  await invalidateCacheJob(["blogs:*", `blog:${id}`]);
  return res.status(200).json({
    message: "Blog Updated successfully",
    data: UpdatedBlog[0],
  });
});

const deleteBlog=tryCatch(async(req, res)=>{
  const {id}=req.params;
  const blog= await postGreSql `SELECT * from blogs where id =${id}`;
  if (String(blog[0].author) !== String(req.user?.id)) {
    return res.status(401).json({ message: "You are not author of this blog" });
  }
  const blogDeleted=await postGreSql`DELETE FROM blogs WHERE id = ${id}`;
  await invalidateCacheJob(["blogs:*", `blog:${id}`]);
  if(blogDeleted){
    return res.status(200).json({message:"Blog deleted successfully"});
  }
})
const alTitleResponse= tryCatch(async (req,res)=>{

  const {title}=req.body;
  const prompt=`Correct the grammer of the following blog title and return only the corrected title without any additional text, formatting, or symbols:"${title}"`;
  let result=new GoogleGenAI({});
  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  }
  let rawText=response.text;
  if(!rawText){
   return res.status(400).json({message:"something went wrong"})
  }
  result= rawText.replace(/\*\*/g,"").repalce(/[\r\n]+/g,"").replace(/[*_`~]/g,"").trim();
  await main();
  return res.status(200).json(result)
})

const alDescriptionResponse= tryCatch(async (req,res)=>{
  const {title,description}=req.body;
  const prompt = description === "" ? `Generate only one short blog description based on
this title: "${title}". Your response must be only one sentence, strictly under 30 words, with no options, no
greetings, and no extra text. Do not explain. Do not say 'here is'. Just return the description only.` : `Fix the
grammar in the following blog description and return only the corrected sentence. Do not add anything else:
"${description}"`;
  let result=new GoogleGenAI({});
  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  }
  let rawText=response.text;
  if(!rawText){
   return res.status(400).json({message:"something went wrong"})
  }
  result= rawText.replace(/\*\*/g,"").repalce(/[\r\n]+/g,"").replace(/[*_`~]/g,"").trim();
  await main();
  return res.status(200).json(result)
})


module.exports = { createBlog,updateBlog,deleteBlog,alTitleResponse,alDescriptionResponse};
