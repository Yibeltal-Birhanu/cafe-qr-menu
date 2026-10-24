import React from 'react';
import DishCard from './DishCard.jsx';
import { videoMap } from './mediaData.js';
import { t, getLocalizedCategory, getLocalizedItem } from './translations.js';

function getCategoryBannerTag(categoryId, lang = 'en') {
  if (lang === 'am') {
    const amTags = {
      habesha: 'የሸክላ ጥብስ • እንጀራ',
      burgers: 'በእሳት የተጠበሰ • ብሪዮሽ',
      pizza: 'በምድጃ የተጋገረ • 30 ሳ.ሜ',
      coffee: 'የይርጋጨፌ ቡና • ትኩስ',
      drinks: 'ቀዝቃዛ የተዘጋጀ • አይስድ',
      desserts: 'በየቀኑ የሚጋገር',
      breakfast: 'ትኩስ የጥዋት ቁርስ',
    };
    return amTags[categoryId] || 'ልዩ ዝግጅት';
  }
  const tags = {
    habesha: 'Sizzling Clay Skillet • Injera',
    burgers: 'Flame-Grilled • Brioche',
    pizza: 'Stone-Baked • 30cm',
    coffee: 'Single Origin • Fresh Buna',
    drinks: 'Artisan Chilled • Iced',
    desserts: 'House Baked Daily',
    breakfast: 'Fresh Mornings',
  };
  return tags[categoryId] || 'Chef Special';
}

function getCategoryMedia(categoryKey) {
  const rawKey = (categoryKey || '').toLowerCase();
  let key = rawKey;
  if (key === 'burger') key = 'burgers';
  if (key === 'dessert') key = 'desserts';
  if (key === 'drink') key = 'drinks';

  return videoMap[key] || videoMap[rawKey] || videoMap.habesha;
}

export default function DishGrid({
  categories = [],
  activeCategory = 'all',
  dietaryFilter = 'all',
  searchQuery = '',
  currency = 'ETB',
  onDishClick,
  lang = 'en',
}) {
  const q = searchQuery.trim().toLowerCase();
  const filter = dietaryFilter.toLowerCase();

  const filteredCategories = categories
    .filter((cat) => activeCategory === 'all' || cat.id === activeCategory)
    .map((cat) => {
      let items = cat.items || [];

      // Filter by query
      if (q) {
        items = items.filter((rawItem) => {
          const loc = getLocalizedItem(rawItem, lang);
          return (
            `${rawItem.name} ${rawItem.description} ${rawItem.badge} ${loc.name} ${loc.description}`
              .toLowerCase()
              .includes(q)
          );
        });
      }

      // Filter by dietary pill
      if (filter !== 'all') {
        items = items.filter((item) => {
          const b = (item.badge || '').toLowerCase();
          const d = (item.description || '').toLowerCase();
          if (filter === 'popular') return b.includes('popular') || b.includes('signature');
          if (filter === 'spicy') return b.includes('spicy') || b.includes('hot') || d.includes('chilli') || d.includes('jalapeno');
          if (filter === 'new') return b.includes('new');
          if (filter === 'signature') return b.includes('signature') || b.includes('chef');
          return true;
        });
      }

      return { ...cat, items };
    })
    .filter(
      (cat) =>
        (!q && filter === 'all') ||
        cat.items.length > 0 ||
        (q && cat.name.toLowerCase().includes(q))
    );

  if (!filteredCategories.length) {
    return (
      <div id="emptyState" className="empty" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <strong>{t('noDishesFound', lang)}</strong>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>{t('noDishesHint', lang)}</p>
      </div>
    );
  }

  return (
    <div className="grid" id="grid">
      {filteredCategories.map((cat) => {
        const locCat = getLocalizedCategory(cat, lang);
        const tag = getCategoryBannerTag(cat.id, lang);
        const media = cat.image
          ? { type: 'image', src: cat.image, alt: locCat?.name || cat.name || cat.id }
          : getCategoryMedia(cat.id || cat.icon);

        return (
          <article
            key={cat.id}
            className={`card card--${cat.id}`}
            id={`cat-${cat.id}`}
            data-category={cat.id}
          >
            <div className="card__art" data-video-key={cat.id}>
              <span className="card__tag-pill">{tag}</span>
              <div className="card__video-wrap" data-video-key={cat.id}>
                {media.type === 'image' ? (
                  <img
                    className="card__real-video card__real-img"
                    src={media.src}
                    alt={media.alt || cat.id}
                    loading="eager"
                  />
                ) : (
                  <video
                    className="card__real-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={media.poster}
                  >
                    <source src={media.src} type="video/mp4" />
                  </video>
                )}
                <div className="card__video-gradient"></div>
              </div>
            </div>

            <div className="card__body">
              <div className="card__head">
                <div>
                  <h2 className="card__title">{locCat.name}</h2>
                  {locCat.description && <p className="card__note">{locCat.description}</p>}
                </div>
                <span className="card__count">
                  {cat.items.length} {t('dishesCount', lang)}
                </span>
              </div>

              <ul className="items">
                {cat.items.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    category={cat}
                    currency={currency}
                    lang={lang}
                    onClick={onDishClick}
                  />
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
