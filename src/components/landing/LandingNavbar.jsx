import React, { useState, useEffect } from 'react';
import { CoffeeIcon } from '../common/Icons.jsx';

export default function LandingNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <header className="l-header" id="top">
        <div className="l-wrap l-nav">
          {/* Brand Wordmark */}
          <a className="l-brand" href="/" aria-label="CafeMenu Home">
            <span className="l-brand__badge" aria-hidden="true">
              <CoffeeIcon size={18} />
            </span>
            <span className="l-brand__name">
              CafeMenu<span className="l-brand__dot">.</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="l-nav__links">
            <li><a href="#features" className="l-nav__link">Features</a></li>
            <li><a href="#demo" className="l-nav__link">Live Demo</a></li>
            <li><a href="#designs" className="l-nav__link">Design Showcase</a></li>
            <li><a href="#how-it-works" className="l-nav__link">How It Works</a></li>
            <li><a href="#contact" className="l-nav__link">Contact</a></li>
          </ul>

          {/* Action Buttons */}
          <div className="l-nav__actions">
            <a href="/cafe" className="l-btn l-btn--secondary" title="View live digital menu">
              <span>Cafe Demo</span>
              <span aria-hidden="true">&#8599;</span>
            </a>
            <a href="#contact" className="l-btn l-btn--primary">
              <span>Get Your Cafe Online</span>
            </a>
            {/* Mobile Drawer Toggle */}
            <button
              className="l-menu-toggle"
              id="menuToggle"
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="mobileDrawer"
              onClick={toggleDrawer}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div
        className={`l-mobile-drawer ${drawerOpen ? 'is-open' : ''}`}
        id="mobileDrawer"
        aria-hidden={!drawerOpen}
      >
        <a href="#features" className="mobile-nav-item" onClick={closeDrawer}>Features</a>
        <a href="#demo" className="mobile-nav-item" onClick={closeDrawer}>Live Demo</a>
        <a href="#designs" className="mobile-nav-item" onClick={closeDrawer}>Design Showcase</a>
        <a href="#how-it-works" className="mobile-nav-item" onClick={closeDrawer}>How It Works</a>
        <a href="#contact" className="mobile-nav-item" onClick={closeDrawer}>Contact &amp; Onboarding</a>
        <a
          href="/cafe"
          className="mobile-nav-item"
          style={{ color: 'var(--c-amber)', fontWeight: 800 }}
          onClick={closeDrawer}
        >
          Cafe Live Menu &#8599;
        </a>
        <a
          href="/admin"
          className="mobile-nav-item"
          style={{ color: 'var(--c-text-muted)', fontSize: '0.95rem' }}
          onClick={closeDrawer}
        >
          Cafe Owner Sign In &rarr;
        </a>
        <div style={{ marginTop: '1rem' }}>
          <a
            href="#contact"
            className="l-btn l-btn--primary"
            style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
            onClick={closeDrawer}
          >
            Get Your Cafe Online
          </a>
        </div>
      </div>
    </>
  );
}
