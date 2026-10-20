'use strict';

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configure Cloudinary from environment variables.
 * Accepts either CLOUDINARY_URL or separate credentials.
 */
function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  );
}

if (isCloudinaryConfigured()) {
  if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

/**
 * Multer memory storage configuration for file uploads
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed.'));
    }
  },
});

/**
 * Upload buffer to Cloudinary using upload_stream
 */
async function uploadToCloudinary(buffer, originalname) {
  // Re-verify configuration in case env was set dynamically
  if (!process.env.CLOUDINARY_URL && process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'cafe-qr-menu/dishes',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Uploads an image either to Cloudinary (if configured) or locally as fallback
 */
async function uploadImage(file) {
  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(file.buffer, file.originalname);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      provider: 'cloudinary',
    };
  }

  // Graceful local fallback if Cloudinary credentials are not yet configured in .env
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'dishes');
  fs.mkdirSync(uploadsDir, { recursive: true });
  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, file.buffer);
  return {
    url: `/uploads/dishes/${filename}`,
    provider: 'local',
  };
}

module.exports = {
  upload,
  uploadImage,
  isCloudinaryConfigured,
};
