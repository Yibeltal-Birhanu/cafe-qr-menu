import React, { useState } from 'react';

export default function AdminAnalyticsRow({ topItems = [], chartData: customChartData = null }) {
  const defaultChartData = [
    { day: 'Mon', value: 0, label: 'Mon: 0 scans' },
    { day: 'Tue', value: 0, label: 'Tue: 0 scans' },
    { day: 'Wed', value: 0, label: 'Wed: 0 scans' },
    { day: 'Thu', value: 0, label: 'Thu: 0 scans' },
    { day: 'Fri', value: 0, label: 'Fri: 0 scans' },
    { day: 'Sat', value: 0, label: 'Sat: 0 scans' },
    { day: 'Sun', value: 0, label: 'Sun: 0 scans' },
  ];

  const chartData = (customChartData && customChartData.length > 0) ? customChartData : defaultChartData;
  const [hoverIndex, setHoverIndex] = useState(chartData.length - 1);

  // Map values into SVG coordinates (width: 500, height: 160)
  const width = 500;
  const height = 150;
  const paddingX = 35;
  const paddingY = 25;

  const rawMax = Math.max(...chartData.map((d) => d.value), 0);
  const maxVal = rawMax > 0 ? (rawMax <= 10 ? 10 : Math.ceil(rawMax / 10) * 10) : 10;

  const points = chartData.map((d, i) => {
    const x = paddingX + (i / Math.max(1, chartData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY);
    return { ...d, x, y };
  });

  // Construct SVG smooth path
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  // Fallback top items if none provided
  const rankedItems = topItems.length > 0 ? topItems.slice(0, 5) : [
    { id: '1', name: 'Special Beef Tibs', count: 42, max: 50, image: '/images/dishes/special-beef-tibs.jpg' },
    { id: '2', name: 'Cheesecake', count: 38, max: 50, image: '/images/dishes/cheesecake.jpg' },
    { id: '3', name: 'Chicken Sandwich', count: 32, max: 50, image: '/images/dishes/crispy-chicken-burger.jpg' },
    { id: '4', name: 'Traditional Buna', count: 28, max: 50, image: '/images/dishes/traditional-buna-ceremony.jpg' },
    { id: '5', name: 'Classic Burger', count: 24, max: 50, image: '/images/dishes/classic-beef-burger.jpg' },
  ];

  const activePoint = points[hoverIndex] || points[5];

  return (
    <div class="ad-analytics-row">
      {/* Left: Traffic / Sales Overview */}
      <div class="ad-panel-card">
        <div class="ad-card-header">
          <div>
            <h3 class="ad-card-title">Menu Traffic Overview</h3>
            <p class="ad-card-sub">Daily customer scans &amp; views</p>
          </div>
          <select class="ad-select-dropdown" aria-label="Select timeframe">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Month</option>
          </select>
        </div>

        <div class="ad-chart-container">
          <svg class="ad-chart-svg" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal].map((v, vIdx) => {
              const y = height - paddingY - (v / maxVal) * (height - 2 * paddingY);
              return (
                <g key={`grid-${vIdx}-${v}`}>
                  <line x1={paddingX - 10} y1={y} x2={width - paddingX + 10} y2={y} stroke="#f0f2f5" strokeWidth="1" />
                  <text x={paddingX - 18} y={y + 3} fontSize="9" fill="#9ca3af" textAnchor="end">
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#chartGradient)" />

            {/* Smooth Line */}
            <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

            {/* Points & Labels */}
            {points.map((pt, idx) => (
              <g key={pt.day} onClick={() => setHoverIndex(idx)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoverIndex === idx ? 5 : 3.5}
                  fill={hoverIndex === idx ? '#10b981' : '#ffffff'}
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <text x={pt.x} y={height - 6} fontSize="10" fill="#6c757d" textAnchor="middle" fontWeight="600">
                  {pt.day}
                </text>
              </g>
            ))}

            {/* Floating Tooltip */}
            {activePoint && (
              <g transform={`translate(${activePoint.x}, ${activePoint.y - 32})`}>
                <rect x="-42" y="-14" width="84" height="22" rx="6" fill="#13221e" />
                <text x="0" y="1" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">
                  {activePoint.label.split(':')[0]}: {activePoint.value}
                </text>
                <polygon points="0,9 -4,5 4,5" fill="#13221e" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Right: Top Viewed Items */}
      <div class="ad-panel-card">
        <div class="ad-card-header">
          <div>
            <h3 class="ad-card-title">Top Viewed Items</h3>
            <p class="ad-card-sub">Most explored menu items</p>
          </div>
        </div>

        <div class="ad-top-items-list">
          {rankedItems.map((item, index) => {
            const pct = Math.min(100, Math.round((item.count / (item.max || 50)) * 100));
            return (
              <div key={item.id || index} class="ad-top-item-row">
                <img
                  src={item.image || '/images/dishes/classic-beef-burger.jpg'}
                  alt={item.name}
                  class="ad-top-item-thumb"
                  onError={(e) => {
                    e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
                  }}
                />
                <div class="ad-top-item-info">
                  <div class="ad-top-item-name">
                    {index + 1}. {item.name}
                  </div>
                  <div class="ad-top-item-bar-bg">
                    <div class="ad-top-item-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
                <span class="ad-top-item-count">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
