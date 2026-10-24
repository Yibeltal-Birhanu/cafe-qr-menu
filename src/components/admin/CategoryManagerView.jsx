import React, { useState } from 'react';
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
  GridIcon,
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header Bar with Stats */}
      <div
        class="ad-panel-card"
        style={{
          padding: '1.6rem 1.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 class="ad-card-title" style={{ fontSize: '1.4rem' }}>
              Menu Categories
            </h2>
            <p class="ad-card-sub">
              Curate and order your digital menu sections. Customers explore your dishes in this exact sequence.
            </p>
          </div>

          <button
            type="button"
            class="ad-btn-add"
            onClick={onAddCategory}
            style={{ padding: '0.65rem 1.4rem' }}
          >
            <PlusIcon size={16} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Quick Stats & Controls Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid #f3f4f6',
            paddingTop: '1rem',
          }}
        >
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div class="ad-header-search" style={{ width: '220px' }}>
              <SearchIcon size={14} className="ad-header-search-icon" />
              <input
                type="text"
                class="ad-header-search-input"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div class="ad-filter-pills-row" style={{ margin: 0 }}>
              <button
                type="button"
                class={`ad-filter-pill-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid visual view"
              >
                Grid
              </button>
              <button
                type="button"
                class={`ad-filter-pill-btn ${viewMode === 'list' ? 'is-active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Compact list view"
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Categories Presentation */}
      {filteredCategories.length > 0 ? (
        viewMode === 'grid' ? (
          /* ================= GRID VIEW ================= */
          <div class="ad-cat-grid">
            {filteredCategories.map((cat) => {
              const originalIndex = categories.findIndex((c) => c.id === cat.id);
              const items = cat.items || [];
              const itemCount = items.length;
              const prices = items.map((i) => i.price).filter((p) => typeof p === 'number');
              const minPrice = prices.length > 0 ? Math.min(...prices) : null;
              const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

              return (
                <div key={cat.id} class="ad-cat-card">
                  {/* Visual Header Banner */}
                  <div
                    class="ad-cat-banner"
                    style={{ backgroundImage: `url(${getCategoryCover(cat)})` }}
                  >
                    <div class="ad-cat-banner-gradient" />

                    {/* Sequence Badge with Up/Down buttons */}
                    <div class="ad-cat-seq-badge">
                      <span>#{originalIndex + 1}</span>
                      <button
                        type="button"
                        class="ad-btn-arrow"
                        disabled={originalIndex === 0}
                        onClick={() => handleMoveUp(originalIndex)}
                        title="Move left/up"
                        style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                      >
                        &#9650;
                      </button>
                      <button
                        type="button"
                        class="ad-btn-arrow"
                        disabled={originalIndex === categories.length - 1}
                        onClick={() => handleMoveDown(originalIndex)}
                        title="Move right/down"
                        style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                      >
                        &#9660;
                      </button>
                    </div>

                    {/* Dish Count Pill */}
                    <span class="ad-cat-count-pill">
                      {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
                    </span>

                    {/* Category Icon Badge */}
                    <div class="ad-cat-icon-badge">{getCategoryIcon(cat.icon)}</div>
                  </div>

                  {/* Body */}
                  <div class="ad-cat-body">
                    <div class="ad-cat-header-row">
                      <h3 class="ad-cat-title">{cat.name}</h3>
                      {minPrice !== null && (
                        <span class="ad-cat-price-pill">
                          {minPrice === maxPrice
                            ? `${minPrice} ${currency}`
                            : `${minPrice} – ${maxPrice} ${currency}`}
                        </span>
                      )}
                    </div>

                    <div class="ad-cat-id-tag">ID: {cat.id}</div>

                    {/* Dishes Strip */}
                    <div class="ad-cat-dishes-strip">
                      {items.slice(0, 3).map((dish) => (
                        <div key={dish.id} class="ad-cat-dish-item">
                          <img
                            src={dish.image || '/images/dishes/classic-beef-burger.jpg'}
                            alt={dish.name}
                            class="ad-cat-dish-thumb"
                            onError={(e) => {
                              e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
                            }}
                          />
                          <div class="ad-cat-dish-info">
                            <p class="ad-cat-dish-name">{dish.name}</p>
                          </div>
                          <span class="ad-cat-dish-price">
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
                  <div class="ad-cat-footer">
                    <button
                      type="button"
                      class="ad-btn-action-secondary"
                      onClick={() => onAddDish(cat.id)}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', width: 'auto' }}
                    >
                      <PlusIcon size={14} />
                      <span>Add Dish</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        class="ad-icon-action"
                        onClick={() => onEditCategory(cat)}
                        title={`Edit ${cat.name}`}
                      >
                        <EditIcon size={15} />
                      </button>
                      <button
                        type="button"
                        class="ad-icon-action ad-icon-action--delete"
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
          /* ================= LIST VIEW ================= */
          <div class="ad-panel-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table class="ad-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '70px', textAlign: 'center' }}>Order</th>
                  <th style={{ width: '80px' }}>Cover</th>
                  <th>Category</th>
                  <th>Dishes</th>
                  <th>Price Range</th>
                  <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, index) => {
                  const originalIndex = categories.findIndex((c) => c.id === cat.id);
                  const items = cat.items || [];
                  const prices = items.map((i) => i.price).filter((p) => typeof p === 'number');
                  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
                  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

                  return (
                    <tr key={cat.id}>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <button
                            type="button"
                            class="ad-btn-arrow"
                            disabled={originalIndex === 0}
                            onClick={() => handleMoveUp(originalIndex)}
                            title="Move up"
                          >
                            &#9650;
                          </button>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>#{originalIndex + 1}</span>
                          <button
                            type="button"
                            class="ad-btn-arrow"
                            disabled={originalIndex === categories.length - 1}
                            onClick={() => handleMoveDown(originalIndex)}
                            title="Move down"
                          >
                            &#9660;
                          </button>
                        </div>
                      </td>
                      <td>
                        <img
                          src={getCategoryCover(cat)}
                          alt={cat.name}
                          style={{ width: '48px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ color: 'var(--ad-primary)' }}>{getCategoryIcon(cat.icon)}</span>
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--ad-text-dark)' }}>{cat.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>ID: {cat.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="ad-tag-dish" style={{ background: '#f3f4f6', color: '#374151', fontWeight: 700 }}>
                          {items.length} items
                        </span>
                      </td>
                      <td>
                        {minPrice !== null ? (
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#142820' }}>
                            {minPrice === maxPrice
                              ? `${minPrice} ${currency}`
                              : `${minPrice} – ${maxPrice} ${currency}`}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>No items</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            class="ad-btn-action-secondary"
                            onClick={() => onAddDish(cat.id)}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', width: 'auto' }}
                          >
                            + Dish
                          </button>
                          <button
                            type="button"
                            class="ad-icon-action"
                            onClick={() => onEditCategory(cat)}
                            title="Edit"
                          >
                            <EditIcon size={14} />
                          </button>
                          <button
                            type="button"
                            class="ad-icon-action ad-icon-action--delete"
                            onClick={() => onDeleteCategory(cat)}
                            title="Delete"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div class="ad-panel-card" style={{ textAlign: 'center', padding: '3.5rem', color: '#6b7280' }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            No categories matched "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
}
