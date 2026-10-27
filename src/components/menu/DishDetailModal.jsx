import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  CheckIcon,
  HeartIcon,
  LeafIcon,
  WheatIcon,
  SparklesIcon,
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
  layout = 'bento',
  theme,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
  }, [dish?.id, dish?.image]);

  if (!dish) return null;

  const formattedPrice = `${Number(dish.price).toLocaleString()} ${dish.currency || currency || 'ETB'}`;
  const optimizedModalImg = getDetailModalImage(dish);
  const modalSrcSet = getDetailModalSrcSet(dish);
  const modalSizes = getDetailModalSizes();

  // Extract or synthesize ingredients
  const getIngredients = () => {
    if (Array.isArray(dish.ingredients) && dish.ingredients.length > 0) {
      return dish.ingredients;
    }
    if (typeof dish.ingredients === 'string' && dish.ingredients.trim()) {
      return dish.ingredients.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (dish.description && dish.description.includes(',')) {
      const parts = dish.description
        .replace(/\.$/, '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 35);
      if (parts.length >= 2) {
        return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
      }
    }
    // Contextual fallback ingredients
    const nameLower = (dish.name || '').toLowerCase();
    if (nameLower.includes('burger')) {
      return ['Prime beef patty', 'Aged cheddar', 'Crisp lettuce', 'Vine tomato', 'House burger sauce'];
    }
    if (nameLower.includes('pizza')) {
      return ['Hand-stretched sourdough', 'San Marzano tomatoes', 'Fior di latte mozzarella', 'Fresh basil', 'EVOO'];
    }
    if (nameLower.includes('coffee') || nameLower.includes('latte') || nameLower.includes('espresso') || nameLower.includes('cappuccino')) {
      return ['Ethiopian Yirgacheffe beans', 'Organic steamed milk', 'Velvety micro-foam', 'Artisan roast'];
    }
    if (nameLower.includes('salad') || nameLower.includes('toast') || nameLower.includes('avocado')) {
      return ['Artisan sourdough bread', 'Fresh Hass avocado', 'Chili flakes', 'Organic poached egg', 'Lemon & sea salt'];
    }
    if (nameLower.includes('chicken') || nameLower.includes('wings') || nameLower.includes('grill')) {
      return ['Tender flame-grilled chicken', 'PERi-PERi marinade', 'Smoked paprika', 'Garlic & herb butter', 'Fresh coriander'];
    }
    return ['Farm fresh ingredients', 'Artisan preparation', 'Aromatic herbs & spices', 'Chef house glaze'];
  };

  // Extract or synthesize dietary badges
  const getDietaryItems = () => {
    const items = [];
    const nameLower = (dish.name || '').toLowerCase();
    const descLower = (dish.description || '').toLowerCase();
    const tags = Array.isArray(dish.tags) ? dish.tags.map((t) => t.toLowerCase()) : [];

    if (dish.dietary) {
      const parts = dish.dietary.split(',').map((s) => s.trim()).filter(Boolean);
      parts.forEach((p) => {
        const pLower = p.toLowerCase();
        const Icon = pLower.includes('gluten') ? WheatIcon : pLower.includes('vegan') || pLower.includes('veg') ? LeafIcon : SparklesIcon;
        items.push({ label: p, Icon });
      });
    }

    if (items.length === 0) {
      if (tags.includes('vegan') || nameLower.includes('vegan') || descLower.includes('vegan')) {
        items.push({ label: 'Vegan option', Icon: LeafIcon });
      } else if (tags.includes('vegetarian') || nameLower.includes('veggie') || descLower.includes('vegetarian')) {
        items.push({ label: 'Vegetarian friendly', Icon: LeafIcon });
      } else {
        items.push({ label: 'Halal certified', Icon: SparklesIcon });
      }

      if (tags.includes('gluten-free') || descLower.includes('gluten-free')) {
        items.push({ label: 'Gluten-free option', Icon: WheatIcon });
      } else {
        items.push({ label: 'Artisan crafted', Icon: WheatIcon });
      }
    }

    return items;
  };

  const ingredients = getIngredients();
  const dietaryItems = getDietaryItems();

  const toggleFavorite = () => {
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    if (onToast) {
      onToast(nextFav ? `Saved ${dish.name} to favorites` : `Removed ${dish.name} from favorites`);
    }
  };

  return (
    <div
      className={`cm-magicpath-overlay cm-magicpath-overlay--${layout}`}
      data-theme-layout={layout}
      data-theme-preset={theme?.preset}
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cm-magicpath-container">
        {/* Top Hero Figure matching MagicPath smoothly-field-6269 */}
        <figure className="cm-mp-figure">
          <img
            src={hasError ? getDishFallbackImage(dish) : optimizedModalImg}
            srcSet={hasError ? undefined : modalSrcSet}
            sizes={hasError ? undefined : modalSizes}
            alt={dish.name}
            className={`cm-mp-hero-img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
            loading="eager"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              if (!hasError) {
                setHasError(true);
                setImageLoaded(true);
              }
            }}
          />

          {/* Vignette gradient overlay */}
          <div className="cm-mp-gradient-overlay" aria-hidden="true" />

          {/* Floating Back to Menu Button */}
          <button
            type="button"
            aria-label="Back to menu"
            onClick={onClose}
            className="cm-mp-btn-back"
          >
            <ArrowLeftIcon size={21} strokeWidth={2.2} />
          </button>

          {/* Floating Favorite Button */}
          <button
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            onClick={toggleFavorite}
            className="cm-mp-btn-fav"
            style={{ color: isFavorite ? '#ef4444' : '#2D2D2D' }}
          >
            <HeartIcon size={20} filled={isFavorite} />
          </button>

          <figcaption className="sr-only">{dish.name}</figcaption>
        </figure>

        {/* Content Section matching MagicPath */}
        <section className="cm-mp-content" aria-labelledby="item-title">
          {/* Header Row: Subtitle + Title + Price */}
          <header className="cm-mp-header">
            <div className="cm-mp-header-left">
              <p className="cm-mp-badge">
                {dish.badge || dish.categoryName || 'Chef recommendation'}
              </p>
              <h1 id="item-title" className="cm-mp-title">
                {dish.name}
              </h1>
            </div>
            <p className="cm-mp-price">{formattedPrice}</p>
          </header>

          {/* Description */}
          {dish.description && (
            <p className="cm-mp-description">{dish.description}</p>
          )}

          {/* Clean Hairline Divider */}
          <div className="cm-mp-divider" aria-hidden="true" />

          {/* Ingredients Section */}
          <section className="cm-mp-section" aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading" className="cm-mp-section-title">
              Ingredients
            </h2>
            <ul className="cm-mp-ingredients-grid">
              {ingredients.map((ing) => (
                <li key={ing} className="cm-mp-ingredient-item">
                  <span className="cm-mp-check-circle">
                    <CheckIcon size={12} strokeWidth={3} />
                  </span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Dietary Info Section */}
          <section className="cm-mp-section cm-mp-section--dietary" aria-labelledby="dietary-heading">
            <h2 id="dietary-heading" className="cm-mp-section-title">
              Dietary Info
            </h2>
            <ul className="cm-mp-dietary-pills">
              {dietaryItems.map(({ label, Icon }) => (
                <li key={label} className="cm-mp-dietary-pill">
                  <Icon size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Clean Bottom Return / Action Button */}
          <div className="cm-mp-actions-footer">
            <button
              type="button"
              className={`cm-mp-btn-order cm-mp-btn-order--${layout}`}
              onClick={onClose}
            >
              Back to Menu
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
