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
} from './AdminIcons.jsx';

const INITIAL_TEMPLATES = [
  {
    id: 'modern-green',
    name: 'Modern Green',
    status: 'active',
    description: 'Clean botanical aesthetic with emerald accents and organic borders.',
    badgeText: 'Botanical & Organic',
    cardClass: 'ad-art-card--modern-green',
    accentColor: '#10b981',
    bgImg: '/images/habesha.jpg',
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    status: 'active',
    description: 'Velvet espresso palette with warm gold filigree border and luxury mood.',
    badgeText: 'Velvet Gold Filigree',
    cardClass: 'ad-art-card--dark-premium',
    accentColor: '#d97706',
    bgImg: '/images/coffee.jpg',
  },
  {
    id: 'minimal-cream',
    name: 'Minimal Cream',
    status: 'inactive',
    description: 'Artisan linen texture with understated neutral typography and clean borders.',
    badgeText: 'Artisan Linen Paper',
    cardClass: 'ad-art-card--minimal-cream',
    accentColor: '#785b46',
    bgImg: '/images/breakfast.jpg',
  },
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    status: 'inactive',
    description: 'Handcrafted chalkboard slate with rustic bistrot typography and frame.',
    badgeText: 'Rustic Bistro Chalk',
    cardClass: 'ad-art-card--chalkboard',
    accentColor: '#e5e7eb',
    bgImg: '/images/dishes/classic-beef-burger.jpg',
  },
  {
    id: 'food-focus',
    name: 'Food Focus',
    status: 'inactive',
    description: 'Vibrant culinary showcase putting signature dish photography front and center.',
    badgeText: 'Culinary Photography',
    cardClass: 'ad-art-card--food-focus',
    accentColor: '#ef4444',
    bgImg: '/images/dishes/special-beef-tibs.jpg',
  },
  {
    id: 'elegant-green',
    name: 'Elegant Green',
    status: 'inactive',
    description: 'Deep forest emerald background paired with embossed gold corner accents.',
    badgeText: 'Royal Emerald & Gold',
    cardClass: 'ad-art-card--elegant-green',
    accentColor: '#34d399',
    bgImg: '/images/desserts.jpg',
  },
];

/**
 * ArtisticStandCard renders a styled table stand card in either mini (gallery) or full (modal/print) size.
 */
function ArtisticStandCard({ template, cafeName, tableNumber, isFullSize = false }) {
  const qrUrl = `/qr.png?url=${encodeURIComponent(`${window.location.origin}/abol-cafe?table=${tableNumber}`)}`;

  if (isFullSize) {
    return (
      <div
        id="ad-printable-stand-card"
        class={`ad-stand-card ad-stand-card--full ${template.cardClass}`}
      >
        {/* Template-specific Top Accents */}
        {template.id === 'food-focus' && (
          <div
            style={{
              width: 'calc(100% + 3.2rem)',
              height: '110px',
              margin: '-2rem -1.6rem 1rem -1.6rem',
              backgroundImage: `url(${template.bgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              borderRadius: '24px 24px 0 0',
            }}
          >
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '16px',
                background: 'rgba(0,0,0,0.7)',
                color: '#ffffff',
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                backdropFilter: 'blur(4px)',
              }}
            >
              Fresh &amp; Authentic
            </span>
          </div>
        )}

        {/* Header */}
        <div class="ad-stand-header">
          <h3 class="ad-stand-cafe-name">{cafeName}</h3>
          <p class="ad-stand-tagline">Good Food &bull; Great Moments</p>
          <div
            class="ad-stand-table-badge"
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
        <div class="ad-stand-qr-wrapper">
          <img src={qrUrl} alt={`QR Code Table ${tableNumber}`} class="ad-stand-qr-img" />
        </div>

        {/* Instructions */}
        <div style={{ margin: '0.4rem 0' }}>
          <div class="ad-stand-scan-prompt">Point Phone Camera to Scan</div>
          <p class="ad-stand-footer-note">
            Browse full food &amp; drinks menu with photos &bull; No app needed
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

  // Mini Variant (for gallery stage)
  return (
    <div class={`ad-stand-card ad-stand-card--mini ${template.cardClass}`}>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h5 class="ad-stand-cafe-name">{cafeName}</h5>
        <div
          class="ad-stand-table-badge"
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
          Table #{tableNumber}
        </div>
      </div>

      <div class="ad-stand-qr-wrapper">
        <img src={qrUrl} alt="QR Mini" class="ad-stand-qr-img" />
      </div>

      <div style={{ width: '100%', textAlign: 'center' }}>
        <span class="ad-stand-scan-prompt">Scan for Menu</span>
      </div>
    </div>
  );
}

export default function QrTemplatesView({ cafeName = 'CafeMenu', onShowToast }) {
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
    link.href = `/qr.png?url=${encodeURIComponent(`${window.location.origin}/abol-cafe?table=${selectedTable}`)}`;
    link.download = `cafemenu-table-${selectedTable}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast(`QR Code for Table #${selectedTable} downloaded!`);
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
        <div
          class="ad-hero-card"
          style={{
            background:
              'linear-gradient(to right, rgba(14, 20, 17, 0.96) 0%, rgba(14, 20, 17, 0.8) 55%, rgba(14, 20, 17, 0.3) 100%), url("/images/coffee.jpg") center/cover no-repeat',
            minHeight: '190px',
          }}
        >
          <h2 class="ad-hero-title">QR Menu Templates</h2>
          <p class="ad-hero-sub" style={{ maxWidth: '480px' }}>
            Artistic stand card templates for your tables and counters. Customize, preview live with any table number, and print directly.
          </p>
          <div class="ad-qr-feature-badges">
            <span class="ad-qr-feature-item">
              <ZapIcon size={14} /> Fast &amp; Contactless
            </span>
            <span class="ad-qr-feature-item">
              <QrCodeIcon size={14} /> 6 Bespoke Artistic Styles
            </span>
            <span class="ad-qr-feature-item">
              <SmartphoneIcon size={14} /> High-Res Vector QR
            </span>
          </div>
        </div>

        {/* 2. Info Alert */}
        <div class="ad-info-alert">
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>&#8505;</span>
          <span>
            Every template automatically embeds your real menu link and table number into the QR code. Click <strong>View Template</strong> to test different tables and print standard A5/A6 stand cards.
          </span>
        </div>

        {/* 3. Templates Gallery Section */}
        <div class="ad-panel-card" style={{ padding: '1.6rem' }}>
          <div class="ad-card-header" style={{ marginBottom: '1.4rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <h3 class="ad-card-title">Artistic Stand Templates</h3>
              <p class="ad-card-sub">
                Choose from artistic card designs crafted for restaurant tables, counters, and bar stands.
              </p>
            </div>

            {/* Filter Pills */}
            <div class="ad-filter-pills-row" role="tablist">
              <button
                type="button"
                class={`ad-filter-pill-btn ${filter === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({templates.length})
              </button>
              <button
                type="button"
                class={`ad-filter-pill-btn ${filter === 'active' ? 'is-active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active ({templates.filter((t) => t.status === 'active').length})
              </button>
              <button
                type="button"
                class={`ad-filter-pill-btn ${filter === 'inactive' ? 'is-active' : ''}`}
                onClick={() => setFilter('inactive')}
              >
                Inactive ({templates.filter((t) => t.status === 'inactive').length})
              </button>
            </div>
          </div>

          {/* Templates Grid (2 rows of 3) */}
          <div class="ad-qr-templates-grid">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.id} class="ad-qr-card">
                {/* Visual Preview Stage with mini Artistic Stand Card */}
                <div class="ad-qr-preview-stage">
                  <img
                    src={tpl.bgImg}
                    alt={tpl.name}
                    class="ad-qr-preview-img"
                    style={{ filter: 'brightness(0.35) blur(1px)' }}
                  />

                  {/* Status Tag */}
                  <span
                    class={`ad-qr-status-tag ${
                      tpl.status === 'active'
                        ? 'ad-qr-status-tag--active'
                        : 'ad-qr-status-tag--inactive'
                    }`}
                  >
                    {tpl.status === 'active' ? 'Active' : 'Inactive'}
                  </span>

                  {/* Artistic Stand Card Preview */}
                  <ArtisticStandCard
                    template={tpl}
                    cafeName={cafeName}
                    tableNumber="1"
                    isFullSize={false}
                  />
                </div>

                <div class="ad-qr-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <h4 class="ad-qr-card-title">{tpl.name}</h4>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: tpl.accentColor,
                        background: 'rgba(0,0,0,0.04)',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {tpl.badgeText}
                    </span>
                  </div>
                  <p class="ad-qr-card-desc">{tpl.description}</p>

                  <div class="ad-qr-card-actions">
                    <button
                      type="button"
                      class="ad-qr-btn-view"
                      onClick={() => setSelectedTemplate(tpl)}
                    >
                      <EyeIcon size={14} />
                      <span>View &amp; Print</span>
                    </button>
                    <button
                      type="button"
                      class="ad-qr-btn-icon"
                      onClick={() => handleToggleActive(tpl.id)}
                      title={tpl.status === 'active' ? 'Deactivate template' : 'Activate template'}
                    >
                      <CheckIcon
                        size={14}
                        style={{ color: tpl.status === 'active' ? '#10b981' : '#9ca3af' }}
                      />
                    </button>
                    <button
                      type="button"
                      class="ad-qr-btn-icon"
                      onClick={handleDownloadQr}
                      title="Download QR Code"
                    >
                      <DownloadIcon size={14} />
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
                <div class="ad-action-tile-title">Live Menu</div>
                <div class="ad-action-tile-sub">Open customer menu preview</div>
              </div>
              <span class="ad-action-tile-arrow">&rsaquo;</span>
            </a>

            <div class="ad-action-tile" onClick={handleDownloadQr} role="button" tabIndex={0}>
              <div class="ad-action-tile-icon">
                <DownloadIcon size={18} />
              </div>
              <div class="ad-action-tile-info">
                <div class="ad-action-tile-title">Download QR</div>
                <div class="ad-action-tile-sub">High-resolution QR code</div>
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
                <div class="ad-action-tile-title">Print Stand Card</div>
                <div class="ad-action-tile-sub">Printable A5/A6 card format</div>
              </div>
              <span class="ad-action-tile-arrow">&rsaquo;</span>
            </div>

            <div class="ad-action-tile" onClick={handleShareLink} role="button" tabIndex={0}>
              <div class="ad-action-tile-icon">
                <ShareIcon size={18} />
              </div>
              <div class="ad-action-tile-info">
                <div class="ad-action-tile-title">Share Menu Link</div>
                <div class="ad-action-tile-sub">Copy URL to clipboard</div>
              </div>
              <span class="ad-action-tile-arrow">&rsaquo;</span>
            </div>
          </div>
        </div>

        {/* Live Stand Preview Hint */}
        <div class="ad-promo-card" style={{ minHeight: '220px' }}>
          <h4 class="ad-promo-title" style={{ fontSize: '1.25rem' }}>Ready For Tables</h4>
          <p class="ad-promo-sub">
            Print stand cards on sturdy cardstock or acrylic stands. Guests simply aim their camera to view Ethiopian specialties and prices immediately.
          </p>
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
          <div class="ad-modal-box" style={{ maxWidth: '580px' }}>
            <button
              type="button"
              class="ad-modal-close-btn"
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
                  {selectedTemplate.badgeText} &bull; Ready for printing on table stands
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
                class="ad-select-dropdown"
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
                isFullSize={true}
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
                class="ad-btn-action-secondary"
                onClick={handleDownloadQr}
                style={{ width: 'auto', padding: '0.65rem 1.2rem' }}
              >
                <DownloadIcon size={16} />
                <span>Download QR PNG</span>
              </button>
              <button
                type="button"
                class="ad-btn-action-primary"
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
