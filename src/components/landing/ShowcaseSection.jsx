import React from 'react';

export default function ShowcaseSection() {
  return (
    <section className="showcase-sec" id="designs">
      <div className="l-wrap">
        <div className="sec-head">
          <span className="sec-head__pill">TAILORED IDENTITIES</span>
          <h2 className="sec-head__title">A Digital Menu That Reflects Your Atmosphere</h2>
          <p className="sec-head__desc">
            CafeMenu is architected to give each venue its own distinctive brand identity &mdash; from artisan bistros to specialty roasteries and rustic pizzerias.
          </p>
        </div>

        <div className="showcase-grid">
          {/* Card 1: The Cafe (Live Sample) */}
          <div className="showcase-card">
            <div className="showcase-card__art">
              <img
                src="/images/dishes/traditional-buna-ceremony.jpg"
                alt="The Cafe"
                className="showcase-card__img"
                loading="lazy"
                width="400"
                height="220"
              />
              <span className="showcase-card__badge showcase-card__badge--live">&bull; Live Sample</span>
            </div>
            <div className="showcase-card__body">
              <h3 className="showcase-card__title">The Cafe</h3>
              <div className="showcase-card__theme-tag">Warm Hearth &amp; Artisan Heritage</div>
              <p className="showcase-card__desc">
                Rich roasted-coffee tones, amber highlights, and dual-script Amharic typography honoring authentic culinary hospitality.
              </p>
              <a href="/cafe" className="showcase-card__link">
                <span>Open Live Menu</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Card 2: Verdant Botanical Roastery (Concept) */}
          <div className="showcase-card">
            <div className="showcase-card__art">
              <img
                src="/images/dishes/ethiopian-pour-over.jpg"
                alt="Verdant Botanical Roastery"
                className="showcase-card__img"
                loading="lazy"
                width="400"
                height="220"
              />
              <span className="showcase-card__badge showcase-card__badge--concept">Design Concept</span>
            </div>
            <div className="showcase-card__body">
              <h3 className="showcase-card__title">Verdant Roastery</h3>
              <div className="showcase-card__theme-tag">Minimalist Nordic &amp; Specialty Brew</div>
              <p className="showcase-card__desc">
                Clean sage tones, understated serif typography, and origin tasting notes designed for modern third-wave espresso bars.
              </p>
              <span className="showcase-card__link" style={{ color: 'var(--c-text-muted)', cursor: 'default' }}>
                <span>Concept Mockup</span>
              </span>
            </div>
          </div>

          {/* Card 3: Fiore Neapolitan Pizzeria (Concept) */}
          <div className="showcase-card">
            <div className="showcase-card__art">
              <img
                src="/images/dishes/margherita.jpg"
                alt="Fiore Neapolitan Pizzeria"
                className="showcase-card__img"
                loading="lazy"
                width="400"
                height="220"
              />
              <span className="showcase-card__badge showcase-card__badge--concept">Design Concept</span>
            </div>
            <div className="showcase-card__body">
              <h3 className="showcase-card__title">Fiore Pizzeria</h3>
              <div className="showcase-card__theme-tag">Rustic Wood-Fired Kitchen</div>
              <p className="showcase-card__desc">
                Warm terracotta accents, bold Italian typography, and wood-fired crust highlights crafted for lively evening trattorias.
              </p>
              <span className="showcase-card__link" style={{ color: 'var(--c-text-muted)', cursor: 'default' }}>
                <span>Concept Mockup</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
