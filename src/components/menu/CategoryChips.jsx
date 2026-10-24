import React from 'react';
import {
  GridIcon,
  FlameIcon,
  BurgerIcon,
  PizzaIcon,
  CoffeeIcon,
  CakeIcon,
  DrinkIcon,
  BreakfastIcon,
} from '../common/Icons.jsx';
import { t as translate, getLocalizedCategory } from './translations.js';

export default function CategoryChips({
  categories = [],
  activeCategory = 'all',
  onSelectCategory,
  lang = 'en',
  t,
}) {
  const getT = (key) => (typeof t === 'function' ? t(key) : translate(key, lang));

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'all':
        return <GridIcon size={15} />;
      case 'habesha':
        return <FlameIcon size={15} />;
      case 'burgers':
        return <BurgerIcon size={15} />;
      case 'pizza':
        return <PizzaIcon size={15} />;
      case 'coffee':
        return <CoffeeIcon size={15} />;
      case 'desserts':
        return <CakeIcon size={15} />;
      case 'drinks':
        return <DrinkIcon size={15} />;
      case 'breakfast':
        return <BreakfastIcon size={15} />;
      default:
        return <GridIcon size={15} />;
    }
  };

  return (
    <div className="chips__row" id="chips">
      <button
        className={`chip ${activeCategory === 'all' ? 'is-active' : ''}`}
        data-category="all"
        type="button"
        onClick={() => onSelectCategory('all')}
      >
        <span className="chip__icon">{getCategoryIcon('all')}</span>
        <span className="chip__label">{getT('allCategories')}</span>
      </button>

      {categories.map((cat) => {
        const locCat = getLocalizedCategory(cat, lang);
        return (
          <button
            key={cat.id}
            className={`chip ${activeCategory === cat.id ? 'is-active' : ''}`}
            data-category={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="chip__icon">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={locCat.name}
                  style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover', display: 'inline-block' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                getCategoryIcon(cat.icon || cat.id)
              )}
            </span>
            <span className="chip__label">{locCat.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export { CategoryChips };
