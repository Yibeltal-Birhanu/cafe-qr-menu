import React, { useState, useEffect } from 'react';
import { StarIcon, CoffeeIcon, GlobeIcon, BatteryIcon } from '../common/Icons.jsx';

export default function LandingHero() {
  const [qrUrl, setQrUrl] = useState('/qr.png?url=/cafe');

  useEffect(() => {
    try {
      const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
      setQrUrl('/qr.png?url=' + encodeURIComponent(origin + '/cafe'));
    } catch {
      setQrUrl('/qr.png?url=/cafe');
    }
  }, []);

  return (
    <section className="hero-sec">
      <div className="l-wrap hero-sec__grid">
        {/* Left Column: Copy & CTAs */}
        <div>
          <span className="hero-sec__eyebrow">
            <StarIcon size={14} style={{ verticalAlign: '-1px', marginRight: '4px' }} />
            NEXT-GENERATION DIGITAL QR MENUS
          </span>
          <h1 className="hero-sec__title">
            Turn Every Table into an <em>Instant Digital Experience.</em>
          </h1>
          <p className="hero-sec__lead">
            Elevate your dining atmosphere with lightning-fast, camera-first QR menus. Update prices in seconds, showcase appetizing photography, and delight your guests &mdash; all without reprinting paper.
          </p>
          <div className="hero-sec__ctas">
            <a href="#contact" className="l-btn l-btn--primary">
              <span>Get Your Cafe Online</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
            <a href="/cafe" className="l-btn l-btn--secondary">
              <span>Explore Demo Menu</span>
              <span aria-hidden="true">&#8599;</span>
            </a>
          </div>

          {/* Trust / Key Metrics */}
          <div className="hero-sec__trust">
            <div className="trust-item">
              <strong>$0 Re-prints</strong>
              <span>Instant price &amp; menu edits</span>
            </div>
            <div className="trust-item">
              <strong>No App Needed</strong>
              <span>Works directly in camera</span>
            </div>
            <div className="trust-item">
              <strong>100% Mobile</strong>
              <span>Fast load on any connection</span>
            </div>
          </div>
        </div>

        {/* Right Column: Flagship Smartphone Mockup & Floating Glass QR */}
        <div className="hero-sec__visual">
          <div className="phone-mockup" aria-label="Smartphone displaying Cafe digital menu preview">
            {/* Sleek Status Bar */}
            <div className="phone-mockup__status" aria-hidden="true">
              <span>9:41</span>
              <div className="phone-mockup__island"></div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                5G <BatteryIcon size={16} />
              </span>
            </div>

            {/* Screen Viewport */}
            <div className="phone-mockup__screen">
              <div className="phone-mockup__header">
                <span className="phone-mockup__logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CoffeeIcon size={13} />
                  Cafe
                </span>
                <span className="phone-mockup__lang" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <GlobeIcon size={11} />
                  AM / EN
                </span>
              </div>
              <div className="phone-mockup__dish-card">
                <div className="phone-mockup__img-wrap">
                  <img
                    src="/images/dishes/special-beef-tibs.jpg"
                    alt="Special Sizzling Beef Tibs"
                    className="phone-mockup__img"
                    loading="eager"
                    width="330"
                    height="165"
                  />
                  <span className="phone-mockup__tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <StarIcon size={11} />
                    Most Popular
                  </span>
                </div>
                <div className="phone-mockup__details">
                  <h3 className="phone-mockup__title">Special Sizzling Beef Tibs</h3>
                  <div className="phone-mockup__price">480 ETB</div>
                </div>
              </div>
              <div className="phone-mockup__subitem">
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Traditional Buna Ceremony</div>
                  <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>150 ETB &bull; Signature Roast</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', color: '#e6923c' }} aria-hidden="true">
                  <CoffeeIcon size={17} />
                </span>
              </div>
            </div>
          </div>

          {/* Floating Glass QR Badge */}
          <a href="/cafe" className="hero-sec__qr-card" title="Scan or click to view live Cafe menu">
            <img
              src={qrUrl}
              alt="Cafe QR Code"
              className="hero-sec__qr-img"
              id="heroQrImg"
              width="60"
              height="60"
            />
            <div className="hero-sec__qr-text">
              <strong>Cafe Demo</strong>
              <span>Scan with phone camera</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
