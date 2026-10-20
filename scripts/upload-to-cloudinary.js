'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const pool = require('../server/db/pool');

// Ensure Cloudinary is configured
if (process.env.CLOUDINARY_URL) {
  // Uses CLOUDINARY_URL automatically
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const DISHES_DIR = path.join(PUBLIC_DIR, 'images', 'dishes');
const BANNERS_DIR = path.join(PUBLIC_DIR, 'images');

async function uploadFile(filePath, folder, publicId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });
      return result.secure_url;
    } catch (err) {
      if (attempt < maxRetries) {
        console.warn(`    ⚠️ Retry ${attempt}/${maxRetries} for ${path.basename(filePath)}...`);
        await new Promise((r) => setTimeout(r, 1200 * attempt));
      } else {
        const msg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
        throw new Error(`Failed to upload ${filePath} after ${maxRetries} attempts: ${msg}`);
      }
    }
  }
}

async function main() {
  console.log('☁️ Verifying Cloudinary connection...');
  try {
    const ping = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully:', ping);
  } catch (err) {
    const errMsg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
    console.error('❌ Cloudinary connection failed:', errMsg);
    if (errMsg.includes('cloud_name mismatch')) {
      console.error('\n⚠️ "cloud_name mismatch" error:');
      console.error('The API key belongs to a different cloud name than what is configured.');
      console.error('In your Cloudinary console (https://cloudinary.com/console):');
      console.error('Look under "Product Environment Credentials" for the actual "Cloud name" (or copy the full "API Environment variable" / CLOUDINARY_URL).');
    }
    process.exit(1);
  }

  const uploadedUrls = {};

  // 1. Upload Banner Images
  console.log('\n📸 Uploading Category Banners...');
  const bannerFiles = ['breakfast.jpg', 'coffee.jpg', 'desserts.jpg', 'drinks.jpg', 'habesha.jpg', 'pizza.jpg'];
  for (const filename of bannerFiles) {
    const filePath = path.join(BANNERS_DIR, filename);
    if (fs.existsSync(filePath)) {
      const id = path.parse(filename).name;
      const url = await uploadFile(filePath, 'cafe-qr-menu/banners', id);
      uploadedUrls[`/images/${filename}`] = url;
      console.log(`  ✓ ${filename} -> ${url}`);
    }
  }

  // 2. Upload Dish Images
  console.log('\n🍽️ Uploading Dish Photos...');
  if (fs.existsSync(DISHES_DIR)) {
    const dishFiles = fs.readdirSync(DISHES_DIR).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    for (const filename of dishFiles) {
      const filePath = path.join(DISHES_DIR, filename);
      const id = path.parse(filename).name;
      const url = await uploadFile(filePath, 'cafe-qr-menu/dishes', id);
      uploadedUrls[`/images/dishes/${filename}`] = url;
      console.log(`  ✓ ${filename} -> ${url}`);
    }
  }

  // 3. Save URL mapping to a file for reference
  const mapPath = path.resolve(__dirname, '..', 'data', 'cloudinary-map.json');
  fs.mkdirSync(path.dirname(mapPath), { recursive: true });
  fs.writeFileSync(mapPath, JSON.stringify(uploadedUrls, null, 2), 'utf8');
  console.log(`\n💾 Saved URL mapping to ${mapPath}`);

  // 4. Update Database Items Table
  console.log('\n🗄️ Updating MySQL database with Cloudinary URLs...');
  try {
    const [items] = await pool.query('SELECT id, name, image FROM items');
    let updatedCount = 0;
    for (const item of items) {
      // Find matching Cloudinary URL
      let match = null;
      if (item.image && uploadedUrls[item.image]) {
        match = uploadedUrls[item.image];
      } else {
        // match by dish id
        const key = `/images/dishes/${item.id}.jpg`;
        if (uploadedUrls[key]) {
          match = uploadedUrls[key];
        }
      }

      if (match) {
        await pool.query('UPDATE items SET image = ? WHERE id = ?', [match, item.id]);
        updatedCount++;
      }
    }
    console.log(`✅ Updated ${updatedCount} items in MySQL database with Cloudinary URLs.`);
  } catch (err) {
    console.warn('⚠️ Note: Database update warning:', err.message);
  }

  console.log('\n🎉 All dummy images successfully uploaded to Cloudinary!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
