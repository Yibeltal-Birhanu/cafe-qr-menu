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
      src: '/images/coffee.jpg',
      type: 'image',
      alt: 'Traditional Ethiopian Buna Coffee Ceremony',
    },
    dessert: {
      src: '/images/desserts.jpg',
      type: 'image',
      alt: 'Artisan Gourmet Desserts & Cakes',
    },
    desserts: {
      src: '/images/desserts.jpg',
      type: 'image',
      alt: 'Artisan Gourmet Desserts & Cakes',
    },
    drink: {
      src: '/images/drinks.jpg',
      type: 'image',
      alt: 'Refreshing Cold Drinks & Fresh Fruit Juices',
    },
    drinks: {
      src: '/images/drinks.jpg',
      type: 'image',
      alt: 'Refreshing Cold Drinks & Fresh Fruit Juices',
    },
    breakfast: {
      src: '/images/breakfast.jpg',
      type: 'image',
      alt: 'Fresh Morning Breakfast & Artisan Brunch',
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

  /**
   * Renders the authentic individual food photo for each specific menu item in the detail modal.
   */
  function renderDishMedia(dish, category) {
    if (!dish) return '';
    const itemId = dish.id;
    const catId = category && category.id ? category.id : 'habesha';
    const catFallback = videoMap[catId] ? videoMap[catId].src : '/images/habesha.jpg';
    const dishImg = dish.image || `/images/dishes/${itemId}.jpg`;

    return `
      <div class="card__video-wrap card__video-wrap--dish" data-item-id="${itemId}">
        <img class="card__real-video card__real-img" src="${dishImg}" alt="${dish.name || itemId}" loading="eager" onerror="this.onerror=null;this.src='${catFallback}';" />
        <div class="card__video-gradient"></div>
      </div>
    `;
  }

  window.renderCategoryIcon = renderCategoryVideo;
  window.renderDishMedia = renderDishMedia;
  window.categoryVideoMap = videoMap;
  window.CategoryIconKeys = ['habesha', 'burgers', 'pizza', 'coffee', 'desserts', 'drinks', 'breakfast'];
})();
