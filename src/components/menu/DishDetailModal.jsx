import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  XIcon,
  HeartIcon,
  ClockIcon,
} from '../common/Icons.jsx';
import {
  getDetailModalImage,
  getDetailModalSrcSet,
  getDetailModalSizes,
  getDishFallbackImage,
} from '../common/imageUtils.js';

export default function DishDetailModal({
  dish,
  onClose,
  onToast,
  currency = 'ETB',
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [orientation, setOrientation] = useState('horizontal'); // 'vertical' | 'square' | 'horizontal'

  useEffect(() => {
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

  // Reset image loaded & orientation state if dish changes
  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    setAspectRatio(null);
    setOrientation('horizontal');
  }, [dish?.id, dish?.image]);

  if (!dish) return null;

  const formattedPrice = `${Number(dish.price).toLocaleString()} ${dish.currency || currency || 'ETB'}`;
  const tags = dish.tags && dish.tags.length > 0 ? dish.tags : [];
  const optimizedModalImg = getDetailModalImage(dish);
  const modalSrcSet = getDetailModalSrcSet(dish);
  const modalSizes = getDetailModalSizes();

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setAspectRatio(ratio);
      if (ratio < 0.95) {
        setOrientation('vertical');
      } else if (ratio <= 1.18) {
        setOrientation('square');
      } else {
        setOrientation('horizontal');
      }
    }
    setImageLoaded(true);
  };

  const toggleFavorite = () => {
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    if (onToast) {
      onToast(nextFav ? `Saved ${dish.name} to favorites` : `Removed ${dish.name} from favorites`);
    }
  };

  return (
    <div
      className="cm-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalDishTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cm-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Top Drag Indicator for Phone Bottom-Sheet View */}
        <div className="cm-modal-drag-bar" aria-hidden="true" />

        {/* Hero image container dynamically flexing with the image dimensions */}
        <div
          className={`cm-modal-hero ${imageLoaded ? 'is-loaded' : 'is-loading'} cm-modal-hero--${orientation}`}
          style={aspectRatio ? { '--modal-hero-ratio': `${aspectRatio}` } : undefined}
        >
          <img
            src={hasError ? getDishFallbackImage(dish) : optimizedModalImg}
            srcSet={hasError ? undefined : modalSrcSet}
            sizes={hasError ? undefined : modalSizes}
            alt={dish.name}
            className={`cm-modal-hero-img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
            loading="eager"
            decoding="async"
            onLoad={handleImageLoad}
            onError={() => {
              if (!hasError) {
                setHasError(true);
                setImageLoaded(true);
              }
            }}
          />

          {dish.badge && (
            <span className="cm-modal-hero-badge">{dish.badge}</span>
          )}

          <div className="cm-modal-top-actions">
            <button
              type="button"
              className="cm-circle-btn"
              onClick={onClose}
              aria-label="Close details"
              title="Close"
            >
              <ChevronLeftIcon size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className="cm-circle-btn"
                onClick={toggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                style={{ color: isFavorite ? '#ef4444' : '#ffffff' }}
              >
                <HeartIcon size={18} filled={isFavorite} />
              </button>
              <button
                type="button"
                className="cm-circle-btn"
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
        <div className="cm-modal-body">
          {/* Title & Price */}
          <div className="cm-modal-row-head">
            <h2 className="cm-modal-title" id="modalDishTitle">{dish.name}</h2>
            <div className="cm-modal-price">{formattedPrice}</div>
          </div>

          {/* Prep Time Meta */}
          {dish.prepTime ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.85rem', fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
              <ClockIcon size={14} />
              <span>Prepared fresh in {dish.prepTime}</span>
            </div>
          ) : null}

          {/* Description */}
          {dish.fullDescription || dish.description ? (
            <p className="cm-modal-description">
              {dish.fullDescription || dish.description}
            </p>
          ) : null}

          {/* Dietary / Feature Tags */}
          {tags.length > 0 && (
            <div className="cm-modal-tags">
              {tags.map((tag) => (
                <span key={tag} className="cm-modal-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Close Action */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              className="cm-btn cm-btn--primary"
              style={{ width: '100%', padding: '0.85rem', borderRadius: '12px' }}
              onClick={onClose}
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
