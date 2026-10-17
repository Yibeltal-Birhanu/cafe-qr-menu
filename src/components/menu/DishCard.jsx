import React from 'react';
import { ClockIcon } from '../common/Icons.jsx';
import { t, getLocalizedItem } from './translations.js';

export default function DishCard({
  item,
  category,
  currency = 'ETB',
  lang = 'en',
  onClick,
}) {
  const locItem = getLocalizedItem(item, lang);
  const isAvailable = item.soldOut !== true && item.available !== false;

  const getBadgeClass = (badge) => {
    const b = (badge || '').toLowerCase();
    if (b.includes('popular')) return 'badge badge--popular';
    if (b.includes('spicy') || b.includes('hot')) return 'badge badge--spicy';
    if (b.includes('signature')) return 'badge badge--signature';
    if (b.includes('new')) return 'badge badge--new';
    if (b.includes('chef')) return 'badge badge--chef';
    return 'badge';
  };

  const getBadgeLabel = (badge) => {
    const b = (badge || '').toLowerCase();
    if (b.includes('popular')) return t('badgePopular', lang);
    if (b.includes('spicy')) return t('badgeSpicy', lang);
    if (b.includes('signature')) return t('badgeSignature', lang);
    if (b.includes('new')) return t('badgeNew', lang);
    if (b.includes('chef')) return t('badgeChef', lang);
    return badge;
  };

  return (
    <li
      className={`item ${!isAvailable ? 'is-unavailable' : ''}`}
      data-item-id={item.id}
      data-cat-id={category?.id}
      tabIndex={0}
      role="button"
      title={t('tapForDetails', lang)}
      onClick={() => onClick && onClick(item, category)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick(item, category);
        }
      }}
    >
      <div className="item__main">
        <div className="item__top">
          <span className="item__name">
            {locItem.name}
            {item.badge && (
              <span className={getBadgeClass(item.badge)} style={{ marginLeft: '0.4rem' }}>
                {getBadgeLabel(item.badge)}
              </span>
            )}
            {item.prepTime && (
              <span
                className="item__prep"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent)',
                  marginLeft: '0.4rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <ClockIcon size={12} />
                {item.prepTime}
              </span>
            )}
          </span>
          <span className="item__leader"></span>
          <span className="item__price">
            {Number(item.price).toLocaleString()} <small>{currency}</small>
          </span>
        </div>
        {locItem.description && <div className="item__desc">{locItem.description}</div>}
      </div>
      <div className="item__arrow" aria-hidden="true">
        &rsaquo;
      </div>
    </li>
  );
}
