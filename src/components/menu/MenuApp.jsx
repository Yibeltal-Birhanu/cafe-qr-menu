import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import WelcomeCover from './WelcomeCover.jsx';
import MenuHeader from './MenuHeader.jsx';
import DishListItem from './DishListItem.jsx';
import DishDetailModal from './DishDetailModal.jsx';
import BottomNav from './BottomNav.jsx';
import ThankYouView from './ThankYouView.jsx';
import MenuHero from './MenuHero.jsx';
import Preloader from './Preloader.jsx';
import SpecialCard from './SpecialCard.jsx';
import {
  SearchIcon,
  ArrowRightIcon,
  ClockIcon,
  CoffeeIcon,
  BurgerIcon,
  PizzaIcon,
  CakeIcon,
  DrinkIcon,
  BreakfastIcon,
  StarIcon,
  UtensilsCrossedIcon,
  GridIcon,
} from '../common/Icons.jsx';
import { showcaseCategories } from './showcaseData.js';
import { applyThemeToDocument, THEME_PRESETS } from '../common/themePresets.js';
import { getHeroBannerImage, getThumbnailImage } from '../common/imageUtils.js';

export default function MenuApp() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'menu' | 'details'
  const [activeCategory, setActiveCategory] = useState(null); // null or category object
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [apiMenu, setApiMenu] = useState(null);
  const toastTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Determine active cafe slug from query params or URL path
  const getActiveCafeSlug = () => {
    if (typeof window === 'undefined') return 'abol-cafe';
    const searchParams = new URLSearchParams(window.location.search);
    const qCafe = searchParams.get('cafe');
    if (qCafe) return qCafe;

    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (!pathname || pathname === 'cafe' || pathname === 'menu' || pathname === 'menu.html' || pathname === 'scan') {
      return 'abol-cafe';
    }
    if (pathname.startsWith('cafe/')) {
      const parts = pathname.split('/');
      return parts[1] || 'abol-cafe';
    }
    if (pathname.startsWith('scan/')) {
      const parts = pathname.split('/');
      return parts[1] || 'abol-cafe';
    }
    return pathname;
  };

  // Determine table number from query params (e.g. ?table=3 or ?table=VIP-1)
  const tableNumber = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('table') || searchParams.get('tbl') || '';
  }, []);

  // Fetch API menu to keep synced with admin updates
  useEffect(() => {
    const slug = getActiveCafeSlug();
    fetch(`/api/${encodeURIComponent(slug)}/menu`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load cafe menu');
        return res.json();
      })
      .then((data) => {
        if (data && data.cafe) {
          setApiMenu(data);
          setIsDataLoaded(true);
          if (data.cafe.theme) {
            applyThemeToDocument(data.cafe.theme);
          }
        }
      })
      .catch(() => {
        fetch('/api/menu')
          .then((res) => res.json())
          .then((data) => {
            if (data && data.cafe) {
              setApiMenu(data);
              setIsDataLoaded(true);
              if (data.cafe.theme) {
                applyThemeToDocument(data.cafe.theme);
              }
            }
          })
          .catch(() => {
            setIsDataLoaded(true);
          });
      });

    // Count every QR scan / menu view as a real visitor in DB
    try {
      const params = new URLSearchParams(window.location.search);
      const table = params.get('table') || '';
      fetch(`/api/${encodeURIComponent(slug)}/scan${table ? `?table=${encodeURIComponent(table)}` : ''}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, source: 'qr_menu_view' }),
      }).catch(() => {});
    } catch (_) {}
  }, []);

  // Sync theme changes dynamically
  useEffect(() => {
    if (apiMenu?.cafe?.theme) {
      applyThemeToDocument(apiMenu.cafe.theme);
    }
  }, [apiMenu?.cafe?.theme]);

  const fallbackCafeName = useMemo(() => {
    const slug = getActiveCafeSlug();
    if (!slug || slug === 'abol-cafe') return 'Abol Cafe & Roasters';
    if (slug === 'sunset-bistro') return 'Sunset Bistro & Grill';
    if (slug === 'artisan-patisserie') return 'Artisan Pâtisserie';
    if (slug === 'skyline-lounge') return 'Skyline Lounge';
    if (slug === 'template-bento') return 'Bento Modern';
    if (slug === 'template-editorial') return 'The Reserve';
    if (slug === 'template-rustic') return 'Rustic Hearth';
    if (slug === 'template-boutique') return 'Salon Boutique';
    if (slug === 'template-noir') return 'Noir Cyber Lounge';
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }, []);

  const cafeName = apiMenu?.cafe?.name || fallbackCafeName;

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Consolidate categories: dynamic items from API with fallback to showcaseCategories
  const categories = useMemo(() => {
    if (!apiMenu || !apiMenu.categories || apiMenu.categories.length === 0) {
      return showcaseCategories;
    }

    const showcaseMap = new Map();
    showcaseCategories.forEach((sc) => {
      showcaseMap.set(sc.id, sc);
      showcaseMap.set(sc.name.toLowerCase(), sc);
    });

    return apiMenu.categories.map((cat) => {
      const showcaseCat = showcaseMap.get(cat.id) || showcaseMap.get(cat.name?.toLowerCase());
      const bannerImg = cat.image || showcaseCat?.bannerImg || `/images/${cat.icon || 'coffee'}.jpg`;
      const currency = apiMenu.cafe?.currency || 'ETB';

      const items = (cat.items || []).map((item) => {
        const showcaseItem = showcaseCat?.items?.find(
          (si) => si.id === item.id || si.name.toLowerCase() === item.name.toLowerCase()
        );
        return {
          ...item,
          image: item.image || showcaseItem?.image || '/images/dishes/classic-beef-burger.jpg',
          fullDescription: item.description || showcaseItem?.fullDescription || '',
          price: Number(item.price) || showcaseItem?.price || 0,
          currency: currency,
          tags: item.badge ? [item.badge] : [],
          subcategory: showcaseItem?.subcategory || 'All',
          isPopular: Boolean(item.badge) || Boolean(showcaseItem?.isPopular),
        };
      });

      return {
        id: cat.id,
        name: cat.name,
        icon: cat.icon || 'coffee',
        image: cat.image || bannerImg,
        tagline: cat.description || showcaseCat?.tagline || 'Freshly prepared for you.',
        bannerImg: bannerImg,
        subcategories: showcaseCat?.subcategories || ['All'],
        items,
      };
    });
  }, [apiMenu]);

  // Keep active category reference synced with latest categories data
  const currentCategory = useMemo(() => {
    if (!activeCategory) return null;
    return categories.find((c) => c.id === activeCategory.id) || activeCategory;
  }, [categories, activeCategory]);

  // Flatten all items for popular or search queries
  const allItems = useMemo(() => {
    const items = [];
    categories.forEach((cat) => {
      (cat.items || []).forEach((item) => {
        items.push({ ...item, categoryId: cat.id, categoryName: cat.name });
      });
    });
    return items;
  }, [categories]);

  // Filtered items based on activeCategory, subcategory, and search
  const displayedItems = useMemo(() => {
    let list = [];
    if (currentCategory) {
      list = currentCategory.items || [];
      if (activeSubcategory && activeSubcategory !== 'All') {
        list = list.filter((item) => item.subcategory === activeSubcategory);
      }
    } else {
      // Home screen / "All" category: render all food items across all categories
      list = allItems;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [currentCategory, activeSubcategory, searchQuery, allItems]);

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    setActiveSubcategory('All');
    setActiveTab('menu');
  };

  const handleBackToHome = () => {
    setActiveCategory(null);
    setActiveSubcategory('All');
    setSearchQuery('');
    setActiveTab('home');
  };

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Assign clean SVG food icons to categories
  const renderCategoryIcon = (cat) => {
    if (cat.image || cat.bannerImg) {
      return (
        <img
          src={getThumbnailImage(cat.image || cat.bannerImg, 36)}
          alt=""
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'inline-block',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    const s = `${cat.name || ''} ${cat.id || ''}`.toLowerCase();
    if (s.includes('coffee') || s.includes('tea') || s.includes('espresso') || s.includes('buna') || s.includes('latte')) {
      return <CoffeeIcon size={15} />;
    }
    if (s.includes('burger') || s.includes('sandwich')) {
      return <BurgerIcon size={15} />;
    }
    if (s.includes('pizza') || s.includes('pasta')) {
      return <PizzaIcon size={15} />;
    }
    if (s.includes('dessert') || s.includes('cake') || s.includes('pastry') || s.includes('sweet')) {
      return <CakeIcon size={15} />;
    }
    if (s.includes('drink') || s.includes('beverage') || s.includes('juice') || s.includes('smoothie') || s.includes('soda')) {
      return <DrinkIcon size={15} />;
    }
    if (s.includes('breakfast') || s.includes('egg') || s.includes('pancake')) {
      return <BreakfastIcon size={15} />;
    }
    if (s.includes('popular') || s.includes('special') || s.includes('signature') || s.includes('bestseller') || s.includes('habesha')) {
      return <StarIcon size={15} />;
    }
    return <UtensilsCrossedIcon size={15} />;
  };

  const cafeLogo = useMemo(() => {
    if (apiMenu?.cafe?.theme?.preset === 'showcase') return 'coffee';
    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro') return 'pizza';
    if (slug === 'artisan-patisserie') return 'cake';
    if (slug === 'skyline-lounge') return 'flame';
    return apiMenu?.cafe?.logo || 'coffee';
  }, [apiMenu?.cafe?.slug, apiMenu?.cafe?.logo, apiMenu?.cafe?.theme?.preset]);

  const cafeCoverImage = useMemo(() => {
    // 1. Explicit custom hero image
    if (apiMenu?.cafe?.hero_image && apiMenu.cafe.hero_image.trim()) {
      return apiMenu.cafe.hero_image.trim();
    }
    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792408842/cafe-qr-menu/dishes/margherita-pizza.jpg';
    if (slug === 'artisan-patisserie') return '/images/desserts.jpg';
    if (slug === 'skyline-lounge') return '/images/habesha.jpg';
    if (apiMenu?.cafe?.theme?.preset === 'showcase') return '/images/coffee.jpg';
    return categories[0]?.bannerImg || '/images/coffee.jpg';
  }, [apiMenu?.cafe?.hero_image, apiMenu?.cafe?.slug, categories, apiMenu?.cafe?.theme?.preset]);

  const currentLayout = apiMenu?.cafe?.theme?.layout || (THEME_PRESETS.find(p => p.id === apiMenu?.cafe?.theme?.preset)?.layout) || 'bento';
  const currentPreset = apiMenu?.cafe?.theme?.preset || 'showcase';

  const heroImage = useMemo(() => {
    // 1. Explicit custom hero image configured by manager or superadmin
    if (apiMenu?.cafe?.hero_image && typeof apiMenu.cafe.hero_image === 'string' && apiMenu.cafe.hero_image.trim()) {
      return apiMenu.cafe.hero_image.trim();
    }
    // 2. Archetype defaults for demo sample cafe ONLY
    const isSampleDemoCafe = !apiMenu?.cafe?.slug || apiMenu?.cafe?.slug === 'abol-cafe';
    if (isSampleDemoCafe) {
      if (currentLayout === 'bento') return '/images/dishes/classic-beef-burger.jpg';
      if (currentLayout === 'editorial') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792409085/cafe-qr-menu/dishes/special-beef-tibs.jpg';
      if (currentLayout === 'rustic') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792409014/cafe-qr-menu/dishes/doro-wat-special.jpg';
      if (currentLayout === 'boutique') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792408836/cafe-qr-menu/dishes/chocolate-lava.jpg';
      if (currentLayout === 'noir') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792409085/cafe-qr-menu/dishes/special-beef-tibs.jpg';
      return '/images/dishes/classic-beef-burger.jpg';
    }
    // 3. Custom tenant cafes (e.g. yibe) never display unrelated fake food photos
    return '';
  }, [apiMenu?.cafe?.hero_image, apiMenu?.cafe?.slug, currentLayout]);

    const specials = useMemo(() => {
    const all = [];
    categories.forEach((cat) => {
      if (Array.isArray(cat.items)) {
        cat.items.forEach((it) => {
          if (it.available !== false) {
            all.push({ ...it, categoryName: cat.name });
          }
        });
      }
    });
    const badged = all.filter((it) => it.badge && it.badge.trim());
    if (badged.length >= 3) return badged.slice(0, 6);
    return all.slice(0, 5);
  }, [categories]);

  const { heroTitle, heroSub } = useMemo(() => {
    const customTitle = apiMenu?.cafe?.hero_title?.trim();
    const customSub = (apiMenu?.cafe?.hero_description || apiMenu?.cafe?.hero_desc)?.trim();
    if (customTitle || customSub) {
      return {
        heroTitle: customTitle || (apiMenu?.cafe?.name === 'Abol Cafe' ? 'Fresh Flavors Every Day' : (apiMenu?.cafe?.name || 'Fresh Flavors Every Day')),
        heroSub: customSub || apiMenu?.cafe?.tagline || 'Quality ingredients, handcrafted with authentic passion.',
      };
    }

    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro' || currentLayout === 'rustic') {
      return {
        heroTitle: 'Flame-grilled Chicken. Bold Flavour.',
        heroSub: apiMenu?.cafe?.tagline || 'PERi-PERi your way. Slow-marinated, flame-fired to perfection.',
      };
    }
    if (slug === 'artisan-patisserie' || currentLayout === 'boutique') {
      return {
        heroTitle: 'French Viennoiserie & Tarts',
        heroSub: apiMenu?.cafe?.tagline || 'Butter croissants, delicate tarts & ceremonial rose tea.',
      };
    }
    if (slug === 'skyline-lounge' || currentLayout === 'noir') {
      return {
        heroTitle: 'Tokyo Cyber Lounge & Mixology',
        heroSub: apiMenu?.cafe?.tagline || 'Late-night molecular cocktails, electric bites & ambient synth.',
      };
    }
    if (currentLayout === 'editorial') {
      return {
        heroTitle: 'Curated Reserve & Tasting Menu',
        heroSub: apiMenu?.cafe?.tagline || 'Grand degustation, rare vintage roasts & dry-aged cuts.',
      };
    }
    return {
      heroTitle: apiMenu?.cafe?.name === 'Abol Cafe' ? 'Fresh Flavors Every Day' : (apiMenu?.cafe?.name || 'Fresh Flavors Every Day'),
      heroSub: apiMenu?.cafe?.tagline || 'Quality ingredients, handcrafted with authentic passion.',
    };
  }, [apiMenu?.cafe?.slug, apiMenu?.cafe?.tagline, apiMenu?.cafe?.name, currentLayout]);

  return (
    <div
      className={`cm-app cm-app--${currentLayout}`}
      data-theme-layout={currentLayout}
      data-theme-preset={currentPreset}
    >
      {/* 0. Brand Preloader Screen */}
      {showPreloader && (
        <Preloader
          cafeName={cafeName}
          tagline={apiMenu?.cafe?.tagline}
          logo={cafeLogo}
          theme={apiMenu?.cafe?.theme}
          tableNumber={tableNumber}
          isReady={isDataLoaded}
          onFinish={() => setShowPreloader(false)}
        />
      )}

      <div
        className={`cm-viewport cm-viewport--${currentLayout}`}
        data-theme-layout={currentLayout}
        data-theme-preset={currentPreset}
      >
        {/* 1. Welcome Splash / Cover Screen (dismissible) */}
        {showWelcome && (
          <WelcomeCover
            cafeName={cafeName}
            tagline={apiMenu?.cafe?.tagline || 'Good Food • Great Moments'}
            coverImage={cafeCoverImage}
            logo={cafeLogo}
            theme={apiMenu?.cafe?.theme}
            onStart={() => setShowWelcome(false)}
          />
        )}

        {/* 2. Top Header & Status Bar with Location Bar (NO bell ring, NO person icon) */}
        <MenuHeader
          cafeName={cafeName}
          tagline={apiMenu?.cafe?.tagline}
          cafeCity={apiMenu?.cafe?.city || apiMenu?.cafe?.address || ''}
          activeCategory={currentCategory}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'home') {
              setActiveCategory(null);
              setSearchQuery('');
            } else if (tab === 'menu' && !activeCategory) {
              setActiveCategory(categories[0]);
            }
          }}
          onBack={handleBackToHome}
          onSearchClick={focusSearch}
          tableNumber={tableNumber}
          logo={cafeLogo}
          theme={apiMenu?.cafe?.theme}
        />

        {/* 3. Main Scrollable Screen Content */}
        <div className="cm-screen-content">
          {activeTab === 'details' ? (
            <ThankYouView
              cafeName={cafeName}
              tagline={apiMenu?.cafe?.tagline}
              phone={apiMenu?.cafe?.phone}
              wifiSSID={apiMenu?.cafe?.wifi_ssid}
              wifiPass={apiMenu?.cafe?.wifi_pass}
              currency={apiMenu?.cafe?.currency || 'ETB'}
              footerText={apiMenu?.cafe?.footer}
              theme={apiMenu?.cafe?.theme}
              logo={cafeLogo}
              layout={currentLayout}
              tableNumber={tableNumber}
              onReturn={() => setActiveTab('home')}
              onToast={showToast}
            />
          ) : currentCategory ? (
            /* ================= CATEGORY VIEW ================= */
            <div>
              {/* Category Hero Banner Card */}
              <div className="cm-category-banner">
                <img
                  src={getHeroBannerImage(currentCategory.image || currentCategory.bannerImg || '/images/coffee.jpg')}
                  loading="lazy"
                  decoding="async"
                  alt={currentCategory.name}
                  className="cm-category-banner-bg"
                  onError={(e) => {
                    e.currentTarget.src = `/images/${currentCategory.icon || 'coffee'}.jpg`;
                  }}
                />
                <div className="cm-category-banner-overlay"></div>
                <div className="cm-category-banner-text">
                  <h1 className="cm-category-banner-title">{currentCategory.name}</h1>
                  <p className="cm-category-banner-sub">{currentCategory.tagline}</p>
                </div>
              </div>

              {/* Subcategory Pills */}
              {currentCategory.subcategories && (
                <div className="cm-subcategories" role="tablist">
                  {currentCategory.subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      className={`cm-sub-pill ${activeSubcategory === sub ? 'is-active' : ''}`}
                      onClick={() => setActiveSubcategory(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Dish List for this Category */}
              <div className={`cm-dish-list cm-dish-list--${currentLayout}`} data-layout={currentLayout}>
                {displayedItems.length > 0 ? (
                  displayedItems.map((dish) => (
                    <DishListItem
                      key={dish.id}
                      dish={dish}
                      onSelect={(item) => setSelectedDish(item)}
                      currency={dish.currency || 'ETB'}
                      layout={currentLayout}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    No items found in this section.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= HOME VIEW ================= */
            <div>
              {/* Distinct Archetype Hero Section */}
              <MenuHero
                layout={currentLayout}
                cafeName={cafeName}
                tagline={apiMenu?.cafe?.tagline}
                heroTitle={heroTitle}
                heroSub={heroSub}
                heroImage={heroImage}
                tableNumber={tableNumber}
                cafeSlug={apiMenu?.cafe?.slug || 'abol-cafe'}
                cafeCity={apiMenu?.cafe?.city || apiMenu?.cafe?.address || ''}
              />

              {/* Search Bar */}
              <div className="cm-search-container">
                <div className="cm-search-box">
                  <span style={{ color: '#9ca3af', display: 'inline-flex' }}>
                    <SearchIcon size={16} />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="search"
                    className="cm-search-input"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search menu items"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Today's Specials Carousel from MagicPath HomeScreen.tsx */}
              {!searchQuery && specials.length > 0 && (
                <section aria-labelledby="specials-heading" className="cm-sharp-specials-section">
                  <div className="cm-sharp-specials-header">
                    <div>
                      <p className="cm-sharp-specials-eyebrow">From our kitchen</p>
                      <h2 id="specials-heading" className="cm-sharp-specials-title">Today's Specials</h2>
                    </div>
                    <button
                      type="button"
                      className="cm-sharp-specials-btn"
                      onClick={() => {
                        const target = document.querySelector('.cm-category-pills') || document.querySelector('.cm-dish-list');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      aria-label="See all specials"
                    >
                      <span>See all</span>
                      <ArrowRightIcon size={15} />
                    </button>
                  </div>

                  <div className="cm-sharp-specials-carousel no-scrollbar">
                    {specials.map((dish) => (
                      <div key={dish.id} className="cm-sharp-specials-cell">
                        <SpecialCard
                          dish={dish}
                          onSelect={(item) => setSelectedDish(item)}
                          currency={dish.currency || 'ETB'}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hours & Status Card from MagicPath HomeScreen.tsx */}
              {currentLayout !== 'noir' && !searchQuery && (
                <aside className="cm-sharp-status-card">
                  <div className="cm-sharp-status-left">
                    <span className="cm-sharp-clock-badge">
                      <ClockIcon size={17} />
                    </span>
                    <div>
                      <p className="cm-sharp-status-title">Open today</p>
                      <p className="cm-sharp-status-desc">Until 10:00 PM · Dine-in welcome</p>
                    </div>
                  </div>
                  <span className="cm-sharp-status-live" aria-label="Open now" />
                </aside>
              )}

              {/* Horizontal Category Filter Squircles matching Reference Design */}
              <div
                className={`cm-category-pills cm-category-pills--${currentLayout}`}
                role="tablist"
                aria-label="Menu categories"
              >
                <button
                  type="button"
                  className={`cm-pill ${!currentCategory && !searchQuery ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveCategory(null);
                    setSearchQuery('');
                  }}
                >
                  <span className="cm-pill__icon"><GridIcon size={14} /></span>
                  <span className="cm-pill__label">{currentLayout === 'rustic' ? 'Bestsellers' : 'All'}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cm-pill ${currentCategory?.id === cat.id ? 'is-active' : ''}`}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    <span className="cm-pill__icon">
                      {renderCategoryIcon(cat)}
                    </span>
                    <span className="cm-pill__label">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Menu Items Section Head (Popular Picks with View All button) */}
              <div className="cm-section-head">
                <h3 className="cm-section-title">
                  {searchQuery
                    ? `Search Results (${displayedItems.length})`
                    : currentLayout === 'rustic'
                    ? 'Popular Picks'
                    : currentLayout === 'editorial'
                    ? "Chef's Tasting Menu"
                    : currentLayout === 'noir'
                    ? 'Evening Selections'
                    : currentLayout === 'bento'
                    ? 'Kitchen & Roastery Specials'
                    : 'Haute Gastronomie'}
                </h3>
                {!searchQuery && displayedItems.length > 0 && (
                  <button
                    type="button"
                    className="cm-section-link cm-section-link--view-all"
                    onClick={() => {
                      setActiveCategory(null);
                      setSearchQuery('');
                    }}
                  >
                    View All &rarr;
                  </button>
                )}
              </div>

              {/* Dish List */}
              <div className={`cm-dish-list cm-dish-list--${currentLayout}`} data-layout={currentLayout}>
                {displayedItems.length > 0 ? (
                  displayedItems.map((dish, index) => (
                    <DishListItem
                      key={dish.id || `dish-${index}`}
                      dish={dish}
                      onSelect={(item) => setSelectedDish(item)}
                      currency={dish.currency || 'ETB'}
                      layout={currentLayout}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    {searchQuery ? `No dishes found matching "${searchQuery}".` : 'No dishes available yet.'}
                  </div>
                )}
              </div>

                          </div>
          )}
        </div>

        
{/* 4. Floating Bottom Navigation Dock */}
        <BottomNav
          activeTab={activeTab}
          theme={apiMenu?.cafe?.theme}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'home') {
              setActiveCategory(null);
              setSearchQuery('');
            } else if (tab === 'menu' && !activeCategory) {
              setActiveCategory(categories[0]);
            }
          }}
        />

        {/* 5. MagicPath Dish Detail Screen Overlay */}
        {selectedDish && (
          <DishDetailModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            onToast={showToast}
            currency={selectedDish.currency || 'ETB'}
            layout={currentLayout}
            theme={apiMenu?.cafe?.theme}
          />
        )}

        {/* 6. Toast Notification */}
        <div
          className={`cm-toast ${toastMessage ? 'is-visible' : ''}`}
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      </div>
    </div>
  );
}
