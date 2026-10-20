import React from 'react';
import { ChevronRightIcon, ClockIcon } from '../common/Icons.jsx';

export default function DishListItem({ dish, onSelect, currency = 'ETB' }) {
  const formattedPrice = `${dish.price} ${dish.currency || currency || 'ETB'}`;

  return (
    <article
      class="cm-dish-card"
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
      <div class="cm-dish-thumb-wrap">
        <img
          src={dish.image || '/images/dishes/classic-beef-burger.jpg'}
          alt={dish.name}
          class="cm-dish-thumb"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
          }}
        />
        {dish.badge && (
          <span class="cm-dish-overlay-badge">{dish.badge}</span>
        )}
      </div>
      <div class="cm-dish-info">
        <div class="cm-dish-header-row">
          <h3 class="cm-dish-name">{dish.name}</h3>
          {dish.badge && <span class="cm-dish-badge">{dish.badge}</span>}
        </div>
        <p class="cm-dish-desc">{dish.description}</p>
        <div class="cm-dish-footer-row">
          <div class="cm-dish-price">{formattedPrice}</div>
          {dish.prepTime && (
            <span class="cm-dish-preptime">
              <ClockIcon size={12} />
              <span>{dish.prepTime}</span>
            </span>
          )}
        </div>
      </div>
      <div class="cm-dish-chevron" aria-hidden="true">
        <ChevronRightIcon size={18} />
      </div>
    </article>
  );
}
