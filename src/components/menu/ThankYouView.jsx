import React, { useState } from 'react';
import {
  CoffeeIcon,
  PizzaIcon,
  CakeIcon,
  FlameIcon,
  ArrowRightIcon,
  WifiIcon,
  ClockIcon,
  PhoneIcon,
  CopyIcon,
  CheckIcon,
  InfoIcon,
} from '../common/Icons.jsx';

export default function ThankYouView({
  cafeName = 'CafeMenu',
  tagline = 'Good Food • Great Moments',
  phone = '+251 91 123 4567',
  wifiSSID = '',
  wifiPass = '',
  currency = 'ETB',
  footerText = '',
  theme = null,
  logo = 'coffee',
  layout = 'bento',
  tableNumber = '04',
  onReturn,
  onToast,
}) {
  const [copied, setCopied] = useState(false);

  const effectiveWifiSSID = wifiSSID || `${cafeName.replace(/\s+/g, '-')}-Guest`;
  const effectiveWifiPass = wifiPass || 'Welcome2026';
  const effectivePhone = phone || '+251 91 123 4567';

  const copyWifiPassword = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(effectiveWifiPass).then(() => {
        setCopied(true);
        if (onToast) onToast('Wi-Fi password copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        if (onToast) onToast(`Password: ${effectiveWifiPass}`);
      });
    } else {
      if (onToast) onToast(`Password: ${effectiveWifiPass}`);
    }
  };

  const renderLogo = () => {
    const s = 28;
    switch (logo) {
      case 'pizza':
        return <PizzaIcon size={s} />;
      case 'cake':
      case 'dessert':
        return <CakeIcon size={s} />;
      case 'flame':
      case 'lounge':
        return <FlameIcon size={s} />;
      default:
        return <CoffeeIcon size={s} />;
    }
  };

  return (
    <div className="cm-details-screen" role="region" aria-label="Cafe Details & Information">
      {/* 1. Hero Brand Card */}
      <div className="cm-details-hero-card">
        <span className="cm-details-pill-tag">
          <InfoIcon size={13} />
          <span>Dining Room &bull; Table {tableNumber}</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ color: theme?.primaryColor || 'var(--cm-primary, #e6923c)' }}>
            {renderLogo()}
          </span>
          <h1 className="cm-details-brand-title">{cafeName}</h1>
        </div>

        <p className="cm-details-tagline">{tagline || 'Fresh flavors, handcrafted daily with authentic passion.'}</p>
      </div>

      {/* 2. Key Venue Details Grid */}
      <div className="cm-details-grid">
        {/* Guest Wi-Fi Card */}
        <div className="cm-details-card">
          <div className="cm-details-card-head">
            <div className="cm-details-card-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <WifiIcon size={20} />
            </div>
            <div>
              <h2 className="cm-details-card-title">Complimentary Guest Wi-Fi</h2>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Fast connection for all dining guests</span>
            </div>
          </div>

          <div className="cm-details-wifi-row">
            <div className="cm-details-wifi-info">
              <span className="cm-details-wifi-label">Network (SSID)</span>
              <span className="cm-details-wifi-val">{effectiveWifiSSID}</span>
            </div>
          </div>

          <div className="cm-details-wifi-row">
            <div className="cm-details-wifi-info">
              <span className="cm-details-wifi-label">Password</span>
              <span className="cm-details-wifi-val">{effectiveWifiPass}</span>
            </div>
            <button
              type="button"
              className="cm-copy-pill-btn"
              onClick={copyWifiPassword}
              aria-label="Copy Wi-Fi password"
            >
              {copied ? (
                <>
                  <CheckIcon size={14} style={{ color: '#16a34a' }} />
                  <span style={{ color: '#16a34a' }}>Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Operating Hours & Dining Service */}
        <div className="cm-details-card">
          <div className="cm-details-card-head">
            <div className="cm-details-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <ClockIcon size={20} />
            </div>
            <div>
              <h2 className="cm-details-card-title">Hours &amp; Service</h2>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Open 7 days a week</span>
            </div>
          </div>

          <div className="cm-details-info-row">
            <span>Hours:</span>
            <strong>7:00 AM &ndash; 11:00 PM (Daily)</strong>
          </div>
          <div className="cm-details-info-row">
            <span>Dining:</span>
            <span>Dine-in table service, takeaway &amp; digital ordering</span>
          </div>
        </div>

        {/* Contact & Table Assistance */}
        <div className="cm-details-card">
          <div className="cm-details-card-head">
            <div className="cm-details-card-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <PhoneIcon size={20} />
            </div>
            <div>
              <h2 className="cm-details-card-title">Table Assistance &amp; Inquiries</h2>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Need assistance? We are happy to help</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div className="cm-details-info-row" style={{ margin: 0 }}>
              <span>Phone:</span>
              <strong>{effectivePhone}</strong>
            </div>

            <a
              href={`tel:${effectivePhone.replace(/\s+/g, '')}`}
              className="cm-copy-pill-btn"
              style={{ textDecoration: 'none', background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' }}
              aria-label={`Call ${effectivePhone}`}
            >
              <PhoneIcon size={13} />
              <span>Call Staff</span>
            </a>
          </div>
        </div>

        {/* Kitchen & Dietary Quality */}
        <div className="cm-details-card" style={{ background: '#fafafa', borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <span style={{ color: '#6b7280', marginTop: '2px' }}>
              <InfoIcon size={16} />
            </span>
            <div style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.5 }}>
              <strong style={{ color: '#111827', display: 'block', marginBottom: '2px' }}>
                Dietary &amp; Preparation Notice
              </strong>
              All dishes are prepared fresh upon order using premium ingredients. Please inform your server if you have any allergies or specific dietary preferences.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons & Warm Closing */}
      <div className="cm-details-actions">
        <button
          type="button"
          className="cm-details-return-btn"
          onClick={onReturn}
          aria-label="Return to menu"
        >
          <span>Return to Menu</span>
          <ArrowRightIcon size={18} />
        </button>

        <div style={{ textAlign: 'center', marginTop: '0.8rem', padding: '0 1rem' }}>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 0.3rem' }}>
            Thank you for visiting <strong>{cafeName}</strong>!
          </p>
          <span style={{ fontSize: '0.74rem', color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {footerText || 'Good Food • Great Moments • Digital QR Menu'}
          </span>
        </div>
      </div>
    </div>
  );
}
