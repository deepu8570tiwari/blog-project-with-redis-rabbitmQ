const multer = require('multer');
const cloudinary = require('../configs/cloudinary');
const streamifier = require('streamifier');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'blog_images') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { upload, uploadToCloudinary };
