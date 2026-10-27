import React, { useState } from 'react';
import { ChevronRightIcon, ClockIcon, EyeIcon, StarIcon } from '../common/Icons.jsx';
import {
  getDishCardImage,
  getDishCardSrcSet,
  getDishCardSizes,
  getDishCardDimensions,
  getDishFallbackImage,
} from '../common/imageUtils.js';

export default function DishListItem({ dish, onSelect, currency = 'ETB', layout = 'bento' }) {
  const formattedPrice = `${dish.price} ${dish.currency || currency || 'ETB'}`;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = getDishCardImage(dish, layout);
  const srcSet = getDishCardSrcSet(dish, layout);
  const sizes = getDishCardSizes(layout);
  const dimensions = getDishCardDimensions(layout);

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
      <div className={`cm-dish-thumb-wrap ${imageLoaded ? 'is-loaded' : 'is-loading'}`}>
        <img
          src={hasError ? getDishFallbackImage(dish) : optimizedSrc}
          srcSet={hasError ? undefined : srcSet}
          sizes={hasError ? undefined : sizes}
          alt={dish.name}
          className={`cm-dish-thumb ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
          loading="lazy"
          decoding="async"
          width={dimensions.width}
          height={dimensions.height}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!hasError) {
              setHasError(true);
              setImageLoaded(true);
            }
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
          <div className="cm-dish-meta-left">
            <span className="cm-dish-rating">
              <StarIcon size={12} className="cm-star-icon" />
              <span>{dish.rating || '4.5'}</span>
            </span>
            {dish.prepTime && (
              <span className="cm-dish-preptime">
                <ClockIcon size={12} />
                <span>{dish.prepTime}</span>
              </span>
            )}
          </div>
          <div className="cm-dish-price">{formattedPrice}</div>
          {/* Circular Accent Detail Button matching Reference Design */}
          <button
            type="button"
            className={`cm-dish-plus-btn cm-dish-detail-btn cm-dish-plus-btn--${layout}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(dish);
            }}
            aria-label={`View details for ${dish.name}`}
            title={`View details for ${dish.name}`}
          >
            <EyeIcon size={14} />
          </button>
        </div>
      </div>

      <div className="cm-dish-chevron" aria-hidden="true">
        <ChevronRightIcon size={18} />
      </div>
    </article>
  );
}
