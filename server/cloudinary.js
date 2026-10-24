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

function initCloudinary() {
  if (isCloudinaryConfigured() && !process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

initCloudinary();

/**
 * Sanitize segment name for clean Cloudinary and filesystem folder structures
 */
function sanitizeFolderSegment(value, fallback = 'general') {
  const base = String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || fallback;
}

/**
 * Generates modular Cloudinary folder path per cafe tenant and asset type.
 * e.g. cafe-qr-menu/{cafeSlug}/{folderType}
 *
 * @param {string} cafeSlug - Cafe tenant identifier (e.g. 'yibe', 'abol-cafe')
 * @param {string} folderType - Subfolder category ('categories', 'dishes', 'branding', etc.)
 * @returns {string} Cloudinary folder path
 */
function getCloudinaryFolder(cafeSlug = 'abol-cafe', folderType = 'general') {
  const safeCafe = sanitizeFolderSegment(cafeSlug, 'abol-cafe');
  const safeType = sanitizeFolderSegment(folderType, 'general');
  return `cafe-qr-menu/${safeCafe}/${safeType}`;
}

function safeTag(str) {
  return String(str || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
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
      cb(new Error('Only image files (JPEG, PNG, WEBP, AVIF) are allowed.'));
    }
  },
});

/**
 * Upload buffer to Cloudinary using upload_stream with modular folder targeting
 * @param {Buffer} buffer - image binary buffer
 * @param {string} originalname - original filename
 * @param {object} options - upload options { cafeSlug, folder, folderPath }
 */
async function uploadToCloudinary(buffer, originalname, options = {}) {
  initCloudinary();

  const cafeSlug = sanitizeFolderSegment(options.cafeSlug || options.cafe, 'abol-cafe');
  const folderType = sanitizeFolderSegment(options.folder || options.type, 'general');
  const targetFolder = options.folderPath || getCloudinaryFolder(cafeSlug, folderType);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: targetFolder,
        resource_type: 'image',
        tags: [safeTag(cafeSlug), safeTag(folderType)].filter(Boolean),
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
 * Modular image uploader with Cloudinary multi-tenant support and isolated local fallback.
 *
 * @param {object} file - Express multer file object
 * @param {object} options - { cafeSlug, folder: 'categories' | 'dishes' | 'branding' }
 * @returns {Promise<{ url: string, publicId?: string, folder: string, provider: 'cloudinary' | 'local' }>}
 */
async function uploadImage(file, options = {}) {
  const cafeSlug = sanitizeFolderSegment(options.cafeSlug || options.cafe, 'abol-cafe');
  const folderType = sanitizeFolderSegment(options.folder || options.type, 'general');
  const targetFolder = getCloudinaryFolder(cafeSlug, folderType);

  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(file.buffer, file.originalname, {
      cafeSlug,
      folder: folderType,
      folderPath: targetFolder,
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      folder: targetFolder,
      cafeSlug,
      folderType,
      provider: 'cloudinary',
    };
  }

  // Graceful local fallback structured modularly per cafe and per folder type
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', cafeSlug, folderType);
  fs.mkdirSync(uploadsDir, { recursive: true });
  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, file.buffer);

  return {
    url: `/uploads/${cafeSlug}/${folderType}/${filename}`,
    folder: `${cafeSlug}/${folderType}`,
    cafeSlug,
    folderType,
    provider: 'local',
  };
}

module.exports = {
  upload,
  uploadImage,
  uploadToCloudinary,
  getCloudinaryFolder,
  isCloudinaryConfigured,
};
