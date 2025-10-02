const { tryCatch } = require("../configs/trycatch");
const {postGreSql}= require("../configs/db");
const getAllBlogs = tryCatch(async (req, res) => {
    const {search, category}=req.query;
    let allBlogs;
    if(search && category){
        allBlogs = await postGreSql`SELECT * FROM blogs WHERE (title ILIKE ${"%" +search+ "%"} 
        OR description ILIKE ${"%" +search+ "%"}) 
        AND category = ${category} ORDER BY created_at DESC`;
    }else if(search){
        allBlogs = await postGreSql`SELECT * FROM blogs WHERE (title ILIKE ${"%" +search+ "%"} 
        OR description ILIKE ${"%" +search+ "%"}) 
        ORDER BY created_at DESC`;
    }else{
        allBlogs = await postGreSql`SELECT * FROM blogs ORDER BY created_at DESC`;
    }

    if (allBlogs && allBlogs.length > 0) {
        res.status(200).json({
            message: "All blogs successfully listed",
            blogs: allBlogs,
        });
    } else {
        res.status(404).json({ message: "No blogs found" });
    }
});
const getDetailedBlog=tryCatch(async(req,res)=>{
    const {id}=req.param;
    const detailedBlog= await postGreSql `select * from blogs where id= ${id}`
    res.status(200).json({message:"Single detailed blog", data:detailedBlog})
})

module.exports = { getAllBlogs,getDetailedBlog };