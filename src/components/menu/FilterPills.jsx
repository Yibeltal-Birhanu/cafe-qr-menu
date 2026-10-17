import React from 'react';
import { t as translate } from './translations.js';

export default function FilterPills({
  activeFilter = 'all',
  onSelectFilter,
  lang = 'en',
  t,
}) {
  const getT = (key) => (typeof t === 'function' ? t(key) : translate(key, lang));

  const filters = [
    { key: 'all', label: getT('allDishes') },
    { key: 'popular', label: getT('filterPopular') },
    { key: 'spicy', label: getT('filterSpicy') },
    { key: 'new', label: getT('filterNew') },
    { key: 'signature', label: getT('filterSignature') },
  ];

  return (
    <div className="filters-row" id="filtersRow">
      {filters.map((f) => (
        <button
          key={f.key}
          className={`filter-pill ${activeFilter === f.key ? 'is-active' : ''}`}
          data-filter={f.key}
          id={`pill${f.key.charAt(0).toUpperCase() + f.key.slice(1)}`}
          type="button"
          onClick={() => onSelectFilter(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export { FilterPills };
