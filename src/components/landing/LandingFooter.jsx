import React from 'react';
import { CoffeeIcon } from '../common/Icons.jsx';

export default function LandingFooter() {
  return (
    <footer className="l-footer">
      <div className="l-wrap">
        <div className="l-footer__grid">
          {/* Brand Info */}
          <div>
            <a className="l-footer__brand" href="/">
              <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <CoffeeIcon size={18} />
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>CafeMenu.</span>
            </a>
            <p className="l-footer__desc">
              The next-generation digital menu platform empowering cafes, bistros, and restaurants with contactless, visual smartphone menus.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="l-footer__col">
            <h4>Platform</h4>
            <ul className="l-footer__links">
              <li><a href="#features">Platform Features</a></li>
              <li><a href="/cafe">Cafe Live Demo &#8599;</a></li>
              <li><a href="#designs">Design Showcase</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#contact">Contact &amp; Onboarding</a></li>
            </ul>
          </div>

          {/* Venue Management */}
          <div className="l-footer__col">
            <h4>Cafe Management</h4>
            <ul className="l-footer__links">
              <li><a href="/admin">Cafe Owner Dashboard &rarr;</a></li>
              <li><a href="/admin">Table QR Code Studio &rarr;</a></li>
              <li><a href="/cafe">Customer Menu View &rarr;</a></li>
              <li>
                <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>
                  &#9679; Platform Status: Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="l-footer__bottom">
          <div>&copy; 2026 CafeMenu Platform. All rights reserved.</div>
          <div>
            <span>Preserving culinary tradition through modern digital craft.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
