/**
 * CafeMenu — Central Landing Page Client Script
 * Handles:
 *  1. Dynamic QR Code URL resolution pointing to the live Cafe route
 *  2. Mobile navigation drawer toggle & keyboard accessibility
 *  3. Prototype onboarding lead capture submission & feedback state
 *  4. Smooth scroll navigation offset
 *  5. Interactive demo category tabs & dish preview switcher
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initLandingPage);

  function initLandingPage() {
    setupDynamicQRCodes();
    setupMobileNav();
    setupLeadForm();
    setupSmoothScroll();
    setupDemoTabs();
  }

  /**
   * 1. Dynamic QR Code Setup
   * Automatically resolves the demo URL against the active window.location.origin,
   * avoiding hardcoded localhost domains across local testing, LAN access, and production.
   */
  function setupDynamicQRCodes() {
    try {
      var origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
      var demoUrl = origin + '/cafe';
      var qrSrc = '/qr.png?url=' + encodeURIComponent(demoUrl);

      var heroQr = document.getElementById('heroQrImg');
      if (heroQr) {
        heroQr.src = qrSrc;
      }

      var demoQr = document.getElementById('demoQrImg');
      if (demoQr) {
        demoQr.src = qrSrc;
      }
    } catch (err) {
      console.warn('QR code dynamic URL resolution error:', err);
    }
  }

  /**
   * 2. Mobile Navigation Drawer
   */
  function setupMobileNav() {
    var toggleBtn = document.getElementById('menuToggle');
    var drawer = document.getElementById('mobileDrawer');
    if (!toggleBtn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close when clicking any nav item in the drawer
    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
        toggleBtn.focus();
      }
    });

    // Close when clicking outside drawer
    document.addEventListener('click', function (e) {
      if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && e.target !== toggleBtn) {
        closeDrawer();
      }
    });
  }

  /**
   * 3. Prototype Lead Capture Form
   * Provides accessible inline error validation and privacy-aware prototype feedback.
   * Personal contact information is NOT retained in client storage or sent to external servers.
   */
  function setupLeadForm() {
    var form = document.getElementById('leadForm');
    var formContainer = document.getElementById('formContainer');
    var errorBanner = document.getElementById('formErrorBanner');
    var errorMessage = document.getElementById('formErrorMessage');
    var successBox = document.getElementById('leadSuccess');
    var successCafe = document.getElementById('leadSuccessCafe');
    var resetBtn = document.getElementById('resetFormBtn');

    if (!form || !formContainer || !successBox) return;

    var cafeNameInput = document.getElementById('cafeNameInput');
    var ownerNameInput = document.getElementById('ownerNameInput');
    var contactInput = document.getElementById('contactInput');

    function clearError() {
      if (errorBanner) errorBanner.setAttribute('hidden', '');
      if (errorMessage) errorMessage.textContent = '';
      [cafeNameInput, ownerNameInput, contactInput].forEach(function (input) {
        if (input) {
          input.classList.remove('is-invalid');
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-describedby');
        }
      });
    }

    function showError(inputEl, message) {
      clearError();
      if (errorMessage) errorMessage.textContent = message;
      if (errorBanner) errorBanner.removeAttribute('hidden');
      if (inputEl) {
        inputEl.classList.add('is-invalid');
        inputEl.setAttribute('aria-invalid', 'true');
        inputEl.setAttribute('aria-describedby', 'formErrorBanner');
        inputEl.focus();
      }
    }

    /**
     * Reasonable contact validation accepting either:
     * - Email: standard user@domain.tld format
     * - Phone: 7-15 digits with optional country code, spaces, dashes, or parentheses
     *   (fully supports standard Ethiopian mobile 09..., 07..., +251 9... and international formats)
     */
    function isValidContact(value) {
      if (!value) return false;
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (emailRegex.test(value)) return true;

      var phoneCharsRegex = /^[\d\s\+\-\(\)\.]+$/;
      var digitsOnly = value.replace(/\D/g, '');
      if (phoneCharsRegex.test(value) && digitsOnly.length >= 7 && digitsOnly.length <= 15) {
        return true;
      }
      return false;
    }

    // Clear error dynamically when user corrects inputs
    form.addEventListener('input', function () {
      if (errorBanner && !errorBanner.hasAttribute('hidden')) {
        clearError();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var cafeName = (cafeNameInput && cafeNameInput.value || '').trim();
      var ownerName = (ownerNameInput && ownerNameInput.value || '').trim();
      var contact = (contactInput && contactInput.value || '').trim();

      // 1. Required field checks
      if (!cafeName) {
        showError(cafeNameInput, 'Please enter your cafe or restaurant name.');
        return;
      }
      if (!ownerName) {
        showError(ownerNameInput, 'Please enter your name.');
        return;
      }
      if (!contact) {
        showError(contactInput, 'Please enter an email address or phone number.');
        return;
      }

      // 2. Format check for contact
      if (!isValidContact(contact)) {
        showError(
          contactInput,
          'Please enter a valid email address (e.g. sara@bluenile.com) or phone number (e.g. 0911234567 or +251 91 123 4567).'
        );
        return;
      }

      // 3. Clear errors and display honest prototype confirmation
      clearError();

      if (successCafe) {
        successCafe.textContent = cafeName;
      }

      formContainer.style.display = 'none';
      successBox.classList.add('is-active');
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        clearError();
        successBox.classList.remove('is-active');
        formContainer.style.display = '';
        if (cafeNameInput) cafeNameInput.focus();
      });
    }
  }

  /**
   * 4. Smooth Scrolling Offset for Sticky Header
   */
  function setupSmoothScroll() {
    var header = document.querySelector('.l-header');
    var headerHeight = header ? header.offsetHeight : 74;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          var elementPosition = targetElement.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 16);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL hash without jump
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      });
    });
  }

  /**
   * 5. Interactive Demo Category Switcher
   * Allows potential cafe owners to interactively test dishes right on the landing page.
   */
  function setupDemoTabs() {
    var tabs = document.querySelectorAll('.demo-tab');
    if (!tabs.length) return;

    var dishes = {
      specials: {
        img: '/images/dishes/special-beef-tibs.jpg',
        title: 'Special Sizzling Beef Tibs',
        price: '480 ETB',
        tag: 'Most Popular',
        desc: 'Tender prime beef cubes sautéed in spiced niter kibbeh with rosemary, jalapeños, and warm teff injera.',
        meta: '15 min • Sizzling Clay Skillet'
      },
      burgers: {
        img: '/images/dishes/crispy-chicken-burger.jpg',
        title: 'Crispy Artisan Chicken Burger',
        price: '360 ETB',
        tag: 'Chef Choice',
        desc: 'Golden fried chicken breast on toasted brioche with house-made cabbage slaw and signature garlic aioli.',
        meta: '12 min • Fresh Brioche'
      },
      coffee: {
        img: '/images/dishes/traditional-buna-ceremony.jpg',
        title: 'Traditional Buna Ceremony',
        price: '150 ETB',
        tag: 'Signature Roast',
        desc: 'Freshly roasted single-origin Ethiopian coffee beans served in a traditional clay jebena with sweet frankincense.',
        meta: '8 min • Three Rounds'
      },
      pizza: {
        img: '/images/dishes/margherita.jpg',
        title: 'Stone-Baked Margherita Pizza',
        price: '420 ETB',
        tag: 'Hand-Tossed',
        desc: 'Crushed San San Marzano tomatoes, fresh mozzarella pearls, cold-pressed olive oil, and sweet basil leaves.',
        meta: '14 min • 30cm Wood-Fired'
      }
    };

    var imgEl = document.getElementById('demoDishImg');
    var titleEl = document.getElementById('demoDishTitle');
    var priceEl = document.getElementById('demoDishPrice');
    var tagTextEl = document.getElementById('demoDishTagText');
    var descEl = document.getElementById('demoDishDesc');
    var metaEl = document.getElementById('demoDishMeta');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        var key = tab.getAttribute('data-demo-cat');
        var dish = dishes[key];
        if (!dish) return;

        var card = document.getElementById('demoActiveDishCard');
        if (card) {
          card.style.opacity = '0.35';
          card.style.transform = 'scale(0.98)';
          setTimeout(function () {
            if (imgEl) imgEl.src = dish.img;
            if (titleEl) titleEl.textContent = dish.title;
            if (priceEl) priceEl.textContent = dish.price;
            if (tagTextEl) {
              tagTextEl.textContent = dish.tag;
            } else {
              var fallbackTag = document.getElementById('demoDishTag');
              if (fallbackTag) fallbackTag.textContent = dish.tag;
            }
            if (descEl) descEl.textContent = dish.desc;
            if (metaEl) metaEl.textContent = dish.meta;
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 140);
        }
      });
    });
  }
})();
