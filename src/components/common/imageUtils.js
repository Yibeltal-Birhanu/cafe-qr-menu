/**
 * Differentiated Image Optimization Engine
 *
 * Provides two distinct, specialized optimization pipelines:
 * 1. MENU CARD TIER:
 *    - Purpose: High-speed browsing, minimal bandwidth, seamless grid rendering.
 *    - Compression: q_auto:good (reduces payload by ~80% down to ~10-14 KB).
 *    - Dimensions: Tailored per card archetype (Bento 4:3, Editorial/Rustic/Noir split, Boutique/Minimal 1:1).
 *    - Auto-Resizing: Responsive 1x & 2x srcSet with layout-specific sizes hints.
 *
 * 2. DETAIL CARD TIER:
 *    - Purpose: Immersive hero pop-up card view, maximum visual fidelity, high dynamic range.
 *    - Compression: q_auto:best (preserves photographic richness, rich color contrast).
 *    - Dimensions: 16:10 widescreen hero (800x500 at 1x, 1600x1000 at 2x).
 *    - Auto-Resizing: Fluid container aspect-ratio with responsive 100vw clamp.
 */

export const IMAGE_OPTIMIZATION_TIERS = {
  MENU_CARD: {
    quality: 'auto:good',
    crop: 'fill',
    gravity: 'auto',
  },
  DETAIL_CARD: {
    quality: 'auto:best',
    crop: 'fill',
    gravity: 'auto',
  },
  HERO_BANNER: {
    quality: 'auto:good',
    crop: 'fit', // Resize only to fit bounds, never crop
    gravity: 'auto',
  },
};

/**
 * Core Cloudinary URL transformer
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Only transform Cloudinary URLs
  if (!trimmed.includes('cloudinary.com') || !trimmed.includes('/image/upload/')) {
    return trimmed;
  }

  const {
    width,
    height,
    crop = 'fill',
    gravity = 'auto',
    format = 'auto',
    quality = 'auto',
    dpr,
  } = options;

  const parts = [];
  if (format) parts.push(`f_${format}`);
  if (quality) parts.push(`q_${quality}`);
  if (dpr && dpr > 1) parts.push(`dpr_${dpr}`);
  if (crop) parts.push(`c_${crop}`);
  if (crop === 'fill' && gravity) parts.push(`g_${gravity}`);
  if (width) parts.push(`w_${Math.round(width)}`);
  if (height) parts.push(`h_${Math.round(height)}`);

  const transformSegment = parts.join(',');
  if (!transformSegment) return trimmed;

  const splitIdx = trimmed.indexOf('/image/upload/');
  if (splitIdx === -1) return trimmed;

  const prefix = trimmed.slice(0, splitIdx + '/image/upload/'.length);
  const remainder = trimmed.slice(splitIdx + '/image/upload/'.length);

  // Split remainder into path segments
  const segments = remainder.split('/');

  // A segment is a transformation segment if it contains Cloudinary transformation codes
  // e.g. w_..., h_..., f_..., c_... or comma-separated pairs, AND is not a version like v12345
  const isTransform = (seg) => {
    if (!seg || /^v\d+$/.test(seg)) return false;
    return /^(?:[a-z]{1,3}_[a-zA-Z0-9.:-]+(?:,|$))+/i.test(seg);
  };

  let firstAssetIdx = 0;
  while (firstAssetIdx < segments.length && isTransform(segments[firstAssetIdx])) {
    firstAssetIdx++;
  }

  const assetPath = segments.slice(firstAssetIdx).join('/');
  return `${prefix}${transformSegment}/${assetPath}`;
}

/**
 * Returns intelligent fallback image path for a dish
 */
export function getDishFallbackImage(dish) {
  const id = typeof dish === 'object' ? dish?.id : '';
  if (id) {
    return `/images/dishes/${id}.jpg`;
  }
  return '/images/dishes/classic-beef-burger.jpg';
}

/* ==========================================================================
   1. MENU CARD OPTIMIZATION PIPELINE
   ========================================================================== */

/**
 * Menu Card Dimension Specifications per Layout Archetype (1x base)
 */
const MENU_CARD_SPECS = {
  bento: { width: 360, height: 270, crop: 'fill', gravity: 'auto' },       // 4:3 fluid ratio
  editorial: { width: 280, height: 320, crop: 'fill', gravity: 'auto' },   // Portrait split card
  rustic: { width: 280, height: 280, crop: 'fill', gravity: 'auto' },      // Hearth 1:1 chunky split
  boutique: { width: 180, height: 180, crop: 'fill', gravity: 'auto' },    // Circular avatar thumb
  noir: { width: 280, height: 280, crop: 'fill', gravity: 'auto' },        // Cyber precision split
  minimal: { width: 200, height: 200, crop: 'fill', gravity: 'auto' },     // Rounded square thumb
  default: { width: 240, height: 240, crop: 'fill', gravity: 'auto' },
};

/**
 * Returns optimized image URL specifically tailored for the Menu Card.
 * Uses 'auto:good' compression for fast, lightweight loading.
 */
export function getDishCardImage(dish, layout = 'bento', dpr = 1) {
  const rawUrl = typeof dish === 'string' ? dish : (dish?.image || '');
  if (!rawUrl) {
    return getDishFallbackImage(dish);
  }

  const spec = MENU_CARD_SPECS[layout] || MENU_CARD_SPECS.default;
  const targetWidth = spec.width * (dpr > 1 ? dpr : 1);
  const targetHeight = spec.height * (dpr > 1 ? dpr : 1);

  return getOptimizedImageUrl(rawUrl, {
    width: targetWidth,
    height: targetHeight,
    crop: spec.crop,
    gravity: spec.gravity,
    quality: IMAGE_OPTIMIZATION_TIERS.MENU_CARD.quality,
  });
}

