import React, { useState, useEffect } from 'react';
import { ChevronRightIcon } from '../common/Icons.jsx';

const PHOTO_PRESETS = [
  { label: 'Beef Tibs', path: '/images/dishes/special-beef-tibs.jpg' },
  { label: 'Doro Wat', path: '/images/dishes/doro-wat-special.jpg' },
  { label: 'Kitfo', path: '/images/dishes/special-kitfo.jpg' },
  { label: 'Beyeaynetu', path: '/images/dishes/beyeaynetu-fasting-platter.jpg' },
  { label: 'Shiro', path: '/images/dishes/shiro-tegabino.jpg' },
  { label: 'Burger', path: '/images/dishes/classic-beef-burger.jpg' },
  { label: 'Chicken', path: '/images/dishes/crispy-chicken-burger.jpg' },
  { label: 'Pizza', path: '/images/dishes/four-cheese.jpg' },
  { label: 'Buna', path: '/images/dishes/traditional-buna-ceremony.jpg' },
  { label: 'Latte', path: '/images/dishes/caramel-latte.jpg' },
  { label: 'Cheesecake', path: '/images/dishes/cheesecake.jpg' },
  { label: 'Smoothie', path: '/images/dishes/mango-smoothie.jpg' },
];

const TAG_OPTIONS = [
  'Prime Beef',
  'Spicy',
  'Slow-Cooked',
  '100% Vegan',
  'Fasting',
  'Injera',
  'Contains Gluten',
  'Chef Special',
  'Single Origin',
  'Hot',
  'Iced',
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
  const [image, setImage] = useState('/images/dishes/classic-beef-burger.jpg');
  const [badge, setBadge] = useState('');
  const [dietary, setDietary] = useState('');
  const [prepTime, setPrepTime] = useState('15 min');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
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
      setImage('/images/dishes/classic-beef-burger.jpg');
      setBadge('');
      setDietary('');
      setPrepTime('15 min');
      setCategoryId(targetCategoryId || (categories[0]?.id || ''));
      setSelectedTags(['Chef Special']);
    } else if (mode === 'editDish' && data) {
      setName(data.name || '');
      setDescription(data.description || '');
      setPrice(String(data.price || ''));
      setImage(data.image || '/images/dishes/classic-beef-burger.jpg');
      setBadge(data.badge || '');
      setDietary(data.dietary || '');
      setPrepTime(data.prepTime || '15 min');
      setCategoryId(data.categoryId || targetCategoryId || (categories[0]?.id || ''));
      setSelectedTags(data.tags && data.tags.length > 0 ? data.tags : ['Chef Special']);
    }
  }, [isOpen, mode, data, targetCategoryId, categories]);

  if (!isOpen) return null;

  const isDishMode = mode === 'addDish' || mode === 'editDish';

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name.');
      return;
    }

    if (isDishMode) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        setError('Please provide a valid price (e.g. 350).');
        return;
      }

      onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        image,
        badge: badge.trim(),
        dietary: dietary.trim(),
        prepTime,
        categoryId: categoryId || (categories[0]?.id || ''),
        tags: selectedTags,
      });
    } else {
      onSubmit({
        name: name.trim(),
        icon,
      });
    }
  };

  return (
    <div
      class="ad-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div class="ad-dish-modal-box">
        {/* Header */}
        <div class="ad-modal-header-row">
          <div>
            <h3 class="ad-modal-heading">
              {mode === 'addDish' && 'Add New Menu Item'}
              {mode === 'editDish' && 'Edit Menu Item'}
              {mode === 'addCategory' && 'Add New Category'}
              {mode === 'editCategory' && 'Edit Category'}
            </h3>
            <p class="ad-modal-subheading">
              {isDishMode
                ? 'Fill in the item details to publish or update on your live digital menu.'
                : 'Configure the category name and icon for your digital menu sections.'}
            </p>
          </div>
          <button
            type="button"
            class="ad-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isDishMode ? (
            /* ================= 2-COLUMN DISH FORM ================= */
            <div class="ad-form-split-layout">
              {/* Left Column: Form Fields */}
              <div class="ad-form-col">
                <div>
                  <label class="ad-field-label">Item Name *</label>
                  <input
                    type="text"
                    class="ad-form-input"
                    placeholder="e.g. Special Beef Tibs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label class="ad-field-label">Category *</label>
                    <select
                      class="ad-form-input"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label class="ad-field-label">Price (ETB) *</label>
                    <input
                      type="number"
                      class="ad-form-input"
                      placeholder="e.g. 450"
                      min="0"
                      step="any"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label class="ad-field-label">Description</label>
                  <textarea
                    class="ad-form-input ad-form-textarea"
                    placeholder="Describe the flavors, ingredients, and preparation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Dietary Tags Pill Selector */}
                <div>
                  <label class="ad-field-label">Tags &amp; Badges</label>
                  <div class="ad-tags-picker">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        class={`ad-tag-pill ${selectedTags.includes(tag) ? 'is-active' : ''}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Presets & URL */}
                <div>
                  <label class="ad-field-label">Choose Food Photography</label>
                  <div class="ad-photo-presets-grid">
                    {PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.path}
                        type="button"
                        class={`ad-preset-thumb-btn ${image === preset.path ? 'is-selected' : ''}`}
                        onClick={() => setImage(preset.path)}
                        title={preset.label}
                      >
                        <img src={preset.path} alt={preset.label} />
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.6rem' }}>
                    <input
                      type="text"
                      class="ad-form-input"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
                      placeholder="Or enter custom image URL: /images/dishes/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Menu Card Preview */}
              <div class="ad-form-col">
                <div class="ad-live-preview-box">
                  <span class="ad-live-preview-title">Live Customer Card Preview</span>

                  {/* Customer Card Simulator */}
                  <div
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      borderRadius: '18px',
                      padding: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #eaedf1',
                    }}
                  >
                    <img
                      src={image || '/images/dishes/classic-beef-burger.jpg'}
                      alt="Preview"
                      style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '14px',
                        objectFit: 'cover',
                        background: '#f3f4f6',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          margin: '0 0 2px',
                          color: '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {name || 'Delicious Dish Name'}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: '#6b7280',
                          lineHeight: 1.35,
                          margin: '0 0 4px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {description || 'Mouth-watering ingredients and freshly prepared culinary recipe.'}
                      </p>
                      <strong style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827' }}>
                        {price ? `${price} ETB` : '350 ETB'}
                      </strong>
                    </div>
                    <div style={{ color: '#9ca3af', paddingRight: '0.2rem' }}>
                      <ChevronRightIcon size={18} />
                    </div>
                  </div>

                  {/* Selected Tags Display */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '1rem', justifyContent: 'center' }}>
                    {selectedTags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: '#eef0f3',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          color: '#4b5563',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginTop: '1.2rem', margin: '1.2rem 0 0' }}>
                    This card appears immediately on customer mobile and desktop menus upon saving.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ================= CATEGORY FORM ================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label class="ad-field-label">Category Name *</label>
                <input
                  type="text"
                  class="ad-form-input"
                  placeholder="e.g. Traditional Specialties"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label class="ad-field-label">Category Icon</label>
                <select
                  class="ad-form-input"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                >
                  <option value="habesha">Habesha (Traditional Flame)</option>
                  <option value="coffee">Coffee (Artisan Cup)</option>
                  <option value="burgers">Burgers (Gourmet Bun)</option>
                  <option value="pizza">Pizza (Stone-Baked)</option>
                  <option value="breakfast">Breakfast (Morning Feast)</option>
                  <option value="desserts">Desserts (Handcrafted Sweets)</option>
                  <option value="drinks">Drinks (Chilled Refreshment)</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.8rem', borderTop: '1px solid #eaedf1', paddingTop: '1.2rem' }}>
            <button
              type="button"
              class="ad-btn-action-secondary"
              onClick={onClose}
              style={{ width: 'auto', padding: '0.65rem 1.4rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="ad-btn-action-primary"
              style={{ width: 'auto', padding: '0.65rem 1.6rem' }}
            >
              <span>{isDishMode ? 'Save Menu Item' : 'Save Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
