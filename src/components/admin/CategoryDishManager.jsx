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

const ICON_KEYS = [
  'habesha',
  'burgers',
  'pizza',
  'coffee',
  'breakfast',
  'desserts',
  'drinks',
  'sandwich',
];

export default function CategoryDishManager({
  categories = [],
  currency = 'ETB',
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onAddDish,
  onUpdateDish,
  onDeleteDish,
}) {
  const [search, setSearch] = useState('');

  const getCategoryIcon = (iconKey) => {
    switch (iconKey) {
      case 'burgers':
        return <BurgerIcon size={28} />;
      case 'pizza':
        return <PizzaIcon size={28} />;
      case 'desserts':
        return <CakeIcon size={28} />;
      case 'drinks':
        return <DrinkIcon size={28} />;
      case 'breakfast':
        return <BreakfastIcon size={28} />;
      case 'habesha':
        return <FlameIcon size={28} />;
      default:
        return <CoffeeIcon size={28} />;
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

  const q = search.trim().toLowerCase();

  return (
    <div className="panel">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
          marginBottom: '0.8rem',
        }}
      >
        <div>
          <h2 className="panel__title" style={{ margin: 0 }}>
            Categories &amp; Food Items
          </h2>
          <p className="hint">
            Edit any name, price, badge, or description. Saves automatically as you type.
          </p>
        </div>
        <div style={{ maxWidth: '260px', width: '100%' }}>
          <input
            id="adminSearchInput"
            placeholder="Filter dishes in admin..."
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="cats" id="cats">
        {categories.map((cat, index) => {
          const items = cat.items || [];
          const displayItems = q
            ? items.filter(
                (item) =>
                  item.name.toLowerCase().includes(q) ||
                  (item.description && item.description.toLowerCase().includes(q)) ||
                  (item.badge && item.badge.toLowerCase().includes(q)) ||
                  cat.name.toLowerCase().includes(q)
              )
            : items;

          if (q && displayItems.length === 0 && !cat.name.toLowerCase().includes(q)) {
            return null;
          }

          return (
            <article className="cat" data-cat={cat.id} key={cat.id}>
              <div className="cat__head">
                <div className="cat__art" data-art={cat.id}>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    getCategoryIcon(cat.icon || cat.id)
                  )}
                </div>
                <div className="cat__fields">
                  <label className="field">
                    <span>Category name</span>
                    <input
                      data-cat-id={cat.id}
                      data-field="name"
                      value={cat.name}
                      onChange={(e) => onUpdateCategory(cat.id, { name: e.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span>Illustration</span>
                    <select
                      data-cat-id={cat.id}
                      data-field="icon"
                      value={cat.icon || cat.id}
                      onChange={(e) => onUpdateCategory(cat.id, { icon: e.target.value })}
                    >
                      {ICON_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field cat__desc">
                    <span>Description</span>
                    <input
                      data-cat-id={cat.id}
                      data-field="description"
                      value={cat.description || ''}
                      onChange={(e) => onUpdateCategory(cat.id, { description: e.target.value })}
                    />
                  </label>
                </div>
                <div className="cat__actions">
                  <button
                    className="btn btn--ghost btn--tiny"
                    data-move="up"
                    data-cat-id={cat.id}
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                  >
                    &uarr;
                  </button>
                  <button
                    className="btn btn--ghost btn--tiny"
                    data-move="down"
                    data-cat-id={cat.id}
                    type="button"
                    disabled={index === categories.length - 1}
                    onClick={() => handleMoveDown(index)}
                  >
                    &darr;
                  </button>
                  <button
                    className="btn btn--danger btn--tiny"
                    data-delete-cat={cat.id}
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete category "${cat.name}" and all its dishes?`)) {
                        onDeleteCategory(cat.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="cat__body">
                <div className="item-row item-row--head">
                  <span>Name</span>
                  <span>Description</span>
                  <span>Price</span>
                  <span>Badge</span>
                  <span>Category</span>
                  <span></span>
                </div>

                {displayItems.length === 0 ? (
                  <p className="hint">No dishes yet &mdash; add the first one below.</p>
                ) : (
                  displayItems.map((item) => (
                    <div className="item-row" data-item-row={item.id} key={item.id}>
                      <input
                        data-item-id={item.id}
                        data-field="name"
                        value={item.name}
                        placeholder="Dish name"
                        title="Dish name"
                        onChange={(e) => onUpdateDish(item.id, { name: e.target.value })}
                      />
                      <input
                        data-item-id={item.id}
                        data-field="description"
                        value={item.description || ''}
                        placeholder="Description"
                        title="Description"
                        onChange={(e) => onUpdateDish(item.id, { description: e.target.value })}
                      />
                      <input
                        data-item-id={item.id}
                        data-field="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        title="Price"
                        onChange={(e) => onUpdateDish(item.id, { price: Number(e.target.value) || 0 })}
                      />
                      <input
                        data-item-id={item.id}
                        data-field="badge"
                        value={item.badge || ''}
                        placeholder="Badge (e.g. Popular)"
                        title="Badge"
                        onChange={(e) => onUpdateDish(item.id, { badge: e.target.value })}
                      />
                      <select
                        data-item-id={item.id}
                        data-field="categoryId"
                        value={cat.id}
                        title="Category"
                        onChange={(e) => onUpdateDish(item.id, { categoryId: e.target.value })}
                      >
                        {categories.map((entry) => (
                          <option key={entry.id} value={entry.id}>
                            {entry.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn--danger btn--tiny"
                        data-delete-item={item.id}
                        type="button"
                        title="Delete dish"
                        onClick={() => {
                          if (window.confirm(`Delete dish "${item.name}"?`)) {
                            onDeleteDish(item.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}

                <div className="cat__foot">
                  <button
                    className="btn btn--primary btn--tiny"
                    data-add-item={cat.id}
                    type="button"
                    onClick={() => onAddDish(cat.id)}
                  >
                    + Add Dish
                  </button>
                  <span className="hint">
                    {cat.items.length} {cat.items.length === 1 ? 'dish' : 'dishes'} in {currency}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div id="catsEmpty" className="empty">
          <strong>No categories found</strong>Add your first category to start building the menu.
        </div>
      )}
    </div>
  );
}
