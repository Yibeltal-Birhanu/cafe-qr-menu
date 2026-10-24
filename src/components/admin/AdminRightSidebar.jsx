import React from 'react';
import { PlusIcon, GridIcon, QrCodeIcon, EditIcon, ChevronRightIcon } from './AdminIcons.jsx';

export default function AdminRightSidebar({
  onAddDish,
  onManageCategories,
  onOpenQrTemplates,
}) {
  const activities = [
    {
      id: 1,
      title: 'Menu item updated',
      desc: 'Special Beef Tibs',
      time: '12 min ago',
      icon: <EditIcon size={14} />,
    },
    {
      id: 2,
      title: 'Category added',
      desc: 'Habesha Specialties',
      time: '1 hour ago',
      icon: <GridIcon size={14} />,
    },
    {
      id: 3,
      title: 'Menu item created',
      desc: 'Traditional Buna Ceremony',
      time: '2 hours ago',
      icon: <PlusIcon size={14} />,
    },
    {
      id: 4,
      title: 'QR template updated',
      desc: 'Modern Green Template',
      time: '3 hours ago',
      icon: <QrCodeIcon size={14} />,
    },
  ];

  return (
    <div className="ad-content-right">
      {/* 1. Quick Actions Card */}
      <div className="ad-panel-card">
        <h3 className="ad-card-title" style={{ marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div className="ad-card-actions-list">
          <button
            type="button"
            className="ad-btn-action-primary"
            onClick={onAddDish}
          >
            <PlusIcon size={16} />
            <span>Add Menu Item</span>
          </button>

          <button
            type="button"
            className="ad-btn-action-secondary"
            onClick={onManageCategories}
          >
            <GridIcon size={16} />
            <span>Manage Categories</span>
          </button>

          <button
            type="button"
            className="ad-btn-action-secondary"
            onClick={onOpenQrTemplates}
          >
            <QrCodeIcon size={16} />
            <span>QR Templates</span>
          </button>
        </div>
      </div>

      {/* 2. Recent Activity Card */}
      <div className="ad-panel-card">
        <div className="ad-card-header" style={{ marginBottom: '0.8rem' }}>
          <h3 className="ad-card-title">Recent Activity</h3>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>
            View all &rarr;
          </span>
        </div>

        <div className="ad-activity-feed">
          {activities.map((act) => (
            <div key={act.id} className="ad-activity-item">
              <div className="ad-activity-icon">{act.icon}</div>
              <div className="ad-activity-body">
                <div className="ad-activity-title">{act.title}</div>
                <div className="ad-activity-desc">{act.desc}</div>
                <div className="ad-activity-time">{act.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Artisan Brand Promo Card */}
      <div className="ad-promo-card">
        <h4 className="ad-promo-title">Great food brings people together</h4>
        <p className="ad-promo-sub">
          Keep your menu fresh, accessible, and exciting for all your dining guests.
        </p>
      </div>
    </div>
  );
}
