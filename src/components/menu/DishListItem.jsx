import React from 'react';
import { ChevronRightIcon, ClockIcon } from '../common/Icons.jsx';
import { getDishCardImage } from '../common/imageUtils.js';

export default function DishListItem({ dish, onSelect, currency = 'ETB', layout = 'bento' }) {
  const formattedPrice = `${dish.price} ${dish.currency || currency || 'ETB'}`;
  const optimizedSrc = getDishCardImage(dish, layout);

  return (
    <article
      className={`cm-dish-card cm-dish-card--${layout}`}
      data-layout={layout}
      onClick={() => onSelect(dish)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(dish);
        }
      }}
      aria-label={`View details for ${dish.name}`}
    >
      <div className="cm-dish-thumb-wrap">
        <img
          src={optimizedSrc}
          alt={dish.name}
          className="cm-dish-thumb"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
          }}
        />
        {dish.badge && (
          <span className="cm-dish-overlay-badge">{dish.badge}</span>
        )}
      </div>
      <div className="cm-dish-info">
        <div className="cm-dish-header-row">
          <h3 className="cm-dish-name">{dish.name}</h3>
          {dish.badge && <span className="cm-dish-badge">{dish.badge}</span>}
        </div>
        <p className="cm-dish-desc">{dish.description}</p>
        <div className="cm-dish-footer-row">
          <div className="cm-dish-price">{formattedPrice}</div>
          {dish.prepTime && (
            <span className="cm-dish-preptime">
              <ClockIcon size={12} />
              <span>{dish.prepTime}</span>
            </span>
          )}
        </div>
      </div>
      <div className="cm-dish-chevron" aria-hidden="true">
        <ChevronRightIcon size={18} />
      </div>
    </article>
  );
}
