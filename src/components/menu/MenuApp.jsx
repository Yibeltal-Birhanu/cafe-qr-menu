import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import WelcomeCover from './WelcomeCover.jsx';
import MenuHeader from './MenuHeader.jsx';
import DishListItem from './DishListItem.jsx';
import DishDetailModal from './DishDetailModal.jsx';
import BottomNav from './BottomNav.jsx';
import ThankYouView from './ThankYouView.jsx';
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
    if (!pathname || pathname === 'cafe' || pathname === 'menu' || pathname === 'menu.html') {
      return 'abol-cafe';
    }
    if (pathname.startsWith('cafe/')) {
      const parts = pathname.split('/');
      return parts[1] || 'abol-cafe';
    }
    return pathname;
  };

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
      const bannerImg = showcaseCat?.bannerImg || `/images/${cat.icon || 'coffee'}.jpg`;
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
        tagline: cat.description || showcaseCat?.tagline || 'Freshly prepared for you.',
        bannerImg: bannerImg,
        subcategories: showcaseCat?.subcategories || ['All'],
        items,
      };
    });
  }, [apiMenu]);

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
    if (activeCategory) {
      list = activeCategory.items;
      if (activeSubcategory && activeSubcategory !== 'All') {
        list = list.filter((item) => item.subcategory === activeSubcategory);
      }
    } else {
      // Home screen: showcase popular items + featured items
      list = allItems.filter((item) => item.isPopular || ['classic-burger', 'chicken-sandwich', 'pasta-alfredo', 'caesar-salad', 'latte', 'chocolate-cake'].includes(item.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (!activeCategory) {
        list = allItems.filter((item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
        );
      } else {
        list = list.filter((item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
        );
      }
    }

    return list;
  }, [activeCategory, activeSubcategory, searchQuery, allItems]);

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

  const heroImage = useMemo(() => {
    if (apiMenu?.cafe?.theme?.preset === 'showcase') return '/images/dishes/classic-beef-burger.jpg';
    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792408842/cafe-qr-menu/dishes/margherita-pizza.jpg';
    if (slug === 'artisan-patisserie') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792408836/cafe-qr-menu/dishes/chocolate-lava.jpg';
    if (slug === 'skyline-lounge') return 'https://res.cloudinary.com/zsyultue/image/upload/v1792409085/cafe-qr-menu/dishes/special-beef-tibs.jpg';
    return allItems[0]?.image || '/images/dishes/classic-beef-burger.jpg';
  }, [apiMenu?.cafe?.slug, allItems, apiMenu?.cafe?.theme?.preset]);

  const { heroTitle, heroSub } = useMemo(() => {
    if (apiMenu?.cafe?.theme?.preset === 'showcase') {
      return {
        heroTitle: 'Fresh Flavors Every Day',
        heroSub: 'Quality ingredients, Great taste.',
      };
    }
    const slug = apiMenu?.cafe?.slug;
    if (slug === 'sunset-bistro') {
      return {
        heroTitle: 'Wood-Fired Pizzas & Flame Grills',
        heroSub: 'Stone-baked dough, dry-aged steaks & sunset dining.',
      };
    }
    if (slug === 'artisan-patisserie') {
      return {
        heroTitle: 'French Viennoiserie & Tarts',
        heroSub: 'Butter croissants, delicate tarts & ceremonial matcha.',
      };
    }
    if (slug === 'skyline-lounge') {
      return {
        heroTitle: 'Artisan Roasts & Fine Dining',
        heroSub: 'Rooftop pour-overs, wagyu plates & gourmet desserts.',
      };
    }
    return {
      heroTitle: 'Authentic Habesha & Specialty Roasts',
      heroSub: apiMenu?.cafe?.tagline || 'Direct highland beans & sizzling dining.',
    };
  }, [apiMenu?.cafe?.slug, apiMenu?.cafe?.tagline, apiMenu?.cafe?.theme?.preset]);

  return (
    <div class="cm-app">
      <div
        class="cm-viewport"
        data-theme-layout={apiMenu?.cafe?.theme?.layout || (THEME_PRESETS.find(p => p.id === apiMenu?.cafe?.theme?.preset)?.layout) || 'bento'}
        data-theme-preset={apiMenu?.cafe?.theme?.preset || 'showcase'}
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
          activeCategory={activeCategory}
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
          tableNumber="04"
          logo={cafeLogo}
          theme={apiMenu?.cafe?.theme}
        />

        {/* 3. Main Scrollable Screen Content */}
        <div class="cm-screen-content">
          {activeTab === 'details' ? (
            <ThankYouView
              cafeName={cafeName}
              onReturn={() => setActiveTab('home')}
            />
          ) : activeCategory ? (
            /* ================= CATEGORY VIEW ================= */
            <div>
              {/* Category Hero Banner Card */}
              <div class="cm-category-banner">
                <img
                  src={activeCategory.bannerImg || '/images/coffee.jpg'}
                  alt={activeCategory.name}
                  class="cm-category-banner-bg"
                />
                <div class="cm-category-banner-overlay"></div>
                <div class="cm-category-banner-text">
                  <h1 class="cm-category-banner-title">{activeCategory.name}</h1>
                  <p class="cm-category-banner-sub">{activeCategory.tagline}</p>
                </div>
              </div>

              {/* Subcategory Pills */}
              {activeCategory.subcategories && (
                <div class="cm-subcategories" role="tablist">
                  {activeCategory.subcategories.map((sub) => (
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
              <div class="cm-dish-list">
                {displayedItems.length > 0 ? (
                  displayedItems.map((dish) => (
                    <DishListItem
                      key={dish.id}
                      dish={dish}
                      onSelect={(item) => setSelectedDish(item)}
                      currency={dish.currency || 'ETB'}
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
              {/* Dynamic Cafe Hero Banner Card */}
              <div
                class="cm-hero-banner"
                style={{
                  background: apiMenu?.cafe?.theme?.backgroundColor
                    ? `linear-gradient(135deg, ${apiMenu.cafe.theme.backgroundColor} 0%, ${apiMenu.cafe.theme.surfaceColor || apiMenu.cafe.theme.backgroundColor} 100%)`
                    : undefined,
                  border: apiMenu?.cafe?.theme?.primaryColor
                    ? `1px solid ${apiMenu.cafe.theme.primaryColor}30`
                    : undefined,
                }}
              >
                <div class="cm-hero-banner-content">
                  <h2
                    class="cm-hero-banner-title"
                    style={{
                      fontFamily: apiMenu?.cafe?.theme?.fontFamily === 'Playfair Display' ? '"Playfair Display", Georgia, serif' : undefined,
                    }}
                  >
                    {heroTitle}
                  </h2>
                  <p
                    class="cm-hero-banner-sub"
                    style={{
                      color: apiMenu?.cafe?.theme?.accentColor || 'rgba(255, 255, 255, 0.75)',
                    }}
                  >
                    {heroSub}
                  </p>
                </div>
                <div
                  class="cm-hero-banner-image"
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url('${heroImage}')`,
                  }}
                ></div>
              </div>

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
                  class={`cm-pill ${!activeCategory && !searchQuery ? 'is-active' : ''}`}
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
                    class={`cm-pill ${activeCategory?.id === cat.id ? 'is-active' : ''}`}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Popular Items Section Head */}
              <div class="cm-section-head">
                <h3 class="cm-section-title">
                  {searchQuery ? `Search Results (${displayedItems.length})` : 'Popular Items'}
                </h3>
                {!searchQuery && (
                  <span
                    class="cm-section-link"
                    onClick={() => handleSelectCategory(categories[0])}
                    role="button"
                    tabIndex={0}
                  >
                    See all &rarr;
                  </span>
                )}
              </div>

              {/* Dish List */}
              <div class="cm-dish-list">
                {displayedItems.length > 0 ? (
                  displayedItems.map((dish) => (
                    <DishListItem
                      key={dish.id}
                      dish={dish}
                      onSelect={(item) => setSelectedDish(item)}
                      currency={dish.currency || 'ETB'}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    No dishes found matching "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Bottom Navigation Bar */}
        <BottomNav
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
