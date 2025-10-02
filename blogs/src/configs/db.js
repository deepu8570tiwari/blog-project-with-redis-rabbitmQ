const {neon} =require("@neondatabase/serverless");
const dotenv=require("dotenv");
dotenv.config();
const postGreSql=neon(process.env.NODE_POSTGRE_DB_URL);
module.exports={
    postGreSql
}