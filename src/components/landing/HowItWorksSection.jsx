import React from 'react';

export default function HowItWorksSection() {
  return (
    <section className="how-sec" id="how-it-works">
      <div className="l-wrap">
        <div className="sec-head">
          <span className="sec-head__pill">HOW IT WORKS</span>
          <h2 className="sec-head__title">From Kitchen to Smartphone in 3 Steps</h2>
          <p className="sec-head__desc">
            Getting your cafe live on CafeMenu is simple, fast, and requires zero technical experience.
          </p>
        </div>

        <div className="how-steps">
          <div className="step-card">
            <div className="step-card__num">01</div>
            <h3 className="step-card__title">Configure Your Menu</h3>
            <p className="step-card__desc">
              Add your categories, dish descriptions, prices, dietary tags, and photography using our straightforward cafe administration dashboard.
            </p>
          </div>

          <div className="step-card">
            <div className="step-card__num">02</div>
            <h3 className="step-card__title">Print QR Table Stands</h3>
            <p className="step-card__desc">
              Download high-resolution table QR codes with table numbering and Wi-Fi credentials pre-configured for your dining room.
            </p>
          </div>

          <div className="step-card">
            <div className="step-card__num">03</div>
            <h3 className="step-card__title">Guests Scan &amp; Enjoy</h3>
            <p className="step-card__desc">
              Customers point their smartphone camera at the table QR code to browse your menu in high resolution and discover your best dishes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
