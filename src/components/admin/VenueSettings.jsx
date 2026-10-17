import React, { useState, useEffect } from 'react';
import {
  SettingsIcon,
  CheckIcon,
  QrCodeIcon,
  EyeIcon,
  ShareIcon,
} from './AdminIcons.jsx';

export default function VenueSettings({
  cafe,
  onSaveCafe,
  onResetSampleMenu,
  onShowToast,
}) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    currency: 'ETB',
    phone: '',
    wifi_ssid: '',
    wifi_pass: '',
    footer: '',
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (cafe) {
      setFormData({
        name: cafe.name || '',
        tagline: cafe.tagline || '',
        currency: cafe.currency || 'ETB',
        phone: cafe.phone || '',
        wifi_ssid: cafe.wifi_ssid || '',
        wifi_pass: cafe.wifi_pass || '',
        footer: cafe.footer || '',
      });
    }
  }, [cafe]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setIsSaved(false);
    onSaveCafe(updated);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    onSaveCafe(formData);
    setIsSaved(true);
    if (onShowToast) onShowToast('Venue settings saved successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyWifi = () => {
    const info = `Wi-Fi: ${formData.wifi_ssid || 'Abol-Guest'} | Password: ${formData.wifi_pass || 'coffee123'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(info).then(() => {
        if (onShowToast) onShowToast('Wi-Fi credentials copied!');
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Hero Header Banner */}
      <div
        class="ad-hero-card"
        style={{
          background:
            'linear-gradient(to right, rgba(14, 20, 17, 0.96) 0%, rgba(14, 20, 17, 0.8) 55%, rgba(14, 20, 17, 0.3) 100%), url("/images/coffee.jpg") center/cover no-repeat',
          minHeight: '160px',
        }}
      >
        <h2 class="ad-hero-title">Venue &amp; Menu Settings</h2>
        <p class="ad-hero-sub" style={{ maxWidth: '520px' }}>
          Configure your café brand identity, default currency, guest Wi-Fi details, and ordering contact. Changes reflect immediately on customer menus.
        </p>
      </div>

      {/* 2. Main 2-Column Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Settings Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card A: Cafe Identity & Branding */}
          <div class="ad-panel-card" style={{ padding: '1.8rem' }}>
            <div class="ad-card-header" style={{ marginBottom: '1.4rem' }}>
              <div>
                <h3 class="ad-card-title">Brand Identity</h3>
                <p class="ad-card-sub">Core branding shown on digital menu headers and stand cards</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label class="ad-field-label">Cafe Name *</label>
                <input
                  data-cafe="name"
                  type="text"
                  class="ad-form-input"
                  placeholder="e.g. Abol Cafe & Bistro"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label class="ad-field-label">Tagline / Slogan</label>
                <input
                  data-cafe="tagline"
                  type="text"
                  class="ad-form-input"
                  placeholder="e.g. Good Food • Great Moments"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label class="ad-field-label">Default Currency</label>
                  <input
                    data-cafe="currency"
                    type="text"
                    class="ad-form-input"
                    placeholder="ETB"
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  />
                  <div class="ad-currency-selector">
                    {['ETB', 'USD', 'EUR'].map((cur) => (
                      <button
                        key={cur}
                        type="button"
                        class={`ad-currency-btn ${formData.currency === cur ? 'is-active' : ''}`}
                        onClick={() => handleChange('currency', cur)}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label class="ad-field-label">WhatsApp / Order Phone</label>
                  <input
                    data-cafe="phone"
                    type="tel"
                    class="ad-form-input"
                    placeholder="+251 91 123 4567"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label class="ad-field-label">Footer Note / Copyright</label>
                <input
                  data-cafe="footer"
                  type="text"
                  class="ad-form-input"
                  placeholder="e.g. Crafted with passion • Contactless QR Menu"
                  value={formData.footer}
                  onChange={(e) => handleChange('footer', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Card B: Customer Wi-Fi Connectivity */}
          <div class="ad-panel-card" style={{ padding: '1.8rem' }}>
            <div class="ad-card-header" style={{ marginBottom: '1.4rem' }}>
              <div>
                <h3 class="ad-card-title">Guest Wi-Fi Access</h3>
                <p class="ad-card-sub">Credentials displayed directly on customer phone menus</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div>
                <label class="ad-field-label">Guest Wi-Fi Network (SSID)</label>
                <input
                  data-cafe="wifi_ssid"
                  type="text"
                  class="ad-form-input"
                  placeholder="e.g. Abol-Guest"
                  value={formData.wifi_ssid}
                  onChange={(e) => handleChange('wifi_ssid', e.target.value)}
                />
              </div>

              <div>
                <label class="ad-field-label">Wi-Fi Password</label>
                <input
                  data-cafe="wifi_pass"
                  type="text"
                  class="ad-form-input"
                  placeholder="e.g. coffee123"
                  value={formData.wifi_pass}
                  onChange={(e) => handleChange('wifi_pass', e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: '1.2rem',
                background: '#f8faf9',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.1rem' }}>&#128246;</span>
                <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                  Network: <strong>{formData.wifi_ssid || 'None'}</strong> | Pass: <strong>{formData.wifi_pass || 'None'}</strong>
                </span>
              </div>
              <button
                type="button"
                class="ad-btn-action-secondary"
                onClick={handleCopyWifi}
                style={{ width: 'auto', padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
              >
                Copy Info
              </button>
            </div>
          </div>

          {/* Card C: Save Changes Bar */}
          <div
            class="ad-panel-card"
            style={{
              padding: '1.2rem 1.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.84rem', color: '#6b7280' }}>
              All modifications are automatically saved to disk.
            </span>
            <button
              type="button"
              class="ad-btn-action-primary"
              onClick={handleSaveClick}
              style={{ width: 'auto', padding: '0.65rem 1.6rem' }}
            >
              <CheckIcon size={16} />
              <span>{isSaved ? 'Saved!' : 'Save All Settings'}</span>
            </button>
          </div>

          {/* Card D: Danger Zone */}
          <div class="ad-danger-card">
            <h4 style={{ margin: '0 0 0.35rem', color: '#b91c1c', fontSize: '1rem', fontWeight: 800 }}>
              Danger Zone
            </h4>
            <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#7f1d1d' }}>
              Restores the default sample menu (Burgers, Pizza, Coffee, Breakfast, Desserts, Drinks) and clears modifications.
            </p>
            <button
              type="button"
              class="ad-btn-action-primary"
              id="resetBtn"
              onClick={onResetSampleMenu}
              style={{ background: '#dc2626', borderColor: '#b91c1c', width: 'auto', padding: '0.65rem 1.4rem' }}
            >
              Reset to Sample Menu
            </button>
          </div>
        </div>

        {/* Right Column: Live Customer Header Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Simulator Box */}
          <div class="ad-panel-card" style={{ padding: '1.6rem' }}>
            <h4 class="ad-card-title" style={{ marginBottom: '0.4rem', fontSize: '1.05rem' }}>
              Customer Mobile Header
            </h4>
            <p class="ad-card-sub" style={{ marginBottom: '1.2rem' }}>
              Live preview of how guests see your cafe banner when they scan your QR code.
            </p>

            <div class="ad-phone-sim-box">
              <div class="ad-phone-sim-topbar">
                <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  {formData.name || 'Cafe Name'}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', opacity: 0.8, color: '#d1fae5' }}>
                  {formData.tagline || 'Good Food • Great Moments'}
                </p>

                {formData.wifi_ssid && (
                  <div class="ad-phone-sim-badge">
                    <span>&#128246;</span>
                    <span>
                      Wi-Fi: {formData.wifi_ssid} (Pass: {formData.wifi_pass || 'Free'})
                    </span>
                  </div>
                )}
              </div>

              <div class="ad-phone-sim-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#6b7280' }}>Active Currency:</span>
                  <strong>{formData.currency || 'ETB'}</strong>
                </div>

                {formData.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#6b7280' }}>WhatsApp Orders:</span>
                    <strong>{formData.phone}</strong>
                  </div>
                )}

                <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '0.6rem', textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>
                  {formData.footer || '© 2026 CafeMenu • Contactless Dining'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Menu URL Card */}
          <div class="ad-panel-card" style={{ padding: '1.6rem' }}>
            <h4 class="ad-card-title" style={{ marginBottom: '0.4rem', fontSize: '1.05rem' }}>
              Live Menu URL
            </h4>
            <p class="ad-card-sub" style={{ marginBottom: '1rem' }}>
              Public address customers access directly or via QR code.
            </p>

            <div
              style={{
                background: '#f8faf9',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '0.65rem 0.9rem',
                fontSize: '0.82rem',
                wordBreak: 'break-all',
                color: '#13221e',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {typeof window !== 'undefined' ? `${window.location.origin}/abol-cafe` : '/abol-cafe'}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <a
                href="/abol-cafe"
                target="_blank"
                rel="noreferrer"
                class="ad-btn-action-primary"
                style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '0.6rem 0.8rem', fontSize: '0.8rem' }}
              >
                <EyeIcon size={14} />
                <span>Open Live Menu</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
