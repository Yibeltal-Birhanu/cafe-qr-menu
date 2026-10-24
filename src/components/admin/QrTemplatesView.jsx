import React, { useState } from 'react';
import {
  PlusIcon,
  EyeIcon,
  DownloadIcon,
  PrinterIcon,
  ShareIcon,
  QrCodeIcon,
  ZapIcon,
  SmartphoneIcon,
  CheckIcon,
  MoreIcon,
} from './AdminIcons.jsx';

const INITIAL_TEMPLATES = [
  {
    id: 'modern-green',
    name: 'Modern Green',
    status: 'active',
    description: 'Clean and modern design with your logo and brand colors.',
    previewImg: '/images/templates/modern-green.png',
    cardClass: 'ad-art-card--modern-green',
    accentColor: '#10b981',
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    status: 'active',
    description: 'Elegant dark theme with coffee background for a premium look.',
    previewImg: '/images/templates/dark-premium.png',
    cardClass: 'ad-art-card--dark-premium',
    accentColor: '#f59e0b',
  },
  {
    id: 'minimal-cream',
    name: 'Minimal Cream',
    status: 'inactive',
    description: 'Simple and clean design, perfect for any café or restaurant.',
    previewImg: '/images/templates/minimal-cream.png',
    cardClass: 'ad-art-card--minimal-cream',
    accentColor: '#785b46',
  },
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    status: 'inactive',
    description: 'Stylish chalkboard look with hand-drawn illustrations.',
    previewImg: '/images/templates/chalkboard.png',
    cardClass: 'ad-art-card--chalkboard',
    accentColor: '#e5e7eb',
  },
  {
    id: 'food-focus',
    name: 'Food Focus',
    status: 'inactive',
    description: 'Uses food photography to create a vibrant and appetizing look.',
    previewImg: '/images/templates/food-focus.png',
    cardClass: 'ad-art-card--food-focus',
    accentColor: '#ef4444',
  },
  {
    id: 'elegant-green',
    name: 'Elegant Green',
    status: 'inactive',
    description: 'Premium and professional with elegant leaf design.',
    previewImg: '/images/templates/elegant-green.png',
    cardClass: 'ad-art-card--elegant-green',
    accentColor: '#34d399',
  },
];

/**
 * ArtisticStandCard renders a high-definition table stand card inside the print/preview modal.
 */
function ArtisticStandCard({ template, cafeName, tableNumber, cafeSlug = 'abol-cafe' }) {
  const qrUrl = `/api/${encodeURIComponent(cafeSlug)}/qr.png?table=${encodeURIComponent(tableNumber)}`;

  return (
    <div
      id="ad-printable-stand-card"
      className={`ad-stand-card ad-stand-card--full ${template.cardClass}`}
    >
      {/* Header */}
      <div className="ad-stand-header">
        <h3 className="ad-stand-cafe-name">{cafeName}</h3>
        <p className="ad-stand-tagline">Good Food &bull; Great Moments</p>
        <div
          className="ad-stand-table-badge"
          style={{
            background:
              template.id === 'modern-green'
                ? '#10b981'
                : template.id === 'dark-premium'
                ? '#d97706'
                : template.id === 'chalkboard'
                ? '#374151'
                : template.id === 'food-focus'
                ? '#fee2e2'
                : template.id === 'elegant-green'
                ? '#fbbf24'
                : '#e8ded2',
            color:
              template.id === 'food-focus'
                ? '#b91c1c'
                : template.id === 'elegant-green'
                ? '#0c211a'
                : template.id === 'minimal-cream'
                ? '#3d2d23'
                : '#ffffff',
          }}
        >
          Table #{tableNumber} &bull; Digital Menu
        </div>
      </div>

      {/* QR Code Container */}
      <div className="ad-stand-qr-wrapper">
        <img src={qrUrl} alt={`QR Code Table ${tableNumber}`} className="ad-stand-qr-img" />
      </div>

      {/* Instructions */}
      <div style={{ margin: '0.4rem 0' }}>
        <div className="ad-stand-scan-prompt">Point Phone Camera to Scan</div>
        <p className="ad-stand-footer-note">
          Browse full menu &amp; prices on your phone &bull; No app needed
        </p>
      </div>

      {/* Footer Ribbon */}
      <div
        style={{
          fontSize: '0.68rem',
          opacity: 0.65,
          borderTop: '1px dashed currentColor',
          paddingTop: '0.6rem',
          width: '100%',
          letterSpacing: '0.04em',
        }}
      >
        Wi-Fi: Abol-Guest &bull; Contactless Dining
      </div>
    </div>
  );
}

export default function QrTemplatesView({
  cafeName = 'CafeMenu',
  cafeSlug = 'abol-cafe',
  onShowToast,
}) {
  const [filter, setFilter] = useState('all');
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTable, setSelectedTable] = useState('1');

  const filteredTemplates = templates.filter((tpl) => {
    if (filter === 'all') return true;
    return tpl.status === filter;
  });

  const handleToggleActive = (templateId) => {
    setTemplates((prev) =>
      prev.map((tpl) => {
        if (tpl.id === templateId) {
          const nextStatus = tpl.status === 'active' ? 'inactive' : 'active';
          if (onShowToast) {
            onShowToast(`Template "${tpl.name}" is now ${nextStatus}!`);
          }
          return { ...tpl, status: nextStatus };
        }
        return tpl;
      })
    );
    if (selectedTemplate && selectedTemplate.id === templateId) {
      setSelectedTemplate((prev) => ({
        ...prev,
        status: prev.status === 'active' ? 'inactive' : 'active',
      }));
    }
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = `/api/${encodeURIComponent(cafeSlug)}/qr.png?table=${encodeURIComponent(selectedTable)}`;
    link.download = `${cafeSlug}-table-${selectedTable}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast(`QR Code for Table #${selectedTable} downloaded!`);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/scan/${encodeURIComponent(cafeSlug)}?table=${encodeURIComponent(selectedTable)}`;
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
    <div className="ad-content-wrapper">
      {/* Main Content Area */}
      <div className="ad-content-left">
        {/* 1. Hero Banner Card */}
        <div
          className="ad-hero-card"
          style={{
            background:
              'linear-gradient(to right, rgba(14, 20, 17, 0.96) 0%, rgba(14, 20, 17, 0.8) 55%, rgba(14, 20, 17, 0.3) 100%), url("/images/coffee.jpg") center/cover no-repeat',
            minHeight: '185px',
          }}
        >
          <h2 className="ad-hero-title">QR Menu Templates</h2>
          <p className="ad-hero-sub" style={{ maxWidth: '480px' }}>
            Create beautiful QR codes for your menu. Let your customers scan and explore your menu instantly.
          </p>
          <div className="ad-qr-feature-badges">
            <span className="ad-qr-feature-item">
              <ZapIcon size={14} /> Fast &amp; Easy
            </span>
            <span className="ad-qr-feature-item">
              <QrCodeIcon size={14} /> Multiple Styles
            </span>
            <span className="ad-qr-feature-item">
              <SmartphoneIcon size={14} /> Mobile Friendly
            </span>
          </div>
        </div>

        {/* 2. Info Alert */}
        <div className="ad-info-alert">
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>&#8505;</span>
          <span>
            Your QR templates are ready to be printed and placed on tables, counters, or shared digitally.
          </span>
        </div>

        {/* 3. Templates Gallery Section */}
        <div className="ad-panel-card" style={{ padding: '1.6rem' }}>
          <div className="ad-card-header" style={{ marginBottom: '1.4rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <h3 className="ad-card-title">Your QR Templates</h3>
              <p className="ad-card-sub">
                Choose from beautiful templates to display your menu as a QR code.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="ad-filter-pills-row" role="tablist">
              <button
                type="button"
                className={`ad-filter-pill-btn ${filter === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`ad-filter-pill-btn ${filter === 'active' ? 'is-active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                type="button"
                className={`ad-filter-pill-btn ${filter === 'inactive' ? 'is-active' : ''}`}
                onClick={() => setFilter('inactive')}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Templates Grid (2 rows of 3) */}
          <div className="ad-qr-templates-grid">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.id} className="ad-qr-card">
                {/* Visual Preview Stage with pristine cropped mockup */}
                <div
                  className="ad-qr-preview-stage"
                  onClick={() => setSelectedTemplate(tpl)}
                  style={{ cursor: 'pointer' }}
                  title={`Click to preview & print ${tpl.name}`}
                >
                  <img
                    src={tpl.previewImg}
                    alt={tpl.name}
                    className="ad-qr-preview-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Status Tag */}
                  <span
                    className={`ad-qr-status-tag ${
                      tpl.status === 'active'
                        ? 'ad-qr-status-tag--active'
                        : 'ad-qr-status-tag--inactive'
                    }`}
                  >
                    {tpl.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="ad-qr-card-body">
                  <h4 className="ad-qr-card-title">{tpl.name}</h4>
                  <p className="ad-qr-card-desc">{tpl.description}</p>

                  <div className="ad-qr-card-actions">
                    <button
                      type="button"
                      className="ad-qr-btn-view"
                      onClick={() => setSelectedTemplate(tpl)}
                    >
                      <EyeIcon size={14} />
                      <span>View Template</span>
                    </button>
                    <button
                      type="button"
                      className="ad-qr-btn-icon"
                      onClick={handleDownloadQr}
                      title="Download QR Code"
                    >
                      <DownloadIcon size={14} />
                    </button>
                    <button
                      type="button"
                      className="ad-qr-btn-icon"
                      onClick={() => handleToggleActive(tpl.id)}
                      title={tpl.status === 'active' ? 'Deactivate template' : 'Activate template'}
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
      <div className="ad-content-right">
        {/* Quick Actions List */}
        <div className="ad-panel-card">
          <h3 className="ad-card-title" style={{ marginBottom: '1rem' }}>
            Quick Actions
          </h3>
          <div className="ad-card-actions-list">
            <a
              href={`/scan/${encodeURIComponent(cafeSlug)}`}
              target="_blank"
              rel="noreferrer"
              className="ad-action-tile"
            >
              <div className="ad-action-tile-icon">
                <EyeIcon size={18} />
              </div>
              <div className="ad-action-tile-info">
                <div className="ad-action-tile-title">View Menu</div>
                <div className="ad-action-tile-sub">See how your menu looks</div>
              </div>
              <span className="ad-action-tile-arrow">&rsaquo;</span>
            </a>

            <div className="ad-action-tile" onClick={handleDownloadQr} role="button" tabIndex={0}>
              <div className="ad-action-tile-icon">
                <DownloadIcon size={18} />
              </div>
              <div className="ad-action-tile-info">
                <div className="ad-action-tile-title">Download QR</div>
                <div className="ad-action-tile-sub">Get high-quality QR code</div>
              </div>
              <span className="ad-action-tile-arrow">&rsaquo;</span>
            </div>

            <div
              className="ad-action-tile"
              onClick={() => setSelectedTemplate(templates[0])}
              role="button"
              tabIndex={0}
            >
              <div className="ad-action-tile-icon">
                <PrinterIcon size={18} />
              </div>
              <div className="ad-action-tile-info">
                <div className="ad-action-tile-title">Print Template</div>
                <div className="ad-action-tile-sub">Print for your tables</div>
              </div>
              <span className="ad-action-tile-arrow">&rsaquo;</span>
            </div>

            <div className="ad-action-tile" onClick={handleShareLink} role="button" tabIndex={0}>
              <div className="ad-action-tile-icon">
                <ShareIcon size={18} />
              </div>
              <div className="ad-action-tile-info">
                <div className="ad-action-tile-title">Share Link</div>
                <div className="ad-action-tile-sub">Share menu via link</div>
              </div>
              <span className="ad-action-tile-arrow">&rsaquo;</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="ad-panel-card">
          <div className="ad-card-header" style={{ marginBottom: '0.8rem' }}>
            <h3 className="ad-card-title">Recent Activity</h3>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>
              View all &rarr;
            </span>
          </div>

          <div className="ad-activity-feed">
            <div className="ad-activity-item">
              <div className="ad-activity-icon">
                <QrCodeIcon size={14} />
              </div>
              <div className="ad-activity-body">
                <div className="ad-activity-title">QR template updated</div>
                <div className="ad-activity-desc">Modern Template</div>
                <div className="ad-activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="ad-activity-item">
              <div className="ad-activity-icon">
                <PlusIcon size={14} />
              </div>
              <div className="ad-activity-body">
                <div className="ad-activity-title">New QR template created</div>
                <div className="ad-activity-desc">Minimal Template</div>
                <div className="ad-activity-time">5 hours ago</div>
              </div>
            </div>

            <div className="ad-activity-item">
              <div className="ad-activity-icon">
                <EyeIcon size={14} />
              </div>
              <div className="ad-activity-body">
                <div className="ad-activity-title">Menu updated</div>
                <div className="ad-activity-desc">New items added</div>
                <div className="ad-activity-time">1 day ago</div>
              </div>
            </div>

            <div className="ad-activity-item">
              <div className="ad-activity-icon">
                <QrCodeIcon size={14} />
              </div>
              <div className="ad-activity-body">
                <div className="ad-activity-title">QR scanned</div>
                <div className="ad-activity-desc">Table 3 - 12 views</div>
                <div className="ad-activity-time">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Stand Card Preview & Print Modal */}
      {selectedTemplate && (
        <div
          className="ad-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTemplate(null);
          }}
        >
          <div className="ad-modal-box" style={{ maxWidth: '580px' }}>
            <button
              type="button"
              className="ad-modal-close-btn"
              onClick={() => setSelectedTemplate(null)}
              aria-label="Close"
            >
              &times;
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                  {selectedTemplate.name} Stand Card
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#6c757d' }}>
                  Printable table stand card &bull; Configured for table printing
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleActive(selectedTemplate.id)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedTemplate.status === 'active' ? '#10b981' : '#e5e7eb',
                  color: selectedTemplate.status === 'active' ? '#ffffff' : '#4b5563',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckIcon size={13} />
                <span>{selectedTemplate.status === 'active' ? 'Active Theme' : 'Set as Active'}</span>
              </button>
            </div>

            {/* Table Selector Row */}
            <div
              style={{
                display: 'flex',
                gap: '0.8rem',
                alignItems: 'center',
                background: '#f8f9fa',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
              }}
            >
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121826' }}>
                Table Number:
              </label>
              <select
                className="ad-select-dropdown"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', flex: 1 }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 20].map((num) => (
                  <option key={num} value={num}>
                    Table #{num}
                  </option>
                ))}
                <option value="VIP-1">VIP Lounge 1</option>
                <option value="VIP-2">VIP Lounge 2</option>
                <option value="Patio">Patio Area</option>
                <option value="Terrace">Terrace View</option>
                <option value="Bar">Bar Stand</option>
              </select>
            </div>

            {/* Full Artistic Stand Card */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '1rem 0',
                background: '#f3f4f6',
                borderRadius: '16px',
              }}
            >
              <ArtisticStandCard
                template={selectedTemplate}
                cafeName={cafeName}
                tableNumber={selectedTable}
                cafeSlug={cafeSlug}
              />
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                gap: '0.8rem',
                justifyContent: 'flex-end',
                borderTop: '1px solid #eaedf1',
                paddingTop: '0.8rem',
              }}
            >
              <button
                type="button"
                className="ad-btn-action-secondary"
                onClick={handleDownloadQr}
                style={{ width: 'auto', padding: '0.65rem 1.2rem' }}
              >
                <DownloadIcon size={16} />
                <span>Download QR PNG</span>
              </button>
              <button
                type="button"
                className="ad-btn-action-primary"
                onClick={handlePrint}
                style={{ width: 'auto', padding: '0.65rem 1.4rem' }}
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
