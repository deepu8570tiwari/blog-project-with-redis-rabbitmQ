const { tryCatch } = require("../configs/trycatch");
const { postGreSql } = require("../configs/db");
const axios = require("axios");
const Redis = require("ioredis");


const redisClient = new Redis(process.env.REDIS_URL); // Make sure REDIS_URL is set in .env

// ===== Get All Blogs =====
const getAllBlogs = tryCatch(async (req, res) => {
    const { search = "", category = "" } = req.query;
    const cacheKey = `blogs:${search}:${category}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            message: "All blogs successfully listed (from cache)",
            blogs: JSON.parse(cached),
        });
    }

    // 2️⃣ Fetch from DB if not cached
    let allBlogs;
    if (search && category) {
        allBlogs = await postGreSql`
            SELECT * FROM blogs 
            WHERE (title ILIKE ${"%" + search + "%"} OR description ILIKE ${"%" + search + "%"}) 
            AND category = ${category} 
            ORDER BY created_at DESC
        `;
    } else if (search) {
        allBlogs = await postGreSql`
            SELECT * FROM blogs 
            WHERE (title ILIKE ${"%" + search + "%"} OR description ILIKE ${"%" + search + "%"}) 
            ORDER BY created_at DESC
        `;
    } else if (category) {
        allBlogs = await postGreSql`
            SELECT * FROM blogs 
            WHERE category = ${category} 
            ORDER BY created_at DESC
        `;
    } else {
        allBlogs = await postGreSql`SELECT * FROM blogs ORDER BY created_at DESC`;
    }

    // 3️⃣ Cache the result in Redis for 60 seconds
    if (allBlogs && allBlogs.length > 0) {
        await redisClient.set(cacheKey, JSON.stringify(allBlogs), "EX", 3600); // expire after 60s
        return res.status(200).json({
            message: "All blogs successfully listed",
            blogs: allBlogs,
        });
    } else {
        return res.status(404).json({ message: "No blogs found" });
    }
});

// ===== Get Single Detailed Blog =====
const getDetailedBlog = tryCatch(async (req, res) => {
    const blogId = req.params.id;
    const cacheKey = `blog:${blogId}`;

    // 1️⃣ Check Redis first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            message: "Single detailed blog (from cache)",
            data: JSON.parse(cached),
        });
    }

    // 2️⃣ Fetch from DB
    const detailedBlog = await postGreSql`SELECT * FROM blogs WHERE id = ${blogId}`;
    if (!detailedBlog || detailedBlog.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
    }

    // 3️⃣ Fetch author info from User service
    const token = req.headers.authorization?.split(" ")[1];
    const authorInfo = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/v1/user/${detailedBlog[0].author}`,
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        }
    );

    const responseData = {
        data: detailedBlog,
        author: authorInfo.data,
    };

    // 4️⃣ Cache the blog + author info in Redis for 60s
    await redisClient.set(cacheKey, JSON.stringify(responseData), "EX", 3600);

    res.status(200).json({
        message: "Single detailed blog",
        ...responseData,
    });
});

module.exports = { getAllBlogs, getDetailedBlog };
