import React from 'react';
import {
  ZapIcon,
  GlobeIcon,
  PrinterIcon,
  StarIcon,
} from '../common/Icons.jsx';

export default function BenefitsSection() {
  return (
    <section className="benefits-sec" id="features">
      <div className="l-wrap">
        <div className="sec-head">
          <span className="sec-head__pill">WHY CAFEMENU</span>
          <h2 className="sec-head__title">Engineered for Cafe Owners, Loved by Guests</h2>
          <p className="sec-head__desc">
            Replace dirty, outdated laminated menus with an interactive digital presentation that increases average check size and simplifies daily service.
          </p>
        </div>

        <div className="benefits-grid">
          {/* Card 1: Zero Reprint Costs */}
          <div className="benefit-card">
            <div className="benefit-card__icon-wrap" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3 className="benefit-card__title">Zero Reprint Costs</h3>
            <p className="benefit-card__desc">
              Change prices, adjust seasonal menus, and correct typos on the fly from your admin screen without waiting on expensive print shop turnarounds.
            </p>
          </div>

          {/* Card 2: Camera-First Access */}
          <div className="benefit-card">
            <div className="benefit-card__icon-wrap" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="17" r="1"/><path d="M9 6h6"/>
              </svg>
            </div>
            <h3 className="benefit-card__title">Camera-First QR Access</h3>
            <p className="benefit-card__desc">
              Guests scan with their native iPhone or Android camera app. Zero app downloads, zero account logins, and zero friction to ordering.
            </p>
          </div>

          {/* Card 3: Mouth-Watering Visuals */}
          <div className="benefit-card">
            <div className="benefit-card__icon-wrap" aria-hidden="true">
              <StarIcon size={24} />
            </div>
            <h3 className="benefit-card__title">Mouth-Watering Visuals</h3>
            <p className="benefit-card__desc">
              Diners eat with their eyes first. Showcase appetizing photography, spice tags, and prep times that boost side orders and desserts.
            </p>
          </div>

          {/* Card 4: Bilingual Dual-Language */}
          <div className="benefit-card">
            <div className="benefit-card__icon-wrap" aria-hidden="true">
              <GlobeIcon size={24} />
            </div>
            <h3 className="benefit-card__title">Bilingual Dual-Language</h3>
            <p className="benefit-card__desc">
              Serve both local patrons and international tourists seamlessly with one-tap switching between English and Amharic (አማርኛ).
            </p>
          </div>

          {/* Card 5: Table QR Studio */}
          <div className="benefit-card">
            <div className="benefit-card__icon-wrap" aria-hidden="true">
              <PrinterIcon size={24} />
            </div>
            <h3 className="benefit-card__title">Table QR Studio</h3>
            <p className="benefit-card__desc">
              Generate custom branded table QR stands with table numbers, venue Wi-Fi credentials, and crisp vectors ready for print.
            </p>
          </div>

          {/* Card 6: Real-Time Availability */}
          <div className="benefit-card">
            <div className="benefit-card__icon-wrap" aria-hidden="true">
              <ZapIcon size={24} />
            </div>
            <h3 className="benefit-card__title">Real-Time Availability</h3>
            <p className="benefit-card__desc">
              Instantly toggle 86'd items with a single switch. Keep guests informed and stop your waitstaff from taking orders for sold-out dishes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