/**
 * Returns responsive srcSet string (1x and 2x) for sharp display on Retina menu cards.
 */
export function getDishCardSrcSet(dish, layout = 'bento') {
  const rawUrl = typeof dish === 'string' ? dish : (dish?.image || '');
  if (!rawUrl || !rawUrl.includes('cloudinary.com')) {
    return undefined;
  }

  const img1x = getDishCardImage(dish, layout, 1);
  const img2x = getDishCardImage(dish, layout, 2);
  return `${img1x} 1x, ${img2x} 2x`;
}

/**
 * Responsive sizes hint for the menu card layout
 */
export function getDishCardSizes(layout = 'bento') {
  switch (layout) {
    case 'bento':
      return '(max-width: 640px) 48vw, (max-width: 1024px) 240px, 320px';
    case 'editorial':
    case 'rustic':
    case 'noir':
      return '(max-width: 640px) 130px, 150px';
    case 'boutique':
    case 'minimal':
      return '90px';
    default:
      return '84px';
  }
}

/**
 * Menu card layout dimensions (width and height attributes for zero CLS)
 */
export function getDishCardDimensions(layout = 'bento') {
  switch (layout) {
    case 'bento':
      return { width: 360, height: 270 };
    case 'editorial':
      return { width: 140, height: 160 };
    case 'rustic':
    case 'noir':
      return { width: 130, height: 130 };
    case 'boutique':
      return { width: 84, height: 84 };
    case 'minimal':
      return { width: 88, height: 88 };
    default:
      return { width: 84, height: 84 };
  }
}

/* ==========================================================================
   2. DETAIL CARD (POP-UP MODAL) OPTIMIZATION PIPELINE
   ========================================================================== */

/**
 * Returns high-resolution image URL optimized for the Dish Detail Pop-up Card.
 * Uses 'c_limit' with high-resolution bounds (1000x1400 at 1x, 2000x2800 at 2x)
 * and 'auto:best' quality, allowing both vertically tall and horizontally wide
 * food images to preserve their full natural aspect ratio without cropping.
 */
export function getDetailModalImage(dish, dpr = 1) {
  const rawUrl = typeof dish === 'string' ? dish : (dish?.image || '');
  if (!rawUrl) return getDishFallbackImage(dish);

  // High-res bounding box preserving orientation:
  // 1x base: 1000x1400; 2x retina: 2000x2800
  const w = Math.round(1000 * (dpr > 1 ? dpr : 1));
  const h = Math.round(1400 * (dpr > 1 ? dpr : 1));

  return getOptimizedImageUrl(rawUrl, {
    width: w,
    height: h,
    crop: 'limit',
    quality: IMAGE_OPTIMIZATION_TIERS.DETAIL_CARD.quality,
  });
}

/**
 * Returns responsive srcSet string (1x and 2x) for the dish details pop-up card.
 */
export function getDetailModalSrcSet(dish) {
  const rawUrl = typeof dish === 'string' ? dish : (dish?.image || '');
  if (!rawUrl || !rawUrl.includes('cloudinary.com')) {
    return undefined;
  }
  const img1x = getDetailModalImage(dish, 1);
  const img2x = getDetailModalImage(dish, 2);
  return `${img1x} 1x, ${img2x} 2x`;
}

/**
 * Responsive sizes hint for the pop-up card hero image
 */
export function getDetailModalSizes() {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 540px, 600px';
}

/**
 * Pop-up card hero dimensions (width and height attributes for zero CLS)
 */
export function getDetailModalDimensions() {
  return { width: 800, height: 500 };
}

/* ==========================================================================
   3. BANNERS & THUMBNAILS
   ========================================================================== */

/**
 * Returns optimized image URL specifically tailored for the Hero Section.
 * Enforces a fixed bounding box (360x360 at 1x, 720x720 at 2x) and 'fit' crop
 * with 'auto:good' compression to strictly resize without cropping any pixels.
 */
export function getHeroBannerImage(url, dpr = 1) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const mult = dpr > 1 ? dpr : 1;
  const targetSize = Math.round(360 * mult);
  return getOptimizedImageUrl(trimmed, {
    width: targetSize,
    height: targetSize,
    crop: 'fit',
    quality: IMAGE_OPTIMIZATION_TIERS.HERO_BANNER.quality,
  });
}

/**
 * Returns responsive srcSet string (1x and 2x) for the hero section banner.
 */
export function getHeroBannerSrcSet(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return undefined;
  }
  const img1x = getHeroBannerImage(url, 1);
  const img2x = getHeroBannerImage(url, 2);
  return `${img1x} 1x, ${img2x} 2x`;
}

/**
 * Responsive sizes hint for the hero banner image
 */
export function getHeroBannerSizes(layout = 'bento') {
  if (layout === 'editorial') {
    return '(max-width: 640px) 90vw, 420px';
  }
  return '(max-width: 640px) 140px, 165px';
}

/**
 * Returns small thumbnail URL for admin tables and category chips.
 */
export function getThumbnailImage(url, size = 100) {
  if (!url) return '/images/dishes/classic-beef-burger.jpg';
  return getOptimizedImageUrl(url, { width: size, height: size, crop: 'fill', gravity: 'auto' });
}
