import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import WelcomeCover from './WelcomeCover.jsx';
import MenuHeader from './MenuHeader.jsx';
import DishListItem from './DishListItem.jsx';
import DishDetailModal from './DishDetailModal.jsx';
import BottomNav from './BottomNav.jsx';
import ThankYouView from './ThankYouView.jsx';
import { SearchIcon, ArrowRightIcon } from '../common/Icons.jsx';
import { showcaseCategories } from './showcaseData.js';

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

  // Fetch API menu to keep synced with admin updates
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.categories && data.categories.length > 0) {
          setApiMenu(data);
        }
      })
      .catch(() => {});
  }, []);

  const cafeName = apiMenu?.cafe?.name || 'CafeMenu';

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Consolidate categories: showcaseCategories + any dynamic custom items from API
  const categories = useMemo(() => {
    return showcaseCategories;
  }, []);

  // Flatten all items for popular or search queries
  const allItems = useMemo(() => {
    const items = [];
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
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

  return (
    <div class="cm-app">
      <div class="cm-viewport">
        {/* 1. Welcome Splash / Cover Screen (dismissible) */}
        {showWelcome && (
          <WelcomeCover
            cafeName={cafeName}
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
                      currency={dish.currency || '$'}
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
              {/* Fresh Flavors Hero Banner Card */}
              <div class="cm-hero-banner">
                <div class="cm-hero-banner-content">
                  <h2 class="cm-hero-banner-title">Fresh Flavors Every Day</h2>
                  <p class="cm-hero-banner-sub">Quality ingredients, Great taste.</p>
                </div>
                <div class="cm-hero-banner-image" aria-hidden="true"></div>
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
                      currency={dish.currency || '$'}
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
            currency={selectedDish.currency || '$'}
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
