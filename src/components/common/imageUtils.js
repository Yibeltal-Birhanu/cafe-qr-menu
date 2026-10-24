/**
 * Image Optimization and Responsive Sizing Engine
 * Automatically optimizes Cloudinary and local dish images to fit card dimensions:
 * - f_auto: Serves modern formats (WebP, AVIF) based on browser support
 * - q_auto: Intelligent compression balancing fidelity and file size
 * - c_fill / c_limit: Crops and resizes to exact card boundary
 * - g_auto: Content-aware gravity focusing on the dish subject
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
  } = options;

  const parts = [];
  if (format) parts.push(`f_${format}`);
  if (quality) parts.push(`q_${quality}`);
  if (crop) parts.push(`c_${crop}`);
  if (crop === 'fill' && gravity) parts.push(`g_${gravity}`);
  if (width) parts.push(`w_${Math.round(width)}`);
  if (height) parts.push(`h_${Math.round(height)}`);

  const transformSegment = parts.join(',');
  if (!transformSegment) return trimmed;

  // Split around /image/upload/
  const splitIdx = trimmed.indexOf('/image/upload/');
  if (splitIdx === -1) return trimmed;

  const prefix = trimmed.slice(0, splitIdx + '/image/upload/'.length);
  const remainder = trimmed.slice(splitIdx + '/image/upload/'.length);

  // Check if remainder already starts with transformation segment like "f_auto,q_auto.../"
  // Transformations don't start with "v" followed by numbers
  const hasExistingTransforms = /^([a-zA-Z0-9_,:-]+)\/(v[0-9]+.*|[a-zA-Z0-9_-].*)$/.test(remainder);
  if (hasExistingTransforms && !remainder.startsWith('v')) {
    const nextSlash = remainder.indexOf('/');
    const rest = remainder.slice(nextSlash + 1);
    return `${prefix}${transformSegment}/${rest}`;
  }

  return `${prefix}${transformSegment}/${remainder}`;
}

/**
 * Returns optimized image URL sized specifically to the card dimensions of each template layout.
 */
export function getDishCardImage(dish, layout = 'bento') {
  const rawUrl = typeof dish === 'string' ? dish : (dish?.image || '');
  if (!rawUrl) return '/images/dishes/classic-beef-burger.jpg';

  // Responsive target dimensions for each card layout
  switch (layout) {
    case 'bento':
      // 2-column grid on mobile, 16:10 aspect ratio
      return getOptimizedImageUrl(rawUrl, { width: 440, height: 280, crop: 'fill', gravity: 'auto' });
    case 'editorial':
      // Split card with portrait/square thumb on left
      return getOptimizedImageUrl(rawUrl, { width: 280, height: 320, crop: 'fill', gravity: 'auto' });
    case 'rustic':
      // Chunky hearth horizontal card
      return getOptimizedImageUrl(rawUrl, { width: 280, height: 280, crop: 'fill', gravity: 'auto' });
    case 'boutique':
      // Parisian circular badge thumb
      return getOptimizedImageUrl(rawUrl, { width: 220, height: 220, crop: 'fill', gravity: 'auto' });
    case 'noir':
      // Cyber/lounge card
      return getOptimizedImageUrl(rawUrl, { width: 280, height: 280, crop: 'fill', gravity: 'auto' });
    case 'minimal':
      // Rounded square thumb
      return getOptimizedImageUrl(rawUrl, { width: 220, height: 220, crop: 'fill', gravity: 'auto' });
    default:
      return getOptimizedImageUrl(rawUrl, { width: 320, height: 240, crop: 'fill', gravity: 'auto' });
  }
}

/**
 * Returns high-resolution image URL optimized for the dish details modal view.
 */
export function getDetailModalImage(dish) {
  const rawUrl = typeof dish === 'string' ? dish : (dish?.image || '');
  if (!rawUrl) return '/images/dishes/classic-beef-burger.jpg';
  return getOptimizedImageUrl(rawUrl, { width: 900, height: 600, crop: 'limit' });
}

/**
 * Returns high-resolution image URL optimized for hero banners and category headers.
 */
export function getHeroBannerImage(url) {
  if (!url) return '';
  return getOptimizedImageUrl(url, { width: 1200, height: 600, crop: 'limit' });
}
