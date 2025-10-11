const { tryCatch } = require("../configs/trycatch");
const { postGreSql } = require("../configs/db");
const addComment=tryCatch(async(req,res)=>{
    const {id:blog_id}=req.params;
    const {comment}=req.body;
    const inserted=await postGreSql `insert into comments (comment, blog_id, userid, username) values (${comment},${blog_id},${req.user?._id},${req.user?.name}) RETURNING *`;
    if(inserted){
        res.status(200).json({message:"Comment add successfully"});
    }
})
const getComment=tryCatch(async(req,res)=>{
    const {id}=req.params;
    const comment=await postGreSql `select * from comments where blog_id=${id} ORDER_BY  created_at DESC`;
    if(comment){
       return res.status(200).json({message:"Comment add successfully", data:comment});
    }
})
const deleteComment=tryCatch(async(req,res)=>{
    const {commentid}=req.params;
    const comment=await postGreSql `select * from comments where id=${commentid}`;
    if(comment[0].userid!==req.user?._id){
        return res.status(401).json({message:"You are not an owner of blog"});
    }
    const deleted=await postGreSql `DELETE from comments from id=${commentid}`;
    if(deleted){
        return res.status(200).json({message:"Blog deleted successfully"});
    }
})
module.exports={addComment,getComment,deleteComment}