import React, { useState, useEffect } from 'react';
import {
  ZapIcon,
  StarIcon,
  BurgerIcon,
  CoffeeIcon,
  PizzaIcon,
  ClockIcon,
  CheckIcon,
} from '../common/Icons.jsx';

const DEMO_ITEMS = {
  specials: {
    name: 'Special Sizzling Beef Tibs',
    price: '480 ETB',
    tag: 'Most Popular',
    img: '/images/dishes/special-beef-tibs.jpg',
    desc: 'Tender prime beef cubes sautéed in spiced niter kibbeh with rosemary, jalapeños, and warm teff injera.',
    meta: '15 min • Sizzling Clay Skillet',
  },
  burgers: {
    name: 'Artisan Double Cheeseburger',
    price: '340 ETB',
    tag: 'Chef Special',
    img: '/images/dishes/artisan-smash-cheeseburger.jpg',
    desc: 'Double grass-fed smash patties, aged cheddar cheese, caramelized sweet onions, and house bistro remoulade on a toasted brioche bun.',
    meta: '12 min • Flame Grilled',
  },
  coffee: {
    name: 'Traditional Buna Ceremony',
    price: '150 ETB',
    tag: 'Signature Roast',
    img: '/images/dishes/traditional-buna-ceremony.jpg',
    desc: 'Authentic ceremonial coffee brewed in a traditional clay jebena with frankincense smoke, popcorn, and freshly roasted Ethiopian beans.',
    meta: '10 min • Single Origin Yirgacheffe',
  },
  pizza: {
    name: 'Truffle Funghi Mozzarella',
    price: '420 ETB',
    tag: 'Stone-Baked',
    img: '/images/dishes/truffle-funghi-mozzarella.jpg',
    desc: 'Slow-fermented sourdough crust topped with roasted wild mushrooms, fior di latte mozzarella, and cold-pressed black truffle oil.',
    meta: '14 min • 450° Wood-Fired',
  },
};

export default function InteractiveDemo() {
  const [activeCat, setActiveCat] = useState('specials');
  const [qrUrl, setQrUrl] = useState('/qr.png?url=/cafe');

  useEffect(() => {
    try {
      const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
      setQrUrl('/qr.png?url=' + encodeURIComponent(origin + '/cafe'));
    } catch {
      setQrUrl('/qr.png?url=/cafe');
    }
  }, []);

  const currentDish = DEMO_ITEMS[activeCat] || DEMO_ITEMS.specials;

  return (
    <section className="demo-sec" id="demo">
      <div className="l-wrap">
        <div className="sec-head">
          <span className="sec-head__pill">
            <ZapIcon size={14} style={{ verticalAlign: '-1px', marginRight: '3px' }} />
            INTERACTIVE LIVE DEMO
          </span>
          <h2 className="sec-head__title">Experience the Digital Cafe Menu</h2>
          <p className="sec-head__desc">
            Touch, explore, and scan. See how guests experience your cafe's digital menu in real time from their smartphone camera.
          </p>
        </div>

        {/* Interactive Category Switcher Tabs */}
        <div className="demo-tabs" role="tablist" aria-label="Demo menu category switcher">
          <button
            type="button"
            className={`demo-tab ${activeCat === 'specials' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('specials')}
            role="tab"
            aria-selected={activeCat === 'specials'}
          >
            <StarIcon size={15} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
            <span>Specials</span>
          </button>
          <button
            type="button"
            className={`demo-tab ${activeCat === 'burgers' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('burgers')}
            role="tab"
            aria-selected={activeCat === 'burgers'}
          >
            <BurgerIcon size={15} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
            <span>Burgers</span>
          </button>
          <button
            type="button"
            className={`demo-tab ${activeCat === 'coffee' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('coffee')}
            role="tab"
            aria-selected={activeCat === 'coffee'}
          >
            <CoffeeIcon size={15} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
            <span>Specialty Coffee</span>
          </button>
          <button
            type="button"
            className={`demo-tab ${activeCat === 'pizza' ? 'is-active' : ''}`}
            onClick={() => setActiveCat('pizza')}
            role="tab"
            aria-selected={activeCat === 'pizza'}
          >
            <PizzaIcon size={15} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
            <span>Artisan Pizza</span>
          </button>
        </div>

        <div className="demo-sec__card">
          {/* Left: Story & Interactive Dish Preview */}
          <div className="demo-sec__left">
            <div className="live-pulse-badge">
              <span className="live-pulse-dot" aria-hidden="true"></span>
              <span>Live Demonstration &bull; Table #04 Active</span>
            </div>
            <h3 className="demo-sec__cafe-name">Cafe</h3>
            <div className="demo-sec__tagline">Artisan Bistro &bull; Digital QR Menu</div>

            {/* Dynamic Live Dish Card (Interactively switched via tabs) */}
            <div className="demo-active-dish" id="demoActiveDishCard" aria-live="polite">
              <div className="demo-active-dish__img-wrap">
                <img
                  src={currentDish.img}
                  alt={currentDish.name}
                  id="demoDishImg"
                  className="demo-active-dish__img"
                  width="120"
                  height="120"
                />
              </div>
              <div className="demo-active-dish__info">
                <div className="demo-active-dish__top">
                  <span
                    className="demo-active-dish__tag"
                    id="demoDishTag"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <StarIcon size={11} />
                    <span id="demoDishTagText">{currentDish.tag}</span>
                  </span>
                  <span className="demo-active-dish__price" id="demoDishPrice">
                    {currentDish.price}
                  </span>
                </div>
                <h4 className="demo-active-dish__title" id="demoDishTitle">
                  {currentDish.name}
                </h4>
                <p className="demo-active-dish__desc" id="demoDishDesc">
                  {currentDish.desc}
                </p>
                <div
                  className="demo-active-dish__meta"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <ClockIcon size={13} />
                  <span id="demoDishMeta">{currentDish.meta}</span>
                </div>
              </div>
            </div>

            <div className="demo-sec__feature-list">
              <div className="demo-sec__feature-item">
                <span className="demo-sec__feature-icon" aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
                <span>English &amp; Amharic (አማርኛ)</span>
              </div>
              <div className="demo-sec__feature-item">
                <span className="demo-sec__feature-icon" aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
                <span>Instant 86 Item Toggling</span>
              </div>
              <div className="demo-sec__feature-item">
                <span className="demo-sec__feature-icon" aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
                <span>High-Definition Photography</span>
              </div>
              <div className="demo-sec__feature-item">
                <span className="demo-sec__feature-icon" aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
                <span>Table QR Code Studio</span>
              </div>
              <div className="demo-sec__feature-item">
                <span className="demo-sec__feature-icon" aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
                <span>Guest Wi-Fi Auto Connect</span>
              </div>
              <div className="demo-sec__feature-item">
                <span className="demo-sec__feature-icon" aria-hidden="true">
                  <CheckIcon size={18} />
                </span>
                <span>Lightning-Fast 0s Loading</span>
              </div>
            </div>
            <div>
              <a href="/cafe" className="l-btn l-btn--primary">
                <span>Open Full Live Menu</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right: Luxury Restaurant Acrylic QR Stand with Animated Scanner */}
          <div className="demo-sec__right">
            <div className="acrylic-qr-stand">
              <div className="acrylic-qr-stand__header">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CoffeeIcon size={14} />
                  Cafe
                </span>
                <span className="acrylic-qr-stand__table-pill">Table #04</span>
              </div>
              <div className="qr-scan-container">
                <img
                  src={qrUrl}
                  alt="Cafe Live Menu QR Code"
                  className="qr-box__img"
                  id="demoQrImg"
                  width="180"
                  height="180"
                />
                <div className="qr-scan-line" aria-hidden="true"></div>
              </div>
              <div className="acrylic-qr-stand__footer">
                TABLE 04 &bull; SCAN WITH PHONE CAMERA
              </div>
            </div>
            <h4 className="demo-sec__scan-prompt">Point your camera to test live</h4>
            <p className="demo-sec__scan-sub">
              Instantly opens the full Cafe digital menu on your phone screen. Zero app download required.
            </p>
            <a href="/cafe" className="demo-sec__direct-link">
              <span>Open in New Tab</span>
              <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
