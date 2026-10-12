'use strict';

/**
 * Real Food Video Player for Cafe QR Menu.
 * Pure real looping food video clips with clean modern cafe presentation.
 * No cartoon illustrations, and no fake camera HUDs / live streaming badges.
 */
(function () {
  const videoMap = {
    habesha: '/videos/tibs.webm',
    burgers: '/videos/burger.webm',
    pizza: '/videos/pizza.webm',
    coffee: '/videos/coffee.webm',
    desserts: '/videos/dessert.webm',
    drinks: '/videos/coffee.webm',
    breakfast: '/videos/burger.webm',
  };

  /**
   * Generates clean HTML5 looping video container with no camera HUDs or live stream tags.
   */
  function renderCategoryVideo(categoryKey) {
    const key = (categoryKey || '').toLowerCase();
    const src = videoMap[key] || '/videos/tibs.webm';

    return `
      <div class="card__video-wrap" data-video-key="${key}">
        <video class="card__real-video" autoplay muted loop playsinline preload="metadata">
          <source src="${src}" type="video/webm">
        </video>
        <div class="card__video-gradient"></div>
      </div>
    `;
  }

  window.renderCategoryIcon = renderCategoryVideo;
  window.categoryVideoMap = videoMap;
})();
