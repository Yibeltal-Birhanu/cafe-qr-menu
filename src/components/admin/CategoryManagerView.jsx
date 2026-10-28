import React, { useState } from 'react';
import { getThumbnailImage, getDishFallbackImage } from '../common/imageUtils.js';
import {
  CoffeeIcon,
  BurgerIcon,
  PizzaIcon,
  CakeIcon,
  DrinkIcon,
  BreakfastIcon,
  FlameIcon,
} from '../common/Icons.jsx';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  CutleryIcon,
} from './AdminIcons.jsx';

const CATEGORY_COVERS = {
  habesha: '/images/habesha.jpg',
  coffee: '/images/coffee.jpg',
  burgers: '/images/dishes/classic-beef-burger.jpg',
  pizza: '/images/pizza.jpg',
  breakfast: '/images/breakfast.jpg',
  desserts: '/images/desserts.jpg',
  drinks: '/images/drinks.jpg',
};

export default function CategoryManagerView({
  categories = [],
  currency = 'ETB',
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories,
  onAddDish,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (iconKey) => {
    switch (iconKey) {
      case 'burgers':
        return <BurgerIcon size={22} />;
      case 'pizza':
        return <PizzaIcon size={22} />;
      case 'desserts':
        return <CakeIcon size={22} />;
      case 'drinks':
        return <DrinkIcon size={22} />;
      case 'breakfast':
        return <BreakfastIcon size={22} />;
      case 'habesha':
        return <FlameIcon size={22} />;
      default:
        return <CoffeeIcon size={22} />;
    }
  };

  const getCategoryCover = (cat) => {
    return cat.image || CATEGORY_COVERS[cat.icon] || CATEGORY_COVERS[cat.id] || '/images/coffee.jpg';
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const order = categories.map((c) => c.id);
    const temp = order[index - 1];
    order[index - 1] = order[index];
    order[index] = temp;
    onReorderCategories(order);
  };

  const handleMoveDown = (index) => {
    if (index === categories.length - 1) return;
    const order = categories.map((c) => c.id);
    const temp = order[index + 1];
    order[index + 1] = order[index];
    order[index] = temp;
    onReorderCategories(order);
  };

  const totalDishes = categories.reduce(
    (sum, c) => sum + (c.items ? c.items.length : 0),
    0
  );

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(query) ||
      cat.id.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0 }}>
      {/* 1. Header Bar with Stats */}
      <div
        className="ad-panel-card"
        style={{
          padding: '1.6rem 1.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        <div className="ad-cat-header-strip">
          <div>
            <h2 className="ad-card-title" style={{ fontSize: '1.4rem' }}>
              Menu Categories
            </h2>
            <p className="ad-card-sub">
              Curate and order your digital menu sections. Customers explore your dishes in this exact sequence.
            </p>
          </div>

          <button
            type="button"
            className="ad-btn-add"
            onClick={onAddCategory}
            style={{ padding: '0.65rem 1.4rem' }}
          >
            <PlusIcon size={16} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Quick Stats & Controls Strip */}
        <div className="ad-cat-stats-strip">
          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#13221e' }}>
              <strong>{categories.length}</strong> Categories
            </span>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>&bull;</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#13221e' }}>
              <strong>{totalDishes}</strong> Dishes Total
            </span>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>&bull;</span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#065f46',
                background: '#e6f7f0',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              All Published Live
            </span>
          </div>

          {/* Search & View Toggle */}
          <div className="ad-cat-search-group">
            <div className="ad-cat-search-box">
              <span className="ad-cat-search-icon" aria-hidden="true">
                <SearchIcon size={15} />
              </span>
              <input
                type="text"
                className="ad-cat-search-input"
                placeholder="Search categories by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchQuery('');
                }}
                aria-label="Search categories"
              />
              {searchQuery.trim() && (
                <>
                  <span className="ad-cat-match-badge">
                    {filteredCategories.length} {filteredCategories.length === 1 ? 'match' : 'matches'}
                  </span>
                  <button
                    type="button"
                    className="ad-cat-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    aria-label="Clear category search"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Categories Presentation */}
      {filteredCategories.length > 0 ? (
        <div className="ad-cat-grid">
          {filteredCategories.map((cat) => {
            const originalIndex = categories.findIndex((c) => c.id === cat.id);
            const items = cat.items || [];
            const itemCount = items.length;
            const prices = items.map((i) => i.price).filter((p) => typeof p === 'number');
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

            return (
              <div key={cat.id} className="ad-cat-card">
                  {/* Visual Header Banner */}
                  <div
                    className="ad-cat-banner"
                    style={{ backgroundImage: `url(${getCategoryCover(cat)})` }}
                  >
                    <div className="ad-cat-banner-gradient" />

                    {/* Sequence Badge with Up/Down buttons */}
                    <div className="ad-cat-seq-badge">
                      <span>#{originalIndex + 1}</span>
                      <button
                        type="button"
                        className="ad-btn-arrow"
                        disabled={originalIndex === 0}
                        onClick={() => handleMoveUp(originalIndex)}
                        title="Move left/up"
                        style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                      >
                        &#9650;
                      </button>
                      <button
                        type="button"
                        className="ad-btn-arrow"
                        disabled={originalIndex === categories.length - 1}
                        onClick={() => handleMoveDown(originalIndex)}
                        title="Move right/down"
                        style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                      >
                        &#9660;
                      </button>
                    </div>

                    {/* Dish Count Pill & Custom Cover Indicator */}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px', zIndex: 2 }}>
                      {cat.image && (
                        <span
                          style={{
                            background: 'rgba(19, 34, 30, 0.88)',
                            backdropFilter: 'blur(6px)',
                            color: '#34d399',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          }}
                          title="Custom cover image uploaded"
                        >
                          Custom Cover
                        </span>
                      )}
                      <span className="ad-cat-count-pill" style={{ position: 'static' }}>
                        {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
                      </span>
                    </div>

                    {/* Category Icon Badge */}
                    <div className="ad-cat-icon-badge">{getCategoryIcon(cat.icon)}</div>
                  </div>

                  {/* Body */}
                  <div className="ad-cat-body">
                    <div className="ad-cat-header-row">
                      <h3 className="ad-cat-title">{cat.name}</h3>
                      {minPrice !== null && (
                        <span className="ad-cat-price-pill">
                          {minPrice === maxPrice
                            ? `${minPrice} ${currency}`
                            : `${minPrice} – ${maxPrice} ${currency}`}
                        </span>
                      )}
                    </div>

                    {cat.description && (
                      <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '3px 0 6px', lineHeight: 1.35 }}>
                        {cat.description}
                      </p>
                    )}

                    <div className="ad-cat-id-tag">ID: {cat.id}</div>

                    {/* Dishes Strip */}
                    <div className="ad-cat-dishes-strip">
                      {items.slice(0, 3).map((dish) => (
                        <div key={dish.id} className="ad-cat-dish-item">
                          <img
                            src={getThumbnailImage(dish.image, 60)}
                            alt={dish.name}
                            className="ad-cat-dish-thumb"
                            onError={(e) => {
                              e.currentTarget.src = getDishFallbackImage(dish);
                            }}
                          />
                          <div className="ad-cat-dish-info">
                            <p className="ad-cat-dish-name">{dish.name}</p>
                          </div>
                          <span className="ad-cat-dish-price">
                            {dish.price} {currency}
                          </span>
                        </div>
                      ))}

                      {itemCount === 0 && (
                        <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af', fontSize: '0.8rem' }}>
                          No dishes yet. Click "+ Add Dish" below.
                        </div>
                      )}

                      {itemCount > 3 && (
                        <div style={{ textAlign: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
                            +{itemCount - 3} more dishes in menu
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="ad-cat-footer">
                    <button
                      type="button"
                      className="ad-btn-action-secondary"
                      onClick={() => onAddDish(cat.id)}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', width: 'auto' }}
                    >
                      <PlusIcon size={14} />
                      <span>Add Dish</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="ad-icon-action"
                        onClick={() => onEditCategory(cat)}
                        title={`Edit ${cat.name}`}
                      >
                        <EditIcon size={15} />
                      </button>
                      <button
                        type="button"
                        className="ad-icon-action ad-icon-action--delete"
                        onClick={() => onDeleteCategory(cat)}
                        title={`Delete ${cat.name}`}
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ad-cat-empty-search-card">
            <div className="ad-cat-empty-search-icon" aria-hidden="true">
              <SearchIcon size={24} />
            </div>
          <h4 className="ad-cat-empty-search-title">No categories found</h4>
          <p className="ad-cat-empty-search-sub">
            No categories match "<strong>{searchQuery}</strong>". Try clearing your search or checking your spelling.
          </p>
          <button
            type="button"
            className="ad-btn-action-secondary"
            onClick={() => setSearchQuery('')}
            style={{ marginTop: '0.4rem', padding: '0.45rem 1rem', fontSize: '0.8rem' }}
          >
            Clear Search Filter
          </button>
        </div>
      )}
    </div>
  );
}
