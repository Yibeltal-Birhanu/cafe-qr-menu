import React, { useState, useEffect } from 'react';

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

export default function AdminDishModal({
  isOpen,
  mode, // 'addCategory' | 'editCategory' | 'addDish' | 'editDish'
  data, // category or dish object
  categories = [],
  targetCategoryId,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('coffee');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [badge, setBadge] = useState('');
  const [dietary, setDietary] = useState('');
  const [prepTime, setPrepTime] = useState('15 min');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (mode === 'addCategory') {
      setName('');
      setIcon('coffee');
    } else if (mode === 'editCategory' && data) {
      setName(data.name || '');
      setIcon(data.icon || 'coffee');
    } else if (mode === 'addDish') {
      setName('');
      setDescription('');
      setPrice('');
      setBadge('');
      setDietary('');
      setPrepTime('15 min');
      setCategoryId(targetCategoryId || (categories[0]?.id || ''));
    } else if (mode === 'editDish' && data) {
      setName(data.name || '');
      setDescription(data.description || '');
      setPrice(String(data.price || ''));
      setBadge(data.badge || '');
      setDietary(data.dietary || '');
      setPrepTime(data.prepTime || '15 min');
      setCategoryId(targetCategoryId || (categories[0]?.id || ''));
    }
  }, [isOpen, mode, data, targetCategoryId, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name.');
      return;
    }

    if (mode === 'addCategory' || mode === 'editCategory') {
      onSubmit({ name: name.trim(), icon });
    } else {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        setError('Please enter a valid price number.');
        return;
      }
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        badge: badge.trim(),
        dietary: dietary.trim(),
        prepTime: prepTime.trim(),
        categoryId: categoryId || targetCategoryId,
      });
    }
  };

  const isCategoryMode = mode === 'addCategory' || mode === 'editCategory';

  return (
    <div
      className="modal is-open"
      id="formModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal__box modal__box--left">
        <h2 id="formTitle">
          {mode === 'addCategory' && 'Add New Category'}
          {mode === 'editCategory' && 'Edit Category'}
          {mode === 'addDish' && 'Add New Dish'}
          {mode === 'editDish' && 'Edit Dish'}
        </h2>

        {error && (
          <p className="hint" style={{ color: '#ef4444', fontWeight: 600 }}>
            {error}
          </p>
        )}

        <form id="formBody" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isCategoryMode ? 'e.g. Signature Pastries' : 'e.g. Double Smash Cheeseburger'}
            />
          </label>

          {isCategoryMode ? (
            <label className="field">
              <span>Category Icon</span>
              <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                {ICON_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <>
              <label className="field">
                <span>Category</span>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Price (ETB)</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="350"
                />
              </label>

              <label className="field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe delicious ingredients, preparation style..."
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <label className="field">
                  <span>Badge Tag</span>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Popular, Spicy, Chef Special..."
                  />
                </label>
                <label className="field">
                  <span>Dietary</span>
                  <input
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="Vegan, Fasting, Halal..."
                  />
                </label>
              </div>

              <label className="field">
                <span>Prep Time</span>
                <input
                  type="text"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="15 min"
                />
              </label>
            </>
          )}

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
            <button className="btn btn--ghost" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn--primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
