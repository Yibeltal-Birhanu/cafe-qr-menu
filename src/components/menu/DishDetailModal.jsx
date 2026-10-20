import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  HeartIcon,
  StarIcon,
  FlameIcon,
  XIcon,
  ClockIcon,
  CheckIcon,
} from '../common/Icons.jsx';

export default function DishDetailModal({ dish, onClose, currency = 'ETB', onToast }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!dish) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dish, onClose]);

  if (!dish) return null;

  const formattedPrice = `${Number(dish.price).toLocaleString()} ${dish.currency || currency || 'ETB'}`;
  const rating = dish.rating || 4.8;
  const reviews = dish.reviews || 120;
  const tags = dish.tags && dish.tags.length > 0 ? dish.tags : ['Chef Special', 'Freshly Prepared'];

  const toggleFavorite = () => {
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    if (onToast) {
      onToast(nextFav ? `Saved ${dish.name} to favorites` : `Removed ${dish.name} from favorites`);
    }
  };

  return (
    <div
      class="cm-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalDishTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div class="cm-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Top Drag Indicator for Phone Bottom-Sheet View */}
        <div class="cm-modal-drag-bar" aria-hidden="true" />

        {/* Hero image with back & favorite floating buttons */}
        <div class="cm-modal-hero">
          <img
            src={dish.image || '/images/dishes/classic-beef-burger.jpg'}
            alt={dish.name}
            class="cm-modal-hero-img"
            onError={(e) => {
              e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
            }}
          />
          <div class="cm-modal-top-actions">
            <button
              type="button"
              class="cm-circle-btn"
              onClick={onClose}
              aria-label="Close details"
              title="Close"
            >
              <ChevronLeftIcon size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                class="cm-circle-btn"
                onClick={toggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                style={{ color: isFavorite ? '#ef4444' : '#ffffff' }}
              >
                <HeartIcon size={18} filled={isFavorite} />
              </button>
              <button
                type="button"
                class="cm-circle-btn"
                onClick={onClose}
                aria-label="Close"
                title="Close"
              >
                <XIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Sheet Body */}
        <div class="cm-modal-body">
          {/* Title & Price */}
          <div class="cm-modal-row-head">
            <h2 class="cm-modal-title" id="modalDishTitle">{dish.name}</h2>
            <div class="cm-modal-price">{formattedPrice}</div>
          </div>

          {/* Rating & Prep Meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div class="cm-modal-rating" style={{ marginBottom: 0 }}>
              <span class="cm-star-icon" aria-hidden="true">
                <StarIcon size={16} />
              </span>
              <span>{rating}</span>
              <span class="cm-rating-count">({reviews} reviews)</span>
            </div>

            {dish.prepTime && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
                <ClockIcon size={14} />
                <span>{dish.prepTime}</span>
              </span>
            )}
          </div>

          {/* Description */}
          <p class="cm-modal-description">
            {dish.fullDescription || dish.description || 'Expertly prepared with fresh, premium ingredients for your dining enjoyment.'}
          </p>

          {/* Dietary & Highlight Badges */}
          <div class="cm-modal-tags">
            {tags.map((tag, idx) => (
              <span key={idx} class="cm-diet-tag">
                {tag.toLowerCase().includes('spicy') && <FlameIcon size={13} style={{ color: '#ef4444' }} />}
                {tag.toLowerCase().includes('popular') && <StarIcon size={13} style={{ color: '#eab308' }} />}
                <span>{tag}</span>
              </span>
            ))}
            {dish.dietary && (
              <span class="cm-diet-tag" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
                <CheckIcon size={13} />
                <span>{dish.dietary}</span>
              </span>
            )}
          </div>

          {/* View-only Close / Back action */}
          <div style={{ marginTop: '1.2rem', paddingTop: '0.5rem' }}>
            <button
              type="button"
              class="cm-btn-order"
              onClick={onClose}
              aria-label="Back to menu"
            >
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
