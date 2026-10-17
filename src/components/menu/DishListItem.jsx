import React from 'react';
import { ChevronRightIcon } from '../common/Icons.jsx';

export default function DishListItem({ dish, onSelect, currency = '$' }) {
  const formattedPrice =
    typeof dish.price === 'number'
      ? `${dish.currency || currency}${dish.price.toFixed(2)}`
      : `${dish.price} ${dish.currency || currency}`;

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
      <img
        src={dish.image || '/images/dishes/classic-beef-burger.jpg'}
        alt={dish.name}
        class="cm-dish-thumb"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
        }}
      />
      <div class="cm-dish-info">
        <h3 class="cm-dish-name">{dish.name}</h3>
        <p class="cm-dish-desc">{dish.description}</p>
        <div class="cm-dish-price">{formattedPrice}</div>
      </div>
      <div class="cm-dish-chevron" aria-hidden="true">
        <ChevronRightIcon size={18} />
      </div>
    </article>
  );
}
