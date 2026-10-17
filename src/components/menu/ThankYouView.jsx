import React from 'react';
import { CoffeeIcon, ArrowRightIcon, WifiIcon, ClockIcon } from '../common/Icons.jsx';

export default function ThankYouView({ cafeName = 'CafeMenu', onReturn }) {
  return (
    <div class="cm-thankyou-screen" role="region" aria-label="Thank you for visiting">
      <div class="cm-thankyou-content">
        <span class="cm-welcome-logo" style={{ color: '#ffffff', marginBottom: '0.5rem' }} aria-hidden="true">
          <CoffeeIcon size={40} />
        </span>
        <h2 class="cm-thankyou-brand">{cafeName}</h2>
        <span class="cm-thankyou-subbrand">Good Food &bull; Great Moments</span>

        <h3 class="cm-thankyou-heading">Thank you for visiting</h3>
        <p class="cm-thankyou-msg">Great food brings people together. We hope you enjoyed your time with us today.</p>

        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1rem',
          width: '100%',
          maxWidth: '300px',
          margin: '0 auto 1.5rem',
          border: '1px solid rgba(255,255,255,0.15)',
          fontSize: '0.82rem',
          lineHeight: '1.6',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <WifiIcon size={16} />
            <span>Guest WiFi: <strong>Prism-Cafe-5G</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClockIcon size={16} />
            <span>Hours: <strong>7:00 AM &ndash; 11:00 PM</strong></span>
          </div>
        </div>

        <button
          type="button"
          class="cm-welcome-btn"
          onClick={onReturn}
          style={{ width: '100%', maxWidth: '280px', marginBottom: '2rem' }}
        >
          <span>Return to Menu</span>
          <ArrowRightIcon size={18} />
        </button>

        <div class="cm-thankyou-home-bar"></div>
      </div>
    </div>
  );
}
