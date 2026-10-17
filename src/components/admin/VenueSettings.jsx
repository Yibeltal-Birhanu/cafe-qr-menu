import React, { useState, useEffect } from 'react';

export default function VenueSettings({ cafe, onSaveCafe }) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    currency: 'ETB',
    phone: '',
    wifi_ssid: '',
    wifi_pass: '',
    footer: '',
  });

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
    onSaveCafe(updated);
  };

  return (
    <div className="panel">
      <h2 className="panel__title">Cafe Profile &amp; Customer Connectivity</h2>
      <div className="settings">
        <label className="field">
          <span>Cafe Name</span>
          <input
            data-cafe="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </label>
        <label className="field">
          <span>Tagline</span>
          <input
            data-cafe="tagline"
            type="text"
            value={formData.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
          />
        </label>
        <label className="field">
          <span>Currency</span>
          <input
            data-cafe="currency"
            type="text"
            placeholder="ETB"
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          />
        </label>
        <label className="field">
          <span>WhatsApp Order Phone</span>
          <input
            data-cafe="phone"
            type="tel"
            placeholder="+251 91 123 4567"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </label>
        <label className="field">
          <span>Guest WiFi SSID</span>
          <input
            data-cafe="wifi_ssid"
            type="text"
            placeholder="Prism-Guest"
            value={formData.wifi_ssid}
            onChange={(e) => handleChange('wifi_ssid', e.target.value)}
          />
        </label>
        <label className="field">
          <span>WiFi Password</span>
          <input
            data-cafe="wifi_pass"
            type="text"
            placeholder="coffee123"
            value={formData.wifi_pass}
            onChange={(e) => handleChange('wifi_pass', e.target.value)}
          />
        </label>
        <label className="field field--wide">
          <span>Footer Note</span>
          <input
            data-cafe="footer"
            type="text"
            value={formData.footer}
            onChange={(e) => handleChange('footer', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
