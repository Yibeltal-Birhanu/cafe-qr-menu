'use strict';

/**
 * Real Food Media Player for Cafe QR Menu.
 * High-definition looping video clips & authentic food photography
 * with clean modern cafe presentation.
 */
(function () {
  const videoMap = {
    habesha: {
      src: '/images/habesha.jpg',
      type: 'image',
      alt: 'Habesha Specials - Authentic Ethiopian Platter with Teff Injera',
    },
    burger: {
      src: '/videos/burger.mp4',
      type: 'video/mp4',
      poster: '/videos/burger-poster.jpg',
    },
    burgers: {
      src: '/videos/burger.mp4',
      type: 'video/mp4',
      poster: '/videos/burger-poster.jpg',
    },
    pizza: {
      src: '/images/pizza.jpg',
      type: 'image',
      alt: 'Stone-baked artisan pizza with melting mozzarella cheese stretch',
    },
    coffee: {
      src: '/videos/coffee.webm',
      type: 'video/webm',
      poster: '',
    },
    dessert: {
      src: '/videos/dessert.webm',
      type: 'video/webm',
      poster: '',
    },
    desserts: {
      src: '/videos/dessert.webm',
      type: 'video/webm',
      poster: '',
    },
    drink: {
      src: '/videos/coffee.webm',
      type: 'video/webm',
      poster: '',
    },
    drinks: {
      src: '/videos/coffee.webm',
      type: 'video/webm',
      poster: '',
    },
    breakfast: {
      src: '/videos/burger.mp4',
      type: 'video/mp4',
      poster: '/videos/burger-poster.jpg',
    },
  };

  /**
   * Generates clean HTML5 media container (video or image) with no camera HUDs or live stream tags.
   */
  function renderCategoryVideo(categoryKey) {
    const rawKey = (categoryKey || '').toLowerCase();
    let key = rawKey;
    if (key === 'burger') key = 'burgers';
    if (key === 'dessert') key = 'desserts';
    if (key === 'drink') key = 'drinks';

    const item = videoMap[key] || videoMap[rawKey] || videoMap.habesha;

    if (item.type === 'image') {
      return `
        <div class="card__video-wrap" data-video-key="${key}">
          <img class="card__real-video card__real-img" src="${item.src}" alt="${item.alt || key}" loading="eager" />
          <div class="card__video-gradient"></div>
        </div>
      `;
    }

    const posterAttr = item.poster ? ` poster="${item.poster}"` : '';

    return `
      <div class="card__video-wrap" data-video-key="${key}">
        <video class="card__real-video" autoplay muted loop playsinline preload="auto"${posterAttr}>
          <source src="${item.src}" type="${item.type}">
        </video>
        <div class="card__video-gradient"></div>
      </div>
    `;
  }

  window.renderCategoryIcon = renderCategoryVideo;
  window.categoryVideoMap = videoMap;
})();
