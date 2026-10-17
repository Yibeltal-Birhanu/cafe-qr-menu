import React from 'react';
import { CutleryIcon, GridIcon, ClipboardIcon, UsersIcon } from './AdminIcons.jsx';

export default function AdminStatsRow({ totalItems = 24, totalCategories = 8 }) {
  return (
    <div class="ad-stats-grid">
      {/* 1. Total Menu Items */}
      <div class="ad-stat-card">
        <div class="ad-stat-icon-wrapper ad-stat-icon--green">
          <CutleryIcon size={20} />
        </div>
        <span class="ad-stat-label">Total Menu Items</span>
        <div class="ad-stat-value">{totalItems}</div>
        <div class="ad-stat-badge ad-stat-badge--green">
          <span>+2 this week</span>
        </div>
      </div>

      {/* 2. Categories */}
      <div class="ad-stat-card">
        <div class="ad-stat-icon-wrapper ad-stat-icon--orange">
          <GridIcon size={20} />
        </div>
        <span class="ad-stat-label">Categories</span>
        <div class="ad-stat-value">{totalCategories}</div>
        <div class="ad-stat-badge ad-stat-badge--muted">
          <span>&mdash; Active</span>
        </div>
      </div>

      {/* 3. Total Scans (Today) */}
      <div class="ad-stat-card">
        <div class="ad-stat-icon-wrapper ad-stat-icon--blue">
          <ClipboardIcon size={20} />
        </div>
        <span class="ad-stat-label">Total QR Scans (Today)</span>
        <div class="ad-stat-value">156</div>
        <div class="ad-stat-badge ad-stat-badge--green">
          <span>&nearr; +18% from yesterday</span>
        </div>
      </div>

      {/* 4. Total Visitors (Today) */}
      <div class="ad-stat-card">
        <div class="ad-stat-icon-wrapper ad-stat-icon--purple">
          <UsersIcon size={20} />
        </div>
        <span class="ad-stat-label">Total Visitors (Today)</span>
        <div class="ad-stat-value">842</div>
        <div class="ad-stat-badge ad-stat-badge--green">
          <span>&nearr; +12% from yesterday</span>
        </div>
      </div>
    </div>
  );
}
