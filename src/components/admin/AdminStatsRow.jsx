import React from 'react';
import { CutleryIcon, GridIcon, ClipboardIcon, UsersIcon } from './AdminIcons.jsx';

export default function AdminStatsRow({
  totalItems = 0,
  totalCategories = 0,
  stats = {},
}) {
  const scansToday = typeof stats.scansToday === 'number' ? stats.scansToday : 0;
  const totalVisitors = typeof stats.totalVisitors === 'number' ? stats.totalVisitors : (stats.totalScans || 0);
  const scansTodayTrend = stats.scansTodayTrend || (scansToday > 0 ? `+${scansToday} today` : 'No scans yet today');
  const visitorsTrend = stats.visitorsTrend || (totalVisitors > 0 ? 'All-time verified' : 'No visitors yet');

  return (
    <div className="ad-stats-grid">
      {/* 1. Total Menu Items */}
      <div className="ad-stat-card">
        <div className="ad-stat-icon-wrapper ad-stat-icon--green">
          <CutleryIcon size={20} />
        </div>
        <span className="ad-stat-label">Total Menu Items</span>
        <div className="ad-stat-value">{Number(totalItems).toLocaleString()}</div>
        <div className="ad-stat-badge ad-stat-badge--green">
          <span>Active Dishes</span>
        </div>
      </div>

      {/* 2. Categories */}
      <div className="ad-stat-card">
        <div className="ad-stat-icon-wrapper ad-stat-icon--orange">
          <GridIcon size={20} />
        </div>
        <span className="ad-stat-label">Categories</span>
        <div className="ad-stat-value">{Number(totalCategories).toLocaleString()}</div>
        <div className="ad-stat-badge ad-stat-badge--muted">
          <span>&mdash; Sections</span>
        </div>
      </div>

      {/* 3. Total Scans (Today) */}
      <div className="ad-stat-card">
        <div className="ad-stat-icon-wrapper ad-stat-icon--blue">
          <ClipboardIcon size={20} />
        </div>
        <span className="ad-stat-label">Total QR Scans (Today)</span>
        <div className="ad-stat-value">{scansToday.toLocaleString()}</div>
        <div className="ad-stat-badge ad-stat-badge--green">
          <span>{scansTodayTrend}</span>
        </div>
      </div>

      {/* 4. Total Visitors (Every QR Scan = Visitor) */}
      <div className="ad-stat-card">
        <div className="ad-stat-icon-wrapper ad-stat-icon--purple">
          <UsersIcon size={20} />
        </div>
        <span className="ad-stat-label">Total Visitors</span>
        <div className="ad-stat-value">{totalVisitors.toLocaleString()}</div>
        <div className="ad-stat-badge ad-stat-badge--green">
          <span>{visitorsTrend}</span>
        </div>
      </div>
    </div>
  );
}
