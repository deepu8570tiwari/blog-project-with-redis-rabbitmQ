const { tryCatch } = require("../configs/trycatch");
const { postGreSql } = require("../configs/db");
const savedBlog=tryCatch(async(req,res)=>{
    const {blog_id}=req.params;
    const userid=req.user?.id;
    if(!blog_id || !userid){
        return res.status(401).json({message:"Missing blog id and user id"});
    }
    const existing= await postGreSql `select * from savedblog where userid=${userid} AND blogid=${blog_id}`;
    if(existing.length==0){
       const savedBlogs= await postGreSql `INSERT into savedblogs (blogid, userid) values (${blog_id},${userid})`;
        if(savedBlogs){
            return res.status(200).json({message:"Blog saved successfully", data:savedBlogs});
        }
    }else{
        const deleteBlogs= await postGreSql `DELETE from savedblogs where userid=${userid} AND blogid=${blog_id}`;
        if(deleteBlogs){
            return res.status(200).json({message:"Saved blog removed successfully"});
        }
    }
})
const getsingleSavedBlog=tryCatch(async(req,res)=>{
    const userid=req.user?.id;
    const getSelectedBlogs=await postGreSql `select * from savedblogs where userid=${userid}`;
    res.json({data:getSelectedBlogs})
})

module.exports={savedBlog,getsingleSavedBlog}