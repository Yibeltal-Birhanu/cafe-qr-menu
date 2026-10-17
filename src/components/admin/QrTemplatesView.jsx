import React, { useState } from 'react';
import {
  PlusIcon,
  EyeIcon,
  DownloadIcon,
  MoreIcon,
  PrinterIcon,
  ShareIcon,
  ChevronRightIcon,
  QrCodeIcon,
} from './AdminIcons.jsx';

export default function QrTemplatesView({ cafeName = 'CafeMenu', onShowToast }) {
  const [filter, setFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTable, setSelectedTable] = useState('1');

  const templates = [
    {
      id: 'modern-green',
      name: 'Modern Green',
      status: 'active',
      description: 'Clean and modern design with your logo and brand colors.',
      previewBg: '#1a3328',
      accentColor: '#10b981',
      bgImg: '/images/habesha.jpg',
    },
    {
      id: 'dark-premium',
      name: 'Dark Premium',
      status: 'active',
      description: 'Elegant dark theme with coffee background for a premium look.',
      previewBg: '#1f1610',
      accentColor: '#f59e0b',
      bgImg: '/images/coffee.jpg',
    },
    {
      id: 'minimal-cream',
      name: 'Minimal Cream',
      status: 'inactive',
      description: 'Simple and clean design, perfect for any café or restaurant.',
      previewBg: '#f5ede3',
      accentColor: '#785b46',
      bgImg: '/images/breakfast.jpg',
    },
    {
      id: 'chalkboard',
      name: 'Chalkboard',
      status: 'inactive',
      description: 'Stylish chalkboard look with hand-drawn illustrations.',
      previewBg: '#1c1e21',
      accentColor: '#e5e7eb',
      bgImg: '/images/dishes/classic-beef-burger.jpg',
    },
    {
      id: 'food-focus',
      name: 'Food Focus',
      status: 'inactive',
      description: 'Uses food photography to create a vibrant and appetizing look.',
      previewBg: '#2a1a14',
      accentColor: '#ef4444',
      bgImg: '/images/dishes/special-beef-tibs.jpg',
    },
    {
      id: 'elegant-green',
      name: 'Elegant Green',
      status: 'inactive',
      description: 'Premium and professional with elegant leaf design.',
      previewBg: '#0f241d',
      accentColor: '#34d399',
      bgImg: '/images/desserts.jpg',
    },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    if (filter === 'all') return true;
    return tpl.status === filter;
  });

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = `/qr.png?url=${encodeURIComponent(`${window.location.origin}/abol-cafe?table=${selectedTable}`)}`;
    link.download = `cafemenu-table-${selectedTable}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast('QR Code downloaded successfully!');
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/abol-cafe`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        if (onShowToast) onShowToast('Menu link copied to clipboard!');
      });
    } else {
      if (onShowToast) onShowToast(`Menu URL: ${url}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div class="ad-content-wrapper">
      {/* Main Content Area */}
      <div class="ad-content-left">
        {/* 1. Hero Banner Card */}
        <div class="ad-hero-card" style={{
          background: 'linear-gradient(to right, rgba(14, 20, 17, 0.96) 0%, rgba(14, 20, 17, 0.8) 55%, rgba(14, 20, 17, 0.3) 100%), url("/images/coffee.jpg") center/cover no-repeat',
          minHeight: '190px'
        }}>
          <h2 class="ad-hero-title">QR Menu Templates</h2>
          <p class="ad-hero-sub" style={{ maxWidth: '480px' }}>
            Create beautiful QR codes for your menu. Let your customers scan and explore your menu instantly.
          </p>
          <div class="ad-qr-feature-badges">
            <span class="ad-qr-feature-item">
              <span>&#9889;</span> Fast &amp; Easy
            </span>
            <span class="ad-qr-feature-item">
              <span>&#9638;</span> Multiple Styles
            </span>
            <span class="ad-qr-feature-item">
              <span>&#128241;</span> Mobile Friendly
            </span>
          </div>
        </div>

        {/* 2. Info Alert */}
        <div class="ad-info-alert">
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>&#8505;</span>
          <span>
            Your QR templates are ready to be printed and placed on tables, counters, or shared digitally with guests.
          </span>
        </div>

        {/* 3. Templates Gallery Section */}
        <div class="ad-panel-card" style={{ padding: '1.6rem' }}>
          <div class="ad-card-header" style={{ marginBottom: '1.4rem' }}>
            <div>
              <h3 class="ad-card-title">Your QR Templates</h3>
              <p class="ad-card-sub">Choose from beautiful templates to display your menu as a QR code.</p>
            </div>

            {/* Filter Pills */}
            <div class="ad-filter-pills-row" role="tablist">
              <button
                type="button"
                class={`ad-filter-pill-btn ${filter === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                class={`ad-filter-pill-btn ${filter === 'active' ? 'is-active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                type="button"
                class={`ad-filter-pill-btn ${filter === 'inactive' ? 'is-active' : ''}`}
                onClick={() => setFilter('inactive')}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Templates Grid (2 rows of 3) */}
          <div class="ad-qr-templates-grid">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.id} class="ad-qr-card">
                <div class="ad-qr-preview-stage">
                  <img
                    src={tpl.bgImg}
                    alt={tpl.name}
                    class="ad-qr-preview-img"
                  />
                  <span
                    class={`ad-qr-status-tag ${
                      tpl.status === 'active'
                        ? 'ad-qr-status-tag--active'
                        : 'ad-qr-status-tag--inactive'
                    }`}
                  >
                    {tpl.status === 'active' ? 'Active' : 'Inactive'}
                  </span>

                  {/* Mock Card Preview overlay */}
                  <div style={{
                    position: 'absolute',
                    width: '110px',
                    height: '145px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    textAlign: 'center',
                  }}>
                    <strong style={{ fontSize: '0.62rem', color: '#121826' }}>{cafeName}</strong>
                    <span style={{ fontSize: '0.45rem', color: '#6c757d', marginBottom: '4px' }}>Scan for Menu</span>
                    <img
                      src={`/qr.png?url=${encodeURIComponent(`${window.location.origin}/abol-cafe`)}`}
                      alt="QR"
                      style={{ width: '64px', height: '64px', borderRadius: '4px' }}
                    />
                    <span style={{ fontSize: '0.42rem', color: '#9ca3af', marginTop: '4px' }}>Good Food &bull; Great Moments</span>
                  </div>
                </div>

                <div class="ad-qr-card-body">
                  <h4 class="ad-qr-card-title">{tpl.name}</h4>
                  <p class="ad-qr-card-desc">{tpl.description}</p>

                  <div class="ad-qr-card-actions">
                    <button
                      type="button"
                      class="ad-qr-btn-view"
                      onClick={() => setSelectedTemplate(tpl)}
                    >
                      <EyeIcon size={14} />
                      <span>View Template</span>
                    </button>
                    <button
                      type="button"
                      class="ad-qr-btn-icon"
                      onClick={handleDownloadQr}
                      title="Download QR Code"
                    >
                      <DownloadIcon size={14} />
                    </button>
                    <button
                      type="button"
                      class="ad-qr-btn-icon"
                      title="More options"
                    >
                      <MoreIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div class="ad-content-right">
        {/* Quick Actions List */}
        <div class="ad-panel-card">
          <h3 class="ad-card-title" style={{ marginBottom: '1rem' }}>
            Quick Actions
          </h3>
          <div class="ad-card-actions-list">
            <a
              href="/abol-cafe"
              target="_blank"
              rel="noreferrer"
              class="ad-action-tile"
            >
              <div class="ad-action-tile-icon">
                <EyeIcon size={18} />
              </div>
              <div class="ad-action-tile-info">
                <div class="ad-action-tile-title">View Menu</div>
                <div class="ad-action-tile-sub">See how your menu looks</div>
              </div>
              <span class="ad-action-tile-arrow">&rsaquo;</span>
            </a>

            <div class="ad-action-tile" onClick={handleDownloadQr} role="button" tabIndex={0}>
              <div class="ad-action-tile-icon">
                <DownloadIcon size={18} />
              </div>
              <div class="ad-action-tile-info">
                <div class="ad-action-tile-title">Download QR</div>
                <div class="ad-action-tile-sub">Get high-quality QR code</div>
              </div>
              <span class="ad-action-tile-arrow">&rsaquo;</span>
            </div>

            <div
              class="ad-action-tile"
              onClick={() => setSelectedTemplate(templates[0])}
              role="button"
              tabIndex={0}
            >
              <div class="ad-action-tile-icon">
                <PrinterIcon size={18} />
              </div>
              <div class="ad-action-tile-info">
                <div class="ad-action-tile-title">Print Template</div>
                <div class="ad-action-tile-sub">Print for your tables</div>
              </div>
              <span class="ad-action-tile-arrow">&rsaquo;</span>
            </div>

            <div class="ad-action-tile" onClick={handleShareLink} role="button" tabIndex={0}>
              <div class="ad-action-tile-icon">
                <ShareIcon size={18} />
              </div>
              <div class="ad-action-tile-info">
                <div class="ad-action-tile-title">Share Link</div>
                <div class="ad-action-tile-sub">Share menu via link</div>
              </div>
              <span class="ad-action-tile-arrow">&rsaquo;</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div class="ad-panel-card">
          <div class="ad-card-header" style={{ marginBottom: '0.8rem' }}>
            <h3 class="ad-card-title">Recent Activity</h3>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>
              View all &rarr;
            </span>
          </div>

          <div class="ad-activity-feed">
            <div class="ad-activity-item">
              <div class="ad-activity-icon">
                <QrCodeIcon size={14} />
              </div>
              <div class="ad-activity-body">
                <div class="ad-activity-title">QR template updated</div>
                <div class="ad-activity-desc">Modern Template</div>
                <div class="ad-activity-time">2 hours ago</div>
              </div>
            </div>

            <div class="ad-activity-item">
              <div class="ad-activity-icon">
                <PlusIcon size={14} />
              </div>
              <div class="ad-activity-body">
                <div class="ad-activity-title">New QR template created</div>
                <div class="ad-activity-desc">Minimal Template</div>
                <div class="ad-activity-time">5 hours ago</div>
              </div>
            </div>

            <div class="ad-activity-item">
              <div class="ad-activity-icon">
                <EyeIcon size={14} />
              </div>
              <div class="ad-activity-body">
                <div class="ad-activity-title">Menu updated</div>
                <div class="ad-activity-desc">New items added</div>
                <div class="ad-activity-time">1 day ago</div>
              </div>
            </div>

            <div class="ad-activity-item">
              <div class="ad-activity-icon">
                <QrCodeIcon size={14} />
              </div>
              <div class="ad-activity-body">
                <div class="ad-activity-title">QR scanned</div>
                <div class="ad-activity-desc">Table 3 - 12 views</div>
                <div class="ad-activity-time">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Stand Card Preview & Print Modal */}
      {selectedTemplate && (
        <div
          class="ad-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTemplate(null);
          }}
        >
          <div class="ad-modal-box">
            <button
              type="button"
              class="ad-modal-close-btn"
              onClick={() => setSelectedTemplate(null)}
              aria-label="Close"
            >
              &times;
            </button>

            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              {selectedTemplate.name} Stand Card
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>
              Select a table number to customize the QR stand card for printing.
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121826' }}>
                Select Table:
              </label>
              <select
                class="ad-select-dropdown"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>
                    Table #{num}
                  </option>
                ))}
                <option value="VIP">VIP Lounge</option>
                <option value="Patio">Patio</option>
                <option value="Bar">Bar Area</option>
              </select>
            </div>

            {/* Stand Card Preview */}
            <div style={{
              background: '#f8f9fa',
              border: '2px dashed #dbe0e6',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <strong style={{ fontSize: '1.1rem', color: '#121826' }}>{cafeName}</strong>
              <span style={{ fontSize: '0.82rem', color: '#6c757d', marginBottom: '0.8rem' }}>
                Table {selectedTable} &bull; Scan for Digital Menu
              </span>
              <img
                src={`/qr.png?url=${encodeURIComponent(`${window.location.origin}/abol-cafe?table=${selectedTable}`)}`}
                alt="Table QR Code"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  padding: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.8rem' }}>
                Point camera to browse full menu &amp; prices
              </span>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                class="ad-btn-action-secondary"
                onClick={handleDownloadQr}
                style={{ width: 'auto' }}
              >
                <DownloadIcon size={16} />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                class="ad-btn-action-primary"
                onClick={handlePrint}
                style={{ width: 'auto' }}
              >
                <PrinterIcon size={16} />
                <span>Print Stand Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
