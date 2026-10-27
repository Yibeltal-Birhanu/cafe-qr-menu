import React, { useState } from 'react';
import { getDishCardImage, getDishFallbackImage } from '../common/imageUtils.js';

export default function SpecialCard({ dish, onSelect, currency = 'ETB' }) {
  const [hasError, setHasError] = useState(false);
  const formattedPrice = `${Number(dish.price).toLocaleString()} ${dish.currency || currency || 'ETB'}`;
  const optimizedImg = getDishCardImage(dish, 'bento');

  return (
    <article
      onClick={() => onSelect(dish)}
      className="cm-special-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(dish);
        }
      }}
      aria-label={`View details for special ${dish.name}`}
    >
      <div className="cm-special-card-img-wrap">
        <img
          src={hasError ? getDishFallbackImage(dish) : optimizedImg}
          alt={dish.name}
          className="cm-special-card-img"
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
        {/* Floating Price Pill Tag matching MagicPath HomeScreen.tsx */}
        <div className="cm-special-card-price-pill" aria-label={`Price: ${formattedPrice}`}>
          <span>{formattedPrice}</span>
        </div>
      </div>

      <div className="cm-special-card-body">
        <h3 className="cm-special-card-title">{dish.name}</h3>
        {dish.description && (
          <p className="cm-special-card-desc">{dish.description}</p>
        )}
      </div>
    </article>
  );
}
