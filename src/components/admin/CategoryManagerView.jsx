import React from 'react';
import {
  CoffeeIcon,
  BurgerIcon,
  PizzaIcon,
  CakeIcon,
  DrinkIcon,
  BreakfastIcon,
  FlameIcon,
} from '../common/Icons.jsx';
import { PlusIcon, EditIcon, TrashIcon } from './AdminIcons.jsx';

export default function CategoryManagerView({
  categories = [],
  currency = 'ETB',
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories,
  onAddDish,
}) {
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

  const totalDishes = categories.reduce((sum, c) => sum + (c.items ? c.items.length : 0), 0);

  return (
    <div class="ad-panel-card" style={{ padding: '1.8rem' }}>
      {/* Header */}
      <div class="ad-card-header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 class="ad-card-title" style={{ fontSize: '1.35rem' }}>Menu Categories</h3>
          <p class="ad-card-sub">
            Organize your menu sections. Items appear in this exact order on customer digital menus ({categories.length} categories, {totalDishes} dishes).
          </p>
        </div>

        <button
          type="button"
          class="ad-btn-add"
          onClick={onAddCategory}
          aria-label="Add new category"
        >
          <PlusIcon size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Cards List */}
      <div class="ad-category-list">
        {categories.length > 0 ? (
          categories.map((cat, index) => {
            const itemCount = cat.items ? cat.items.length : 0;
            const previewItems = (cat.items || []).slice(0, 4);

            return (
              <div key={cat.id} class="ad-category-item-card">
                <div class="ad-category-left-col">
                  {/* Reorder Up / Down Controls */}
                  <div class="ad-reorder-btns" aria-label="Reorder category">
                    <button
                      type="button"
                      class="ad-btn-arrow"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      title="Move category up"
                      aria-label={`Move ${cat.name} up`}
                    >
                      &#9650;
                    </button>
                    <button
                      type="button"
                      class="ad-btn-arrow"
                      disabled={index === categories.length - 1}
                      onClick={() => handleMoveDown(index)}
                      title="Move category down"
                      aria-label={`Move ${cat.name} down`}
                    >
                      &#9660;
                    </button>
                  </div>

                  {/* Icon Box */}
                  <div class="ad-category-icon-box" aria-hidden="true">
                    {getCategoryIcon(cat.icon)}
                  </div>

                  {/* Details */}
                  <div class="ad-category-details">
                    <h4 class="ad-category-name">{cat.name}</h4>
                    <div class="ad-category-meta">
                      <span class="ad-category-count-badge">
                        {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
                      </span>
                      <span>ID: <code>{cat.id}</code></span>
                    </div>
                  </div>
                </div>

                {/* Mini Thumbs Preview */}
                {previewItems.length > 0 && (
                  <div class="ad-category-thumbs-preview" title="Dishes in this category">
                    {previewItems.map((item) => (
                      <img
                        key={item.id}
                        src={item.image || '/images/dishes/classic-beef-burger.jpg'}
                        alt={item.name}
                        class="ad-mini-thumb"
                        onError={(e) => {
                          e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
                        }}
                      />
                    ))}
                    {itemCount > 4 && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6c757d' }}>
                        +{itemCount - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Right Actions */}
                <div class="ad-category-right-actions">
                  <button
                    type="button"
                    class="ad-btn-action-secondary"
                    onClick={() => onAddDish(cat.id)}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <PlusIcon size={14} />
                    <span>Add Dish</span>
                  </button>

                  <button
                    type="button"
                    class="ad-icon-action"
                    onClick={() => onEditCategory(cat)}
                    title="Edit category"
                    aria-label={`Edit ${cat.name}`}
                  >
                    <EditIcon size={16} />
                  </button>

                  <button
                    type="button"
                    class="ad-icon-action ad-icon-action--delete"
                    onClick={() => onDeleteCategory(cat)}
                    title="Delete category"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
            No categories found. Click "+ Add Category" to start building your menu.
          </div>
        )}
      </div>
    </div>
  );
}
