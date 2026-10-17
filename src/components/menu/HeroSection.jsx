import React, { useState } from 'react';
import { WifiIcon, StarIcon, FlameIcon } from '../common/Icons.jsx';
import { videoMap } from './mediaData.js';
import { t as translate } from './translations.js';

export default function HeroSection({
  cafe = {},
  activeCategory = 'burgers',
  lang = 'en',
  onCopyWifi,
}) {
  const [copied, setCopied] = useState(false);

  const t = (key) => translate(key, lang);

  const handleCopyWifi = () => {
    if (cafe.wifi_pass) {
      navigator.clipboard.writeText(cafe.wifi_pass).then(() => {
        setCopied(true);
        if (onCopyWifi) onCopyWifi();
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const key = activeCategory === 'all' ? 'burgers' : activeCategory;
  const item = videoMap[key] || videoMap.habesha;

  return (
    <section className="hero wrap">
      <div className="hero__layout">
        {/* Left Column: Story, Title & Guest Wi-Fi */}
        <div className="hero__content">
          <span className="eyebrow" id="heroEyebrow">
            {t('heroEyebrow')}
          </span>
          <h1 id="heroTitle">{t('heroTitle')}</h1>
          <p id="heroText">{t('heroText')}</p>

          {/* Guest WiFi Card */}
          <div className="wifi-card" id="wifiCard">
            <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <WifiIcon size={16} />
            </span>
            <span>
              <span id="wifiLabel">{t('wifiLabel')}</span>{' '}
              <strong id="wifiSsid">{cafe.wifi_ssid || 'Prism-Cafe-5G'}</strong> &bull;{' '}
              <span id="wifiPassLabel">{t('wifiPassLabel')}</span>{' '}
              <strong id="wifiPass">{cafe.wifi_pass || 'coffee123'}</strong>
            </span>
            <button type="button" id="copyWifi" onClick={handleCopyWifi}>
              {copied ? t('copiedText') : t('copyBtn')}
            </button>
          </div>
        </div>

        {/* Right Column: Featured Real Food Video Showcase */}
        <div className="hero__video-card" id="heroVideoCard">
          <div className="hero__video-header">
            <div className="hero__video-badge">
              <span className="video-sparkle-dot" aria-hidden="true">
                <StarIcon size={11} />
              </span>
              <span id="heroLiveText">{t('heroLiveText')}</span>
            </div>
            <span className="hero__video-tag" id="heroVideoTag">
              <FlameIcon size={12} style={{ verticalAlign: '-1px', marginRight: '4px' }} />
              <span>{t('heroVideoTag')}</span>
            </span>
          </div>

          <div className="hero__video-stage" id="heroVideoStage" title="Featured food showcase">
            <div className="card__video-wrap" data-video-key={key}>
              {item.type === 'image' ? (
                <img
                  className="card__real-video card__real-img"
                  src={item.src}
                  alt={item.alt || key}
                  loading="eager"
                />
              ) : (
                <video
                  className="card__real-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={item.poster}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              )}
              <div className="card__video-gradient" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
