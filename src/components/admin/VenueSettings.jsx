import React, { useState, useEffect, useRef } from 'react';
import {
  SettingsIcon,
  CheckIcon,
  QrCodeIcon,
  EyeIcon,
  ShareIcon,
  WifiIcon,
  UploadIcon,
} from './AdminIcons.jsx';
import { THEME_PRESETS } from '../common/themePresets.js';

export default function VenueSettings({
  cafe,
  dishes = [],
  onSaveCafe,
  onResetSampleMenu,
  onShowToast,
  onUploadImage,
  cafeSlug,
}) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    currency: 'ETB',
    phone: '',
    wifi_ssid: '',
    wifi_pass: '',
    footer: '',
    hero_title: '',
    hero_description: '',
    hero_image: '',
    theme: {
      preset: 'showcase',
      primaryColor: '#1c2826',
      accentColor: '#e6923c',
      backgroundColor: '#f8f9fa',
      backgroundMode: 'light',
      surfaceColor: '#ffffff',
      textColor: '#111827',
      fontFamily: 'Plus Jakarta Sans',
    },
  });

  const [activeSection, setActiveSection] = useState('identity'); // 'identity' | 'hero' | 'theme' | 'wifi' | 'preview'
  const [isSaved, setIsSaved] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroFileInputRef = useRef(null);

  useEffect(() => {
    if (cafe) {
      const defaultPreset = THEME_PRESETS[0];
      const cafeTheme = cafe.theme && typeof cafe.theme === 'object' ? cafe.theme : {};
      const basePreset = THEME_PRESETS.find((p) => p.id === cafeTheme.preset) || defaultPreset;
      setFormData({
        name: cafe.name || '',
        tagline: cafe.tagline || '',
        currency: cafe.currency || 'ETB',
        phone: cafe.phone || '',
        wifi_ssid: cafe.wifi_ssid || '',
        wifi_pass: cafe.wifi_pass || '',
        footer: cafe.footer || '',
        hero_title: cafe.hero_title || '',
        hero_description: cafe.hero_description || '',
        hero_image: typeof cafe.hero_image === 'string' ? cafe.hero_image : (cafe.hero_image?.url || ''),
        theme: {
          ...basePreset,
          ...cafeTheme,
        },
      });
    }
  }, [cafe]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setIsSaved(false);
    onSaveCafe(updated);
  };

  const handleHeroFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      if (onUploadImage) {
        const res = await onUploadImage(file, 'hero');
        const url = typeof res === 'string' ? res : (res?.url || '');
        if (url) {
          handleChange('hero_image', url);
          if (onShowToast) onShowToast('Hero banner image uploaded');
        } else {
          throw new Error(res?.error || 'No image URL returned from upload');
        }
      } else {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('folder', 'hero');
        if (cafeSlug) fd.append('cafeSlug', cafeSlug);
        const res = await fetch(`/api/admin/upload?folder=hero${cafeSlug ? `&cafe=${cafeSlug}` : ''}`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
        const data = await res.json();
        if (data.url) {
          handleChange('hero_image', data.url);
          if (onShowToast) onShowToast('Hero banner image uploaded');
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      }
    } catch (err) {
      if (onShowToast) onShowToast(`Upload failed: ${err.message}`, true);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSelectPreset = (preset) => {
    const updatedTheme = {
      ...formData.theme,
      preset: preset.id,
      layout: preset.layout,
      cardStyle: preset.cardStyle,
      navStyle: preset.navStyle,
      landingStyle: preset.landingStyle,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor || '#64748b',
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor || '#ffffff',
      backgroundMode: preset.backgroundMode,
      surfaceColor: preset.surfaceColor || '#ffffff',
      textColor: preset.textColor,
      fontFamily: preset.fontFamily,
    };
    const updated = { ...formData, theme: updatedTheme };
    setFormData(updated);
    setIsSaved(false);
    onSaveCafe(updated);
  };

  const handleThemeColorChange = (key, value) => {
    const updatedTheme = { ...formData.theme, [key]: value };
    const updated = { ...formData, theme: updatedTheme };
    setFormData(updated);
    setIsSaved(false);
    onSaveCafe(updated);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    onSaveCafe(formData);
    setIsSaved(true);
    if (onShowToast) onShowToast('Venue settings saved successfully');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyWifi = () => {
    const info = `Wi-Fi: ${formData.wifi_ssid || 'Abol-Guest'} | Password: ${formData.wifi_pass || 'coffee123'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(info).then(() => {
        if (onShowToast) onShowToast('Wi-Fi credentials copied to clipboard');
      });
    }
  };

  const publicMenuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${cafe?.slug === 'abol-cafe' ? 'abol-cafe' : `cafe/${cafe?.slug || 'abol-cafe'}`}`
    : `/${cafe?.slug === 'abol-cafe' ? 'abol-cafe' : `cafe/${cafe?.slug || 'abol-cafe'}`}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Hero Header Banner */}
      <div
        className="ad-hero-card"
        style={{
          background:
            'linear-gradient(to right, rgba(14, 20, 17, 0.96) 0%, rgba(14, 20, 17, 0.8) 55%, rgba(14, 20, 17, 0.3) 100%), url("/images/coffee.jpg") center/cover no-repeat',
          minHeight: '150px',
        }}
      >
        <h2 className="ad-hero-title">Venue Settings</h2>
        <p className="ad-hero-sub" style={{ maxWidth: '520px' }}>
          Configure your cafe brand identity, active currency, guest Wi-Fi credentials, and visual theme. Changes sync live to customer menus.
        </p>
      </div>

      {/* 2. Top Action & Status Bar */}
      <div className="ad-settings-topbar">
        <div className="ad-settings-status-pill">
          <span className={`ad-settings-status-dot ${isSaved ? 'is-saved' : ''}`} />
          <span>{isSaved ? 'Settings saved to disk' : 'Automatic disk synchronization active'}</span>
        </div>

        <div className="ad-settings-topbar-actions">
          <a
            href={publicMenuUrl}
            target="_blank"
            rel="noreferrer"
            className="ad-btn-action-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', textDecoration: 'none' }}
            title="Open live customer menu in a new tab"
          >
            <EyeIcon size={14} />
            <span>Live Menu</span>
          </a>

          <button
            type="button"
            className="ad-btn-action-primary"
            onClick={handleSaveClick}
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}
          >
            <CheckIcon size={14} />
            <span>{isSaved ? 'Saved!' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      {/* 3. Segmented Navigation Strip for Mobile & Quick Filtering */}
      <div className="ad-settings-nav-strip" role="tablist" aria-label="Settings section tabs">
        {[
          { id: 'identity', label: 'Identity' },
          { id: 'hero', label: 'Hero Showcase' },
          { id: 'theme', label: 'Theme & Colors' },
          { id: 'wifi', label: 'Guest Wi-Fi' },
          { id: 'preview', label: 'Mobile Preview' },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            role="tab"
            aria-selected={activeSection === sec.id}
            className={`ad-settings-nav-btn ${activeSection === sec.id ? 'is-active' : ''}`}
            onClick={() => setActiveSection(sec.id)}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* 4. Main 2-Column Responsive Layout */}
      <div className={`ad-settings-grid ${activeSection === 'preview' ? 'is-preview-only' : ''}`}>
        {/* Left Column: Settings Configuration Cards */}
        {activeSection !== 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Card A: Cafe Identity & Branding */}
            {activeSection === 'identity' && (
            <div className="ad-panel-card ad-settings-card">
              <div className="ad-card-header" style={{ marginBottom: '1.2rem' }}>
                <div>
                  <h3 className="ad-card-title">Brand Identity</h3>
                  <p className="ad-card-sub">Core venue identity displayed on digital menu headers and physical stand cards</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="ad-field-label">Cafe Name *</label>
                  <input
                    data-cafe="name"
                    type="text"
                    className="ad-form-input"
                    placeholder="e.g. Abol Cafe & Bistro"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="ad-field-label">Tagline / Slogan</label>
                  <input
                    data-cafe="tagline"
                    type="text"
                    className="ad-form-input"
                    placeholder="e.g. Good Food • Great Moments"
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                  />
                </div>

                <div className="ad-form-grid-2">
                  <div>
                    <label className="ad-field-label">Default Currency</label>
                    <input
                      data-cafe="currency"
                      type="text"
                      className="ad-form-input"
                      placeholder="ETB"
                      value={formData.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                    />
                    <div className="ad-currency-selector">
                      {['ETB', 'USD', 'EUR', 'GBP'].map((cur) => (
                        <button
                          key={cur}
                          type="button"
                          className={`ad-currency-btn ${formData.currency === cur ? 'is-active' : ''}`}
                          onClick={() => handleChange('currency', cur)}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="ad-field-label">WhatsApp / Order Phone</label>
                    <input
                      data-cafe="phone"
                      type="tel"
                      className="ad-form-input"
                      placeholder="+251 91 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="ad-field-label">Footer Note / Copyright</label>
                  <input
                    data-cafe="footer"
                    type="text"
                    className="ad-form-input"
                    placeholder="e.g. Contactless Digital Dining Experience"
                    value={formData.footer}
                    onChange={(e) => handleChange('footer', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Card B: Homepage Hero & Banner Showcase */}
          {activeSection === 'hero' && (
            <div className="ad-panel-card ad-settings-card">
              <div className="ad-card-header" style={{ marginBottom: '1.2rem' }}>
                <div>
                  <h3 className="ad-card-title">Homepage Hero &amp; Banner Showcase</h3>
                  <p className="ad-card-sub">
                    Customize the headline, description, and hero banner image displayed at the top of the customer mobile menu.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="ad-field-label">Custom Hero Title</label>
                  <input
                    type="text"
                    className="ad-form-input"
                    placeholder="e.g. Wood-Fired Delicacies &amp; Reserve Roasts (leave empty for theme default)"
                    value={formData.hero_title || ''}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                    If empty, automatically uses your cafe name or signature theme heading.
                  </span>
                </div>

                <div>
                  <label className="ad-field-label">Custom Hero Description / Subtitle</label>
                  <textarea
                    className="ad-form-input"
                    rows={2}
                    placeholder="e.g. Freshly handcrafted ingredients, organic sourdough pizzas, and single-origin coffee."
                    value={formData.hero_description || ''}
                    onChange={(e) => handleChange('hero_description', e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label className="ad-field-label">Hero Banner Image URL or Upload</label>
                  <div className="ad-hero-upload-row">
                    <input
                      type="url"
                      className="ad-form-input"
                      placeholder="https://res.cloudinary.com/... or paste image URL"
                      value={formData.hero_image || ''}
                      onChange={(e) => handleChange('hero_image', e.target.value)}
                      style={{ flex: 1, minWidth: 0 }}
                    />
                    <input
                      type="file"
                      ref={heroFileInputRef}
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      style={{ display: 'none' }}
                    />
                    <div className="ad-hero-upload-buttons">
                      <button
                        type="button"
                        className="ad-btn-action-secondary"
                        onClick={() => heroFileInputRef.current && heroFileInputRef.current.click()}
                        disabled={uploadingHero}
                        style={{ whiteSpace: 'nowrap', padding: '0.65rem 1rem' }}
                      >
                        <UploadIcon size={14} />
                        <span>{uploadingHero ? 'Uploading...' : 'Upload Image'}</span>
                      </button>
                      {formData.hero_image && (
                        <button
                          type="button"
                          className="ad-btn-danger"
                          onClick={() => handleChange('hero_image', '')}
                          style={{ padding: '0.65rem 0.85rem' }}
                          title="Clear custom image"
                          aria-label="Clear image"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Optional Quick-select from dishes */}
                  {dishes && dishes.filter((d) => d && (typeof d.image === 'string' ? d.image : d.image?.url)).length > 0 && (
                    <div style={{ marginTop: '0.8rem' }}>
                      <span style={{ fontSize: '0.74rem', color: '#6b7280', display: 'block', marginBottom: '6px' }}>
                        Or select from existing dish photography:
                      </span>
                      <div className="ad-dish-select-strip">
                        {dishes
                          .filter((d) => d && (typeof d.image === 'string' ? d.image : d.image?.url))
                          .slice(0, 10)
                          .map((d) => {
                            const imgUrl = typeof d.image === 'string' ? d.image : (d.image?.url || '');
                            const isSelected = formData.hero_image === imgUrl;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => handleChange('hero_image', imgUrl)}
                                style={{
                                  border: isSelected ? '2px solid #e6923c' : '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '3px 8px 3px 3px',
                                  background: isSelected ? 'rgba(230, 146, 60, 0.08)' : '#ffffff',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.15s ease',
                                }}
                                title={`Use ${d.name} image`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={d.name}
                                  style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }}
                                />
                                <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {d.name}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Current Hero Image Preview Card */}
                  {formData.hero_image ? (
                    <div style={{ marginTop: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                          Current Hero Banner Preview
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                          Active on Customer Menu
                        </span>
                      </div>
                      <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1', maxHeight: '180px', position: 'relative', background: '#0e1411' }}>
                        <img
                          src={formData.hero_image}
                          alt="Current Hero Banner Preview"
                          style={{ width: '100%', height: '170px', objectFit: 'contain', display: 'block' }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.opacity = '0.5';
                          }}
                        />
                        <div style={{ position: 'absolute', bottom: '8px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: '#ffffff', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          Live Banner
                        </div>
                      </div>
                      <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {formData.hero_image}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleChange('hero_image', '')}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600, padding: 0, whiteSpace: 'nowrap' }}
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '1rem', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '14px', padding: '1.2rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '2px' }}>
                        No Custom Hero Image
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', maxWidth: '380px', marginInline: 'auto' }}>
                        The customer menu currently displays a clean typographic title card. Upload an image or select a dish photo to display a photo banner.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Card C: Theme & Visual Identity Customizer */}
          {activeSection === 'theme' && (
            <div className="ad-panel-card ad-settings-card">
              <div className="ad-card-header" style={{ marginBottom: '1.2rem' }}>
                <div>
                  <h3 className="ad-card-title">Theme &amp; Visual Identity</h3>
                  <p className="ad-card-sub">
                    Select a curated brand aesthetic or customize palette colors and typography.
                  </p>
                </div>
              </div>

              {/* 1-Click Aesthetic Presets */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label className="ad-field-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
                  Brand Aesthetic Presets
                </label>
                <div className="ad-theme-presets-grid">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = formData.theme?.preset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        style={{
                          padding: '0.9rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #e6923c' : '1px solid #e5e7eb',
                          background: isSelected ? 'rgba(230, 146, 60, 0.05)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 4px 12px rgba(230, 146, 60, 0.12)' : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '6px',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              {preset.previewColors.map((c, i) => (
                                <span
                                  key={i}
                                  style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    background: c,
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    display: 'inline-block',
                                  }}
                                />
                              ))}
                            </div>
                            {isSelected ? (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: '#e6923c',
                                  background: 'rgba(230, 146, 60, 0.12)',
                                  padding: '2px 6px',
                                  borderRadius: '999px',
                                }}
                              >
                                Active
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  color: '#6b7280',
                                  background: '#f3f4f6',
                                  padding: '1px 6px',
                                  borderRadius: '999px',
                                }}
                              >
                                {preset.archetype}
                              </span>
                            )}
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#111827', marginBottom: '2px' }}>
                            {preset.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.3, marginBottom: '0.4rem' }}>
                            {preset.tagline}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: '#f8fafc', padding: '0.45rem 0.55rem', borderRadius: '6px', fontSize: '0.68rem' }}>
                            <div style={{ color: '#475569' }}><b style={{ color: '#64748b' }}>Card:</b> {preset.cardStyle}</div>
                            <div style={{ color: '#475569' }}><b style={{ color: '#64748b' }}>Nav:</b> {preset.navStyle}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Brand Colors */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#111827' }}>
                      Template Color Palette
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#6b7280' }}>
                      The main background is simple clean white. Customize primary, secondary, and highlight colors below.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151' }}>Live Palette:</span>
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: formData.theme?.backgroundColor || '#ffffff', border: '1px solid #d1d5db' }} title="Main: White" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: formData.theme?.primaryColor || '#1c2826' }} title="1st: Primary" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: formData.theme?.secondaryColor || '#64748b' }} title="2nd: Secondary" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: formData.theme?.accentColor || '#e6923c' }} title="3rd: Highlight" />
                  </div>
                </div>

                <div className="ad-palette-grid">
                  {/* 1. Main Background Color (White) */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <label className="ad-field-label" style={{ fontSize: '0.76rem', marginBottom: '2px', display: 'block' }}>
                      Main Canvas &amp; Cards
                    </label>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '6px' }}>
                      Clean base for the entire menu
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={formData.theme?.backgroundColor || '#ffffff'}
                        onChange={(e) => {
                          handleThemeColorChange('backgroundColor', e.target.value);
                          handleThemeColorChange('surfaceColor', e.target.value);
                        }}
                        style={{
                          width: '38px',
                          height: '38px',
                          padding: '2px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: '#ffffff',
                          flexShrink: 0,
                        }}
                      />
                      <input
                        type="text"
                        className="ad-form-input"
                        value={formData.theme?.backgroundColor || '#ffffff'}
                        onChange={(e) => {
                          handleThemeColorChange('backgroundColor', e.target.value);
                          handleThemeColorChange('surfaceColor', e.target.value);
                        }}
                        style={{ fontFamily: 'monospace', fontSize: '0.82rem', padding: '0.45rem 0.6rem', flex: 1, minWidth: 0 }}
                      />
                    </div>
                  </div>

                  {/* 2. Primary 1st Color */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <label className="ad-field-label" style={{ fontSize: '0.76rem', marginBottom: '2px', display: 'block' }}>
                      1st Color (Primary Accent)
                    </label>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '6px' }}>
                      Brand buttons, active tabs &amp; titles
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={formData.theme?.primaryColor || '#1c2826'}
                        onChange={(e) => handleThemeColorChange('primaryColor', e.target.value)}
                        style={{
                          width: '38px',
                          height: '38px',
                          padding: '2px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: '#ffffff',
                          flexShrink: 0,
                        }}
                      />
                      <input
                        type="text"
                        className="ad-form-input"
                        value={formData.theme?.primaryColor || '#1c2826'}
                        onChange={(e) => handleThemeColorChange('primaryColor', e.target.value)}
                        style={{ fontFamily: 'monospace', fontSize: '0.82rem', padding: '0.45rem 0.6rem', flex: 1, minWidth: 0 }}
                      />
                    </div>
                  </div>

                  {/* 3. Secondary 2nd Color */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <label className="ad-field-label" style={{ fontSize: '0.76rem', marginBottom: '2px', display: 'block' }}>
                      2nd Color (Secondary Accent)
                    </label>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '6px' }}>
                      Card borders, sub-pills &amp; frame accents
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={formData.theme?.secondaryColor || '#64748b'}
                        onChange={(e) => handleThemeColorChange('secondaryColor', e.target.value)}
                        style={{
                          width: '38px',
                          height: '38px',
                          padding: '2px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: '#ffffff',
                          flexShrink: 0,
                        }}
                      />
                      <input
                        type="text"
                        className="ad-form-input"
                        value={formData.theme?.secondaryColor || '#64748b'}
                        onChange={(e) => handleThemeColorChange('secondaryColor', e.target.value)}
                        style={{ fontFamily: 'monospace', fontSize: '0.82rem', padding: '0.45rem 0.6rem', flex: 1, minWidth: 0 }}
                      />
                    </div>
                  </div>

                  {/* 4. 3rd Color (Accent / Highlight) */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <label className="ad-field-label" style={{ fontSize: '0.76rem', marginBottom: '2px', display: 'block' }}>
                      3rd Color (Highlights &amp; Prices)
                    </label>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '6px' }}>
                      Price tags &amp; signature highlights
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={formData.theme?.accentColor || '#e6923c'}
                        onChange={(e) => handleThemeColorChange('accentColor', e.target.value)}
                        style={{
                          width: '38px',
                          height: '38px',
                          padding: '2px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: '#ffffff',
                          flexShrink: 0,
                        }}
                      />
                      <input
                        type="text"
                        className="ad-form-input"
                        value={formData.theme?.accentColor || '#e6923c'}
                        onChange={(e) => handleThemeColorChange('accentColor', e.target.value)}
                        style={{ fontFamily: 'monospace', fontSize: '0.82rem', padding: '0.45rem 0.6rem', flex: 1, minWidth: 0 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Row */}
                <div style={{ marginTop: '0.2rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem' }}>
                  <label className="ad-field-label" style={{ fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>
                    Primary Font Family
                  </label>
                  <select
                    className="ad-form-input"
                    value={formData.theme?.fontFamily || 'Plus Jakarta Sans'}
                    onChange={(e) => handleThemeColorChange('fontFamily', e.target.value)}
                    style={{ padding: '0.55rem 0.8rem', fontSize: '0.85rem', maxWidth: '320px', width: '100%' }}
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                    <option value="Playfair Display">Playfair Display (Haute Luxury Serif)</option>
                    <option value="Inter">Inter (Contemporary Tech)</option>
                    <option value="Poppins">Poppins (Warm &amp; Rounded)</option>
                    <option value="Outfit">Outfit (Clean Geometric)</option>
                    <option value="Cinzel">Cinzel (Classic Heritage)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Card D: Customer Wi-Fi Connectivity */}
          {activeSection === 'wifi' && (
            <div className="ad-panel-card ad-settings-card">
              <div className="ad-card-header" style={{ marginBottom: '1.2rem' }}>
                <div>
                  <h3 className="ad-card-title">Guest Wi-Fi Access</h3>
                  <p className="ad-card-sub">Credentials displayed directly on customer phone menus</p>
                </div>
              </div>

              <div className="ad-form-grid-2">
                <div>
                  <label className="ad-field-label">Guest Wi-Fi Network (SSID)</label>
                  <input
                    data-cafe="wifi_ssid"
                    type="text"
                    className="ad-form-input"
                    placeholder="e.g. Abol-Guest"
                    value={formData.wifi_ssid}
                    onChange={(e) => handleChange('wifi_ssid', e.target.value)}
                  />
                </div>

                <div>
                  <label className="ad-field-label">Wi-Fi Password</label>
                  <input
                    data-cafe="wifi_pass"
                    type="text"
                    className="ad-form-input"
                    placeholder="e.g. coffee123"
                    value={formData.wifi_pass}
                    onChange={(e) => handleChange('wifi_pass', e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-wifi-preview-strip">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ color: '#059669', display: 'inline-flex' }}>
                    <WifiIcon size={18} />
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                    Network: <strong>{formData.wifi_ssid || 'None'}</strong> &bull; Pass: <strong>{formData.wifi_pass || 'None'}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="ad-btn-action-secondary"
                  onClick={handleCopyWifi}
                  style={{ width: 'auto', padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
                >
                  Copy Info
                </button>
              </div>
            </div>
          )}

          {/* Card E: Save Changes Bar */}
          {true && (
            <div className="ad-panel-card ad-settings-card ad-settings-save-bar">
              <span style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                All modifications are automatically saved to disk.
              </span>
              <button
                type="button"
                className="ad-btn-action-primary"
                onClick={handleSaveClick}
                style={{ width: 'auto', padding: '0.65rem 1.6rem' }}
              >
                <CheckIcon size={16} />
                <span>{isSaved ? 'Saved!' : 'Save All Settings'}</span>
              </button>
            </div>
          )}

          {/* Card F: Danger Zone */}
          {activeSection === 'identity' && (
            <div className="ad-danger-card" style={{ marginTop: '0.5rem' }}>
              <h4 style={{ margin: '0 0 0.35rem', color: '#b91c1c', fontSize: '0.95rem', fontWeight: 800 }}>
                Danger Zone
              </h4>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#7f1d1d' }}>
                Restores the default sample menu and clears custom dishes and category modifications.
              </p>
              <button
                type="button"
                className="ad-btn-action-primary"
                id="resetBtn"
                onClick={onResetSampleMenu}
                style={{ background: '#dc2626', borderColor: '#b91c1c', width: 'auto', padding: '0.6rem 1.4rem' }}
              >
                Reset to Sample Menu
              </button>
            </div>
          )}
          </div>
        )}

        {/* Right Column: Live Customer Header Simulator & Public URL */}
        <div className={`ad-settings-preview-col ${activeSection === 'preview' ? 'is-active-tab' : ''}`}>
            {/* Simulator Box */}
            <div className="ad-panel-card ad-settings-card">
              <h4 className="ad-card-title" style={{ marginBottom: '0.35rem', fontSize: '1.05rem' }}>
                Customer Mobile Header
              </h4>
              <p className="ad-card-sub" style={{ marginBottom: '1.1rem' }}>
                Live preview of how guests see your cafe banner when they scan your QR code.
              </p>

              <div
                className="ad-phone-sim-box"
                style={{
                  fontFamily: `"${formData.theme?.fontFamily || 'Plus Jakarta Sans'}", sans-serif`,
                }}
              >
                <div
                  className="ad-phone-sim-topbar"
                  style={{
                    background: `linear-gradient(135deg, ${formData.theme?.backgroundColor || '#0e0a07'} 0%, ${formData.theme?.primaryColor || '#e6923c'} 160%)`,
                    color: formData.theme?.textColor || '#ffffff',
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: formData.theme?.textColor || '#ffffff' }}>
                    {formData.name || 'Cafe Name'}
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem', opacity: 0.85, color: formData.theme?.accentColor || '#fbbf24' }}>
                    {formData.tagline || 'Good Food • Great Moments'}
                  </p>

                  {formData.wifi_ssid && (
                    <div
                      className="ad-phone-sim-badge"
                      style={{
                        borderColor: formData.theme?.accentColor || '#fbbf24',
                        color: formData.theme?.accentColor || '#fbbf24',
                      }}
                    >
                      <WifiIcon size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                      <span>
                        Wi-Fi: {formData.wifi_ssid} (Pass: {formData.wifi_pass || 'Free'})
                      </span>
                    </div>
                  )}
                </div>

                <div className="ad-phone-sim-body">
                  {/* Simulated Customer Hero Showcase Card */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(230, 146, 60, 0.35)',
                      borderRadius: '12px',
                      padding: '0.8rem',
                      marginBottom: '0.8rem',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5
                        style={{
                          margin: '0 0 2px',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          color: '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {formData.hero_title || formData.name || 'Fresh Flavors Every Day'}
                      </h5>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.7rem',
                          color: '#64748b',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.3,
                        }}
                      >
                        {formData.hero_description || formData.tagline || 'Quality ingredients & authentic craft.'}
                      </p>
                    </div>
                    {formData.hero_image ? (
                      <div
                        style={{
                          width: '68px',
                          height: '62px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          position: 'relative',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <img
                          src={formData.hero_image}
                          alt="Hero preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            background: '#e6923c',
                            color: '#ffffff',
                            fontSize: '0.52rem',
                            fontWeight: 800,
                            padding: '1px 4px',
                            borderRadius: '4px',
                            letterSpacing: '0.04em',
                          }}
                        >
                          LIVE
                        </span>
                      </div>
                    ) : null}
                  </div>

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
                    {formData.footer || 'Contactless Dining'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Menu URL Card */}
            <div className="ad-panel-card ad-settings-card">
              <h4 className="ad-card-title" style={{ marginBottom: '0.35rem', fontSize: '1.05rem' }}>
                Live Menu URL
              </h4>
              <p className="ad-card-sub" style={{ marginBottom: '0.85rem' }}>
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
                {publicMenuUrl}
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <a
                  href={publicMenuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ad-btn-action-primary"
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
