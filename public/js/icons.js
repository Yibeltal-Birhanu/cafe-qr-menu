'use strict';

/**
 * Real Food Video Player for Cafe QR Menu.
 * Pure real looping food video clips with clean modern cafe presentation.
 * No cartoon illustrations, and no fake camera HUDs / live streaming badges.
 */
(function () {
  const videoMap = {
    habesha: {
      src: '/videos/tibs.webm',
      type: 'video/webm',
      poster: '',
    },
    burgers: {
      src: '/videos/burger.mp4',
      type: 'video/mp4',
      poster: '/videos/burger-poster.jpg',
    },
    pizza: {
      src: '/videos/pizza.webm',
      type: 'video/webm',
      poster: '',
    },
    coffee: {
      src: '/videos/coffee.webm',
      type: 'video/webm',
      poster: '',
    },
    desserts: {
      src: '/videos/dessert.webm',
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
   * Generates clean HTML5 looping video container with no camera HUDs or live stream tags.
   */
  function renderCategoryVideo(categoryKey) {
    const key = (categoryKey || '').toLowerCase();
    const item = videoMap[key] || videoMap.habesha;
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
