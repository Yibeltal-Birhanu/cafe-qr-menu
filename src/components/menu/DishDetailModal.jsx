import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  HeartIcon,
  StarIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  FlameIcon,
} from '../common/Icons.jsx';

export default function DishDetailModal({ dish, onClose, onAddToOrder, currency = '$' }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!dish) return null;

  const formattedPrice =
    typeof dish.price === 'number'
      ? `${dish.currency || currency}${(dish.price * quantity).toFixed(2)}`
      : `${dish.price} ${dish.currency || currency}`;

  const rating = dish.rating || 4.8;
  const reviews = dish.reviews || 120;
  const tags = dish.tags && dish.tags.length > 0 ? dish.tags : ['Chef Special', 'Freshly Prepared'];

  const handleOrder = () => {
    onAddToOrder(dish, quantity);
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
      <div class="cm-modal-sheet">
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
              aria-label="Go back"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              type="button"
              class="cm-circle-btn"
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{ color: isFavorite ? '#ef4444' : '#ffffff' }}
            >
              <HeartIcon size={18} filled={isFavorite} />
            </button>
          </div>
        </div>

        {/* Modal Sheet Body */}
        <div class="cm-modal-body">
          {/* Title & Price */}
          <div class="cm-modal-row-head">
            <h2 class="cm-modal-title" id="modalDishTitle">{dish.name}</h2>
            <div class="cm-modal-price">{formattedPrice}</div>
          </div>

          {/* Rating */}
          <div class="cm-modal-rating">
            <span class="cm-star-icon" aria-hidden="true">
              <StarIcon size={16} />
            </span>
            <span>{rating}</span>
            <span class="cm-rating-count">({reviews} reviews)</span>
          </div>

          {/* Description */}
          <p class="cm-modal-description">
            {dish.fullDescription || dish.description}
          </p>

          {/* Dietary Badges */}
          <div class="cm-modal-tags">
            {tags.map((tag, idx) => (
              <span key={idx} class="cm-diet-tag">
                {tag.toLowerCase().includes('spicy') && <FlameIcon size={13} style={{ color: '#ef4444' }} />}
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Quantity Stepper */}
          <div class="cm-modal-quantity-row">
            <span class="cm-quantity-label">Quantity</span>
            <div class="cm-stepper">
              <button
                type="button"
                class="cm-stepper-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <MinusIcon size={14} />
              </button>
              <span class="cm-stepper-value">{quantity}</span>
              <button
                type="button"
                class="cm-stepper-btn"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <PlusIcon size={14} />
              </button>
            </div>
          </div>

          {/* Add to Order Button */}
          <button
            type="button"
            class="cm-btn-order"
            onClick={handleOrder}
          >
            <ShoppingBagIcon size={18} />
            <span>Add to Order &bull; {formattedPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
