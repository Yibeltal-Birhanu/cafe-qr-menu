import React, { useEffect } from 'react';
import { getDishMedia } from './mediaData.js';
import { getLocalizedItem, getLocalizedCategory, t } from './translations.js';
import { StarIcon, FlameIcon, ZapIcon } from '../common/Icons.jsx';

export default function DishModal({ item, category, currency = 'ETB', lang = 'en', onClose }) {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const locItem = getLocalizedItem(item, lang);
  const locCat = category ? getLocalizedCategory(category, lang) : { name: '' };
  const media = getDishMedia(item, category);

  const getBadgeIcon = (badge) => {
    const b = (badge || '').toLowerCase();
    if (b.includes('spicy') || b.includes('hot')) return <FlameIcon size={12} />;
    if (b.includes('star') || b.includes('popular') || b.includes('signature')) return <StarIcon size={12} />;
    return <ZapIcon size={12} />;
  };

  const getBadgeClass = (badge) => {
    const b = (badge || '').toLowerCase();
    if (b.includes('spicy') || b.includes('hot')) return 'badge badge--spicy';
    if (b.includes('popular')) return 'badge badge--popular';
    if (b.includes('chef') || b.includes('special')) return 'badge badge--chef';
    if (b.includes('signature')) return 'badge badge--signature';
    return 'badge';
  };

  return (
    <div
      className="modal is-open"
      id="dishModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalDishName"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal__dish-card">
        <button
          className="modal__close-btn"
          id="closeDishModal"
          type="button"
          aria-label="Close details"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Video / Photo Stage */}
        <div className="modal__dish-video-stage" id="modalDishVideoStage">
          {media.type === 'video' ? (
            <div className="card__video-wrap">
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
              <div className="card__video-gradient" />
            </div>
          ) : (
            <div className="card__video-wrap card__video-wrap--dish">
              <img
                src={media.src}
                alt={locItem.name}
                className="card__real-video card__real-img"
                loading="eager"
              />
              <div className="card__video-gradient" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="modal__dish-content">
          <div className="modal__dish-header">
            <div>
              <span className="modal__dish-cat" id="modalDishCategory">
                {locCat.name}
              </span>
              <h2 className="modal__dish-title" id="modalDishName">
                {locItem.name}
              </h2>
            </div>
            <div className="modal__dish-price" id="modalDishPrice">
              {Number(item.price).toLocaleString()} {currency}
            </div>
          </div>

          <div className="modal__dish-badges" id="modalDishBadges">
            {item.badge && (
              <span className={getBadgeClass(item.badge)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {getBadgeIcon(item.badge)}
                <span>{item.badge}</span>
              </span>
            )}
            {item.dietary && (
              <span className="badge badge--veg" style={{ marginLeft: item.badge ? '0.4rem' : '0' }}>
                {item.dietary}
              </span>
            )}
          </div>

          <p className="modal__dish-desc" id="modalDishDesc">
            {locItem.description || ''}
          </p>

          <div className="modal__dish-meta">
            <div className="modal__dish-meta-item" id="modalDishPrepRow">
              <span className="meta-label" id="modalPrepLabel">
                {t('prepLabel', lang)}
              </span>
              <strong id="modalDishPrep">
                {item.prepTime || (lang === 'am' ? '15 ደቂቃ' : '15 min')}
              </strong>
            </div>
            <div className="modal__dish-meta-item" id="modalDishDietRow">
              <span className="meta-label" id="modalDietLabel">
                {t('dietLabel', lang)}
              </span>
              <strong id="modalDishDiet">
                {item.dietary || t('freshMade', lang)}
              </strong>
            </div>
          </div>

          <div className="modal__dish-footer">
            <button
              className="btn btn--primary"
              id="modalDoneBtn"
              type="button"
              onClick={onClose}
            >
              {t('backToMenu', lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
