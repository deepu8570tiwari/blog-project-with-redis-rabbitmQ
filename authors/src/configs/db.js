const {neon} =require("@neondatabase/serverless");
const dotenv=require("dotenv");
dotenv.config();
const postGreSql=neon(process.env.NODE_POSTGRE_DB_URL);
const connectDB=async function initDB(){
  try {
  await postGreSql`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(25) NOT NULL,
      description VARCHAR(255) NOT NULL,
      blogcontent VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await postGreSql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      comment VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      blog_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_comments_blog FOREIGN KEY(blog_id)
        REFERENCES blogs(id) ON DELETE CASCADE
    )
  `;

  await postGreSql`
    CREATE TABLE IF NOT EXISTS savedblogs (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      blog_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_savedblogs_blog FOREIGN KEY(blog_id)
        REFERENCES blogs(id) ON DELETE CASCADE
    )
  `;

  console.log("Database Initialized");
} catch (error) {
  console.log("Error in Database", error);
}
}
module.exports = {connectDB, postGreSql };