import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import WelcomeCover from './WelcomeCover.jsx';
import MenuHeader from './MenuHeader.jsx';
import DishListItem from './DishListItem.jsx';
import DishDetailModal from './DishDetailModal.jsx';
import BottomNav from './BottomNav.jsx';
import ThankYouView from './ThankYouView.jsx';
import MenuHero from './MenuHero.jsx';
import { SearchIcon, ArrowRightIcon } from '../common/Icons.jsx';
import { showcaseCategories } from './showcaseData.js';
import { applyThemeToDocument, THEME_PRESETS } from '../common/themePresets.js';

export default function MenuApp() {
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
    if (typeof window === 'undefined') return '01';
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('table') || searchParams.get('tbl') || '01';
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
              if (data.cafe.theme) {
                applyThemeToDocument(data.cafe.theme);
              }
            }
          })
          .catch(() => {});
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


  const cafeName = apiMenu?.cafe?.name || 'CafeMenu';

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
          rating: showcaseItem?.rating || 4.9,
          reviews: showcaseItem?.reviews || 95,
          tags: item.badge ? [item.badge, ...(showcaseItem?.tags || [])] : (showcaseItem?.tags || ['Freshly Prepared']),
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

  const cafeLogo = useMemo(() => {
    if (apiMenu?.cafe?.theme?.preset === 'showcase') return 'coffee';
    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro') return 'pizza';
    if (slug === 'artisan-patisserie') return 'cake';
    if (slug === 'skyline-lounge') return 'flame';
    return apiMenu?.cafe?.logo || 'coffee';
  }, [apiMenu?.cafe?.slug, apiMenu?.cafe?.logo, apiMenu?.cafe?.theme?.preset]);

  const cafeCoverImage = useMemo(() => {
    if (apiMenu?.cafe?.theme?.preset === 'showcase') return '/images/coffee.jpg';
    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792408842/cafe-qr-menu/dishes/margherita-pizza.jpg';
    if (slug === 'artisan-patisserie') return '/images/desserts.jpg';
    if (slug === 'skyline-lounge') return '/images/habesha.jpg';
    return categories[0]?.bannerImg || '/images/coffee.jpg';
  }, [apiMenu?.cafe?.slug, categories, apiMenu?.cafe?.theme?.preset]);

  const currentLayout = apiMenu?.cafe?.theme?.layout || (THEME_PRESETS.find(p => p.id === apiMenu?.cafe?.theme?.preset)?.layout) || 'bento';
  const currentPreset = apiMenu?.cafe?.theme?.preset || 'showcase';

  const heroImage = useMemo(() => {
    if (currentLayout === 'bento') return '/images/dishes/classic-beef-burger.jpg';
    if (currentLayout === 'editorial') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792409085/cafe-qr-menu/dishes/special-beef-tibs.jpg';
    if (currentLayout === 'rustic') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792408842/cafe-qr-menu/dishes/margherita.jpg';
    if (currentLayout === 'boutique') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792408836/cafe-qr-menu/dishes/chocolate-lava.jpg';
    if (currentLayout === 'noir') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792409085/cafe-qr-menu/dishes/special-beef-tibs.jpg';
    return allItems[0]?.image || '/images/dishes/classic-beef-burger.jpg';
  }, [currentLayout, allItems]);

  const { heroTitle, heroSub } = useMemo(() => {
    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro' || currentLayout === 'rustic') {
      return {
        heroTitle: 'Wood-Fired Pizzas & Flame Grills',
        heroSub: apiMenu?.cafe?.tagline || 'Stone-baked dough, charred prime steaks & hearth comfort.',
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
      class={`cm-app cm-app--${currentLayout}`}
      data-theme-layout={currentLayout}
      data-theme-preset={currentPreset}
    >
      <div
        class={`cm-viewport cm-viewport--${currentLayout}`}
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

        {/* 2. Top Header & Status Bar */}
        <MenuHeader
          cafeName={cafeName}
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
        <div class="cm-screen-content">
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
              <div class="cm-category-banner">
                <img
                  src={currentCategory.image || currentCategory.bannerImg || '/images/coffee.jpg'}
                  alt={currentCategory.name}
                  class="cm-category-banner-bg"
                  onError={(e) => {
                    e.currentTarget.src = `/images/${currentCategory.icon || 'coffee'}.jpg`;
                  }}
                />
                <div class="cm-category-banner-overlay"></div>
                <div class="cm-category-banner-text">
                  <h1 class="cm-category-banner-title">{currentCategory.name}</h1>
                  <p class="cm-category-banner-sub">{currentCategory.tagline}</p>
                </div>
              </div>

              {/* Subcategory Pills */}
              {currentCategory.subcategories && (
                <div class="cm-subcategories" role="tablist">
                  {currentCategory.subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      class={`cm-sub-pill ${activeSubcategory === sub ? 'is-active' : ''}`}
                      onClick={() => setActiveSubcategory(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Dish List for this Category */}
              <div class={`cm-dish-list cm-dish-list--${currentLayout}`} data-layout={currentLayout}>
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
              />

              {/* Search Bar */}
              <div class="cm-search-container">
                <div class="cm-search-box">
                  <span style={{ color: '#9ca3af', display: 'inline-flex' }}>
                    <SearchIcon size={16} />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="search"
                    class="cm-search-input"
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

              {/* Horizontal Category Filter Pills */}
              <div class="cm-category-pills" role="tablist" aria-label="Menu categories">
                <button
                  type="button"
                  class={`cm-pill ${!currentCategory && !searchQuery ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveCategory(null);
                    setSearchQuery('');
                  }}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    class={`cm-pill ${currentCategory?.id === cat.id ? 'is-active' : ''}`}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    {(cat.image || cat.bannerImg) && (
                      <img
                        src={cat.image || cat.bannerImg}
                        alt=""
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '6px',
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Menu Items Section Head */}
              <div class="cm-section-head">
                <h3 class="cm-section-title">
                  {searchQuery ? `Search Results (${displayedItems.length})` : 'All Foods'}
                </h3>
                {!searchQuery && displayedItems.length > 0 && (
                  <span
                    class="cm-section-link"
                    style={{ cursor: 'default' }}
                  >
                    {displayedItems.length} {displayedItems.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {/* Dish List */}
              <div class={`cm-dish-list cm-dish-list--${currentLayout}`} data-layout={currentLayout}>
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

        {/* 4. Bottom Navigation Bar */}
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

        {/* 5. Dish Detail Modal (Screen 4 Bottom Sheet) */}
        {selectedDish && (
          <DishDetailModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            onToast={showToast}
            currency={selectedDish.currency || 'ETB'}
          />
        )}

        {/* 6. Toast Notification */}
        <div
          class={`cm-toast ${toastMessage ? 'is-visible' : ''}`}
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      </div>
    </div>
  );
}
