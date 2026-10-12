'use strict';

/**
 * Public Animated Digital QR Menu with Multi-Language Support (English / Amharic),
 * Real Looping Food Video Showcases, View-Only Mode & Interactive Dish Details Modal.
 */
(function () {
  const LANG_KEY = 'cafe-menu-language';
  const SOUND_KEY = 'cafe-menu-sound-enabled';

  /* ----------------------------------------------------------- Translation Dictionary */
  const i18n = {
    en: {
      tagline: 'Artisan Bistro • Digital Menu',
      menuViewBadge: 'Digital Menu • View Only',
      searchPlaceholder: 'Search tibs, burgers, coffee, pizza…',
      langLabel: 'አማርኛ',
      heroEyebrow: '✨ ARTISAN BISTRO • DIGITAL MENU',
      heroTitle: 'Culinary Passion & Authentic Flavors',
      heroText: 'Handcrafted Habesha specialties, flame-grilled burgers, stone-baked pizzas & single-origin Ethiopian coffee.',
      heroLiveText: 'FEATURED SPECIALTIES',
      wifiLabel: 'Free Guest WiFi:',
      wifiPassLabel: 'Password:',
      copyBtn: 'Copy',
      copiedText: 'Copied!',
      allCategories: 'All Categories',
      allDishes: 'All Dishes',
      filterPopular: '🔥 Popular',
      filterSpicy: '🌶️ Spicy',
      filterNew: '✨ New',
      filterSignature: '⭐ Signature',
      dishesCount: 'dishes',
      prepLabel: 'Prep Time:',
      dietLabel: 'Category Style:',
      backToMenu: 'Back to Menu',
      tapForDetails: 'Tap dish to view full details',
      freshMade: 'Freshly Prepared & Artisan',
      noDishesFound: 'No dishes found',
      noDishesHint: 'Try searching for burgers, pizza, or coffee.',
      wifiCopiedToast: 'WiFi password copied to clipboard!',
      langSwitchedToast: 'Language switched to English',
      footerNote: 'Scan, browse & enjoy. Prepared fresh for your table.',
      footerHours: 'Opening Hours: 7:00 AM – 11:00 PM • Service with Passion • Thank you for visiting!',
      badgePopular: 'Popular',
      badgeSpicy: 'Spicy',
      badgeSignature: 'Signature',
      badgeNew: 'New',
      badgeChef: 'Chef Special',
    },
    am: {
      tagline: 'ልዩ የካፌ እና ምግብ ዝግጅት • ዲጂታል ሜኑ',
      menuViewBadge: 'ዲጂታል ሜኑ • እይታ ብቻ',
      searchPlaceholder: 'ጥብስ፣ በርገር፣ ቡና፣ ፒዛ ይፈልጉ...',
      langLabel: 'English',
      heroEyebrow: '✨ ልዩ የካፌ እና ምግብ ዝግጅት • ዲጂታል ሜኑ',
      heroTitle: 'ልዩ የጣዕም ምርጫዎች እና ባህላዊ ምግቦች',
      heroText: 'የተመረጡ የሀበሻ ባህላዊ ምግቦች፣ በእሳት የተጠበሱ በርገሮች፣ በምድጃ የተጋገረ ፒዛ እና ትኩስ የኢትዮጵያ ቡና።',
      heroLiveText: 'የተመረጡ ልዩ ምግቦች',
      wifiLabel: 'የእንግዳ ዋይፋይ:',
      wifiPassLabel: 'የይለፍ ቃል:',
      copyBtn: 'ገልብጥ',
      copiedText: 'ተቀድቷል!',
      allCategories: 'ሁሉም ምግቦች',
      allDishes: 'ሁሉም',
      filterPopular: '🔥 ተወዳጅ',
      filterSpicy: '🌶️ የሚያቃጥል',
      filterNew: '✨ አዲስ',
      filterSignature: '⭐ የሼፍ ምርጥ',
      dishesCount: 'ምግቦች',
      prepLabel: 'የዝግጅት ጊዜ:',
      dietLabel: 'የምግብ ዘውግ:',
      backToMenu: 'ወደ ሜኑ ተመለስ',
      tapForDetails: 'ዝርዝሩን ለማየት ምግቡን ይንኩ',
      freshMade: 'ትኩስ ሆኖ የተዘጋጀ',
      noDishesFound: 'ምንም ምግብ አልተገኘም',
      noDishesHint: 'እባክዎ እንደ ጥብስ፣ በርገር፣ ቡና ብለው ይፈልጉ።',
      wifiCopiedToast: 'የዋይፋይ ይለፍ ቃል ተቀድቷል!',
      langSwitchedToast: 'ቋንቋ ወደ አማርኛ ተቀይሯል',
      footerNote: 'ይቃኙ፣ ይመልከቱ እና ይደሰቱ። ለጠረጴዛዎ ትኩስ ሆኖ የተዘጋጀ።',
      footerHours: 'የስራ ሰዓት: 1:00 ጥዋት – 5:00 ማታ • በፍቅር እናቀርባለን • ስለጎበኙን እናመሰግናለን!',
      badgePopular: 'ተወዳጅ',
      badgeSpicy: 'የሚያቃጥል',
      badgeSignature: 'የሼፍ ምርጥ',
      badgeNew: 'አዲስ',
      badgeChef: 'ልዩ ምርጫ',
    },
  };

  /* Dish Translations for Amharic */
  const itemTranslations = {
    'special-beef-tibs': {
      name: 'ልዩ የሸክላ የበሬ ጥብስ',
      desc: 'ለስላሳ የበሬ ስጋ በቅቤ፣ ሮዝመሪ፣ ቃሪያ እና አዋዜ የተዘጋጀ ከጤፍ እንጀራ ጋር።',
    },
    'doro-wat-special': {
      name: 'ልዩ የዶሮ ወጥ',
      desc: 'በደከመ በርበሬ እና በተነጠረ ቅቤ የተቁላላ የዶሮ ስጋ ከእንቁላል እና ከአይብ ጋር።',
    },
    'beyeaynetu-fasting-platter': {
      name: 'የጾም በየአይነቱ',
      desc: 'ምስር ወጥ፣ ክክ አልጫ፣ ጎመን፣ ሽሮ፣ ፎሶሊያ እና ቀይ ስር በጤፍ እንጀራ።',
    },
    'special-kitfo': {
      name: 'ልዩ ክትፎ (በቅቤና ሚጥሚጣ)',
      desc: 'በደቀቀ የበሬ ስጋ በልዩ ቅቤ እና በሚጥሚጣ የተዘጋጀ ከአይብ እና ጎመን ጋር።',
    },
    'shiro-tegabino': {
      name: 'ሽሮ ተጋቢኖ (በሸክላ ድስት)',
      desc: 'በሸክላ ድስት የሚንተከተክ ጣፋጭ የሽሮ ወጥ ከትኩስ ቃሪያ ጋር።',
    },
    'quanta-firfir': {
      name: 'የቋንጣ ፍርፍር',
      desc: 'በቅመም በደረቀ የበሬ ስጋ እና በበርበሬ የተሰራ ጣፋጭ እንጀራ ፍርፍር።',
    },
    'traditional-buna-ceremony': {
      name: 'የባህል ቡና ቁርስ እና እጣን',
      desc: 'ትኩስ የተቆላና የተፈጨ የኢትዮጵያ ቡና በጀበና ከፖፕኮርንና ከእጣን ጋር።',
    },
    'chechebsa-kita-firfir': {
      name: 'ጨጨብሳ (ቂጣ ፍርፍር)',
      desc: 'በቅቤና በርበሬ የተለወሰ የቂጣ ቁርስ ከንብ ማር ጋር።',
    },
    'classic-smash-burger': {
      name: 'ክላሲክ ስማሽ በርገር',
      desc: 'ድርብ የበሬ ስጋ፣ የቀለጠ ቸዳር ቺዝ፣ ካራመላይዝድ ሽንኩርት እና ፒክልስ በብሪዮሽ ዳቦ።',
    },
    'truffle-mushroom-burger': {
      name: 'ትራፍል እንጉዳይ በርገር',
      desc: 'የተጠበሰ የበሬ ስጋ፣ የተጠበሰ እንጉዳይ፣ ስዊስ ቺዝ እና ትራፍል ማዮ።',
    },
    'double-bacon-cheeseburger': {
      name: 'ድርብ ቤከን ቺዝበርገር',
      desc: 'ድርብ የበሬ ስጋ ከቆንጆ ቤከን እና ከቀለጠ ቺዝ ጋር።',
    },
    'spicy-crispy-chicken-burger': {
      name: 'ስፓይሲ የተጠበሰ ዶሮ በርገር',
      desc: 'የተጠበሰ የዶሮ ስጋ ከስፓይሲ ማዮ እና ትኩስ ሰላጣ ጋር።',
    },
    'avocado-veggie-burger': {
      name: 'አቮካዶ ቬጂ በርገር',
      desc: 'በአትክልት የተሰራ በርገር ከትኩስ አቮካዶ እና ሰላጣ ጋር።',
    },
    'margherita-artisan-pizza': {
      name: 'ማርገሪታ ፒዛ',
      desc: 'የሳን ማርዛኖ ቲማቲም፣ ትኩስ ሞዛሬላ ቺዝ፣ በሶቢላ እና የወይራ ዘይት።',
    },
    'diavola-spicy-pepperoni': {
      name: 'ስፓይሲ ፔፐሮኒ ፒዛ',
      desc: 'የተመረጠ ስፓይሲ ፔፐሮኒ፣ ሞዛሬላ ቺዝ እና የቺሊ ፍሌክስ።',
    },
    'truffle-four-cheese': {
      name: 'አራት ቺዝ ፒዛ',
      desc: 'ሞዛሬላ፣ ጎርጎንዞላ፣ ፓርሜሳን እና ሪኮታ ቺዝ በትራፍል ዘይት።',
    },
    'smoked-bbq-chicken-pizza': {
      name: 'የባርቤኪው ዶሮ ፒዛ',
      desc: 'የተጠበሰ የዶሮ ስጋ በባርቤኪው ሶስ፣ ቀይ ሽንኩርት እና ሞዛሬላ።',
    },
    'ethiopian-espresso': {
      name: 'የኢትዮጵያ ኤስፕሬሶ',
      desc: 'የይርጋጨፌ ቡና በልዩ ክሬማ የተዘጋጀ ጠንካራ ኤስፕሬሶ።',
    },
    'velvet-cappuccino': {
      name: 'ቬልቬት ካፑቺኖ',
      desc: 'ኤስፕሬሶ በሞቀ እና ለስላሳ የወተት አረፋ የተዘጋጀ።',
    },
    'golden-honey-oat-latte': {
      name: 'የማር ኦት ላቴ',
      desc: 'ኤስፕሬሶ ከኦት ወተት እና ከንጹህ ንብ ማር ጋር።',
    },
    'iced-caramel-macchiato': {
      name: 'ቀዝቃዛ ካራሜል ማኪያቶ',
      desc: 'ቀዝቃዛ ወተት ከቫኒላ፣ ኤስፕሬሶ እና ከካራሜል ድሪዝል ጋር።',
    },
    'belgian-chocolate-lava': {
      name: 'ቤልጂየም ቸኮሌት ላቫ ኬክ',
      desc: 'ሞቅ ያለ የቸኮሌት ኬክ ከውስጡ ከሚቀልጥ ቸኮሌት እና ከቫኒላ አይስክሬም ጋር።',
    },
    'pistachio-san-sebastian': {
      name: 'ፒስታቺዮ ሳን ሴባስቲያን ቺዝኬክ',
      desc: 'ክሬሚ የሆነ ባስክ ቺዝኬክ በፒስታቺዮ ክሬም ድሪዝል የተዘጋጀ።',
    },
    'artisan-tiramisu': {
      name: 'ክላሲክ ቲራሚሱ',
      desc: 'በቡና የተነከረ የሌዲፊንገር ብስኩት በማስካርፖኔ ክሬም እና ኮኮዋ።',
    },
    'hibiscus-passion-refresher': {
      name: 'ከርከዴ እና ፓሽን ፍሩት ቀዝቃዛ ጭማቂ',
      desc: 'ትኩስ የከርከዴ ሻይ ከፓሽን ፍሩት፣ ሚንት እና ሎሚ ጋር።',
    },
    'green-detox-glow': {
      name: 'ግሪን ዲቶክስ ጁስ',
      desc: 'ትኩስ ዱባ፣ አረንጓዴ ፖም፣ ዝንጅብል፣ ስፒናች እና ሎሚ።',
    },
    'mango-avocado-smoothie': {
      name: 'የማንጎ እና አቮካዶ ስሙዚ',
      desc: 'ትኩስ ማንጎ እና አቮካዶ ከማር ጋር የተዘጋጀ ወፍራም ስሙዚ።',
    },
    'shakshuka-artisan': {
      name: 'ሻክሹካ ከእንቁላል ጋር',
      desc: 'በቲማቲም፣ ቃሪያ እና በቅመም ሶስ የተጋገረ እንቁላል ከቶስት ዳቦ ጋር።',
    },
    'avocado-sourdough-toast': {
      name: 'አቮካዶ ሳወርዶ ቶስት',
      desc: 'የተፈጨ አቮካዶ በሳወርዶ ዳቦ ላይ ከቼሪ ቲማቲም እና ቺሊ ጋር።',
    },
    'ful-medames-special': {
      name: 'ልዩ ፉል በቅቤ እና እንቁላል',
      desc: 'የተቀቀለ ባቄላ በቅመም፣ በተነጠረ ቅቤ፣ ቲማቲም፣ ቃሪያ እና እንቁላል።',
    },
  };

  /* Category Translations for Amharic */
  const categoryTranslations = {
    habesha: {
      name: 'የሀበሻ ልዩ ምግቦች',
      desc: 'የተመረጡ ባህላዊ ምግቦች፣ የሚንተከተኩ የሸክላ ጥብሶች እና የዶሮ ወጥ በጤፍ እንጀራ።',
    },
    burgers: {
      name: 'በእሳት የተጠበሱ በርገሮች',
      desc: 'ትኩስ የበሬ ስጋ በብሪዮሽ ዳቦ እና ልዩ የቤት ውስጥ ሶስ።',
    },
    pizza: {
      name: 'በምድጃ የተጋገረ ፒዛ',
      desc: 'በእጅ የተቦካ ሊጥ እና ጣፋጭ የጣሊያን ሞዛሬላ ቺዝ።',
    },
    coffee: {
      name: 'ልዩ የኢትዮጵያ ቡና',
      desc: 'ከይርጋጨፌ እና ከሲዳማ የተመረጡ የቡና ፍሬዎች ትኩስ ፈልተው የቀረቡ።',
    },
    desserts: {
      name: 'ጣፋጭ ምግቦች',
      desc: 'በየቀኑ በካፌው የሚጋገሩ ኬኮች እና የቸኮሌት ምርጫዎች።',
    },
    drinks: {
      name: 'ቀዝቃዛ መጠጦች እና ጁሶች',
      desc: 'ትኩስ የተጨመቁ የፍራፍሬ ጭማቂዎች፣ ስሙዚዎች እና አይስድ ቲ።',
    },
    breakfast: {
      name: 'የጥዋት ቁርስ',
      desc: 'ቀንዎን በደስታ የሚያስጀምሩ ትኩስ የቁርስ ምርጫዎች።',
    },
  };

  /* ----------------------------------------------------------------- State */
  const state = {
    menu: null,
    activeCategory: 'all',
    dietaryFilter: 'all',
    query: '',
    heroVideoKey: 'habesha',
    lang: localStorage.getItem(LANG_KEY) || 'en',
    sound: localStorage.getItem(SOUND_KEY) !== 'false',
    activeModalItem: null,
  };

  /* ------------------------------------------------------------- Audio FX */
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playPop() {
    if (!state.sound) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  function playChime() {
    if (!state.sound) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (_) {}
  }

  /* ---------------------------------------------------------- DOM Elements */
  const els = {
    cafeLogo: document.getElementById('cafeLogo'),
    cafeName: document.getElementById('cafeName'),
    cafeTagline: document.getElementById('cafeTagline'),
    menuViewBadgeText: document.getElementById('menuViewBadgeText'),
    search: document.getElementById('search'),
    langBtn: document.getElementById('langBtn'),
    langLabel: document.getElementById('langLabel'),
    soundBtn: document.getElementById('soundBtn'),
    soundIcon: document.getElementById('soundIcon'),
    heroEyebrow: document.getElementById('heroEyebrow'),
    heroTitle: document.getElementById('heroTitle'),
    heroText: document.getElementById('heroText'),
    heroLiveText: document.getElementById('heroLiveText'),
    heroVideoStage: document.getElementById('heroVideoStage'),
    heroVideoSelector: document.getElementById('heroVideoSelector'),
    wifiCard: document.getElementById('wifiCard'),
    wifiLabel: document.getElementById('wifiLabel'),
    wifiSsid: document.getElementById('wifiSsid'),
    wifiPassLabel: document.getElementById('wifiPassLabel'),
    wifiPass: document.getElementById('wifiPass'),
    copyWifi: document.getElementById('copyWifi'),
    chips: document.getElementById('chips'),
    filtersRow: document.getElementById('filtersRow'),
    pillAll: document.getElementById('pillAll'),
    pillPopular: document.getElementById('pillPopular'),
    pillSpicy: document.getElementById('pillSpicy'),
    pillNew: document.getElementById('pillNew'),
    pillSignature: document.getElementById('pillSignature'),
    grid: document.getElementById('grid'),
    empty: document.getElementById('emptyState'),
    footerCafe: document.getElementById('footerCafe'),
    footerNote: document.getElementById('footerNote'),
    footerHours: document.getElementById('footerHours'),
    toast: document.getElementById('toast'),
    // Dish Modal Elements
    dishModal: document.getElementById('dishModal'),
    closeDishModal: document.getElementById('closeDishModal'),
    modalDishVideoStage: document.getElementById('modalDishVideoStage'),
    modalDishCategory: document.getElementById('modalDishCategory'),
    modalDishName: document.getElementById('modalDishName'),
    modalDishPrice: document.getElementById('modalDishPrice'),
    modalDishBadges: document.getElementById('modalDishBadges'),
    modalDishDesc: document.getElementById('modalDishDesc'),
    modalDishPrepRow: document.getElementById('modalDishPrepRow'),
    modalDishPrep: document.getElementById('modalDishPrep'),
    modalDishDietRow: document.getElementById('modalDishDietRow'),
    modalDishDiet: document.getElementById('modalDishDiet'),
    modalPrepLabel: document.getElementById('modalPrepLabel'),
    modalDietLabel: document.getElementById('modalDietLabel'),
    modalDoneBtn: document.getElementById('modalDoneBtn'),
  };

  /* ------------------------------------------------------------- Helpers */
  function t(key) {
    const langDict = i18n[state.lang] || i18n.en;
    return langDict[key] || i18n.en[key] || '';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
  }

  function money(amount, currency) {
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return `${formatted} ${currency || 'ETB'}`;
  }

  let toastTimer;
  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('is-on');
    }, 2400);
  }

  function badgeClass(rawBadge) {
    const b = (rawBadge || '').toLowerCase();
    if (b.includes('popular')) return 'badge';
    if (b.includes('spicy') || b.includes('hot')) return 'badge badge--spicy';
    if (b.includes('new')) return 'badge badge--new';
    if (b.includes('signature') || b.includes('chef')) return 'badge badge--signature';
    if (b.includes('veg') || b.includes('fasting')) return 'badge badge--veg';
    return 'badge';
  }

  function getBadgeLabel(rawBadge) {
    if (!rawBadge) return '';
    const b = rawBadge.toLowerCase();
    if (b.includes('popular')) return t('badgePopular');
    if (b.includes('spicy') || b.includes('hot')) return t('badgeSpicy');
    if (b.includes('signature')) return t('badgeSignature');
    if (b.includes('chef')) return t('badgeChef');
    if (b.includes('new')) return t('badgeNew');
    return rawBadge;
  }

  function getLocalizedCategory(cat) {
    if (state.lang === 'am' && categoryTranslations[cat.id]) {
      return {
        ...cat,
        name: categoryTranslations[cat.id].name,
        description: categoryTranslations[cat.id].desc,
      };
    }
    return cat;
  }

  function getLocalizedItem(item) {
    if (state.lang === 'am' && itemTranslations[item.id]) {
      return {
        ...item,
        name: itemTranslations[item.id].name,
        description: itemTranslations[item.id].desc,
      };
    }
    return item;
  }

  function getCategoryBannerTag(categoryId) {
    if (state.lang === 'am') {
      const amTags = {
        habesha: 'የሸክላ ጥብስ • እንጀራ',
        burgers: 'በእሳት የተጠበሰ • ብሪዮሽ',
        pizza: 'በምድጃ የተጋገረ • 30 ሳ.ሜ',
        coffee: 'የይርጋጨፌ ቡና • ትኩስ',
        drinks: 'ቀዝቃዛ የተዘጋጀ • አይስድ',
        desserts: 'በየቀኑ የሚጋገር',
        breakfast: 'ትኩስ የጥዋት ቁርስ',
      };
      return amTags[categoryId] || 'ልዩ ዝግጅት';
    }
    const tags = {
      habesha: 'Sizzling Clay Skillet • Injera',
      burgers: 'Flame-Grilled • Brioche',
      pizza: 'Stone-Baked • 30cm',
      coffee: 'Single Origin • Fresh Buna',
      drinks: 'Artisan Chilled • Iced',
      desserts: 'House Baked Daily',
      breakfast: 'Fresh Mornings',
    };
    return tags[categoryId] || 'Chef Special';
  }

  /* --------------------------------------------------- Hero Food Video Showcase */
  function renderHeroVideo() {
    if (!els.heroVideoStage) return;
    const key = state.heroVideoKey || 'habesha';
    els.heroVideoStage.innerHTML = window.renderCategoryIcon ? window.renderCategoryIcon(key) : '';

    if (els.heroVideoSelector) {
      els.heroVideoSelector.querySelectorAll('.hero__selector-btn').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.heroVideo === key);
      });
    }
  }

  /* ------------------------------------------------------------- Observer */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('.item').forEach((item, index) => {
          item.style.animationDelay = `${Math.min(index * 50, 500)}ms`;
        });
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
  );

  /* ------------------------------------------------------------ Rendering */
  function updateStaticLabels() {
    const cafeName = state.menu ? state.menu.cafe.name : 'ABOLE Cafe';
    document.title = `${cafeName} \u2014 ${state.lang === 'am' ? 'ዲጂታል ሜኑ' : 'Digital QR Menu'}`;

    if (els.langLabel) els.langLabel.textContent = t('langLabel');
    if (els.cafeTagline) els.cafeTagline.textContent = t('tagline');
    if (els.menuViewBadgeText) els.menuViewBadgeText.textContent = t('menuViewBadge');
    if (els.search) els.search.placeholder = t('searchPlaceholder');
    if (els.heroEyebrow) els.heroEyebrow.textContent = t('heroEyebrow');
    if (els.heroTitle) els.heroTitle.textContent = t('heroTitle');
    if (els.heroText) els.heroText.textContent = t('heroText');
    if (els.heroLiveText) els.heroLiveText.textContent = t('heroLiveText');
    if (els.wifiLabel) els.wifiLabel.textContent = t('wifiLabel');
    if (els.wifiPassLabel) els.wifiPassLabel.textContent = t('wifiPassLabel');
    if (els.copyWifi) els.copyWifi.textContent = t('copyBtn');

    if (els.pillAll) els.pillAll.textContent = t('allDishes');
    if (els.pillPopular) els.pillPopular.textContent = t('filterPopular');
    if (els.pillSpicy) els.pillSpicy.textContent = t('filterSpicy');
    if (els.pillNew) els.pillNew.textContent = t('filterNew');
    if (els.pillSignature) els.pillSignature.textContent = t('filterSignature');

    if (els.modalPrepLabel) els.modalPrepLabel.textContent = t('prepLabel');
    if (els.modalDietLabel) els.modalDietLabel.textContent = t('dietLabel');
    if (els.modalDoneBtn) els.modalDoneBtn.textContent = t('backToMenu');

    if (els.footerNote) els.footerNote.textContent = t('footerNote');
    if (els.footerHours) els.footerHours.textContent = t('footerHours');
  }

  function renderHeader(menu) {
    if (!menu) return;
    const cafe = menu.cafe;
    els.cafeLogo.textContent = cafe.logo || '☕';
    els.cafeName.textContent = cafe.name || 'ABOLE Cafe';
    if (els.footerCafe) els.footerCafe.textContent = `${cafe.name || 'ABOLE Cafe'} & Bistro`;
    if (cafe.wifi_ssid) els.wifiSsid.textContent = cafe.wifi_ssid;
    if (cafe.wifi_pass) els.wifiPass.textContent = cafe.wifi_pass;
    updateStaticLabels();
    renderHeroVideo();
  }

  function renderChips(menu) {
    if (!menu || !menu.categories) return;
    const allLabel = t('allCategories');

    const chipsHtml = [
      `<button class="chip ${state.activeCategory === 'all' ? 'is-active' : ''}" data-category="all" type="button">` +
        `<span class="chip__icon">✨</span><span class="chip__label">${escapeHtml(allLabel)}</span></button>`,
    ];

    menu.categories.forEach((cat) => {
      const loc = getLocalizedCategory(cat);
      const iconEmoji =
        { habesha: '🔥', burgers: '🍔', pizza: '🍕', coffee: '☕', desserts: '🍫', drinks: '🍹', breakfast: '🍳' }[
          cat.id
        ] || '🍽️';

      chipsHtml.push(
        `<button class="chip ${state.activeCategory === cat.id ? 'is-active' : ''}" data-category="${escapeHtml(cat.id)}" type="button">` +
          `<span class="chip__icon">${iconEmoji}</span><span class="chip__label">${escapeHtml(loc.name)}</span></button>`
      );
    });

    els.chips.innerHTML = chipsHtml.join('');
  }

  function itemMarkup(rawItem, category, currency) {
    const item = getLocalizedItem(rawItem);
    const badgeText = getBadgeLabel(rawItem.badge);
    const badge = badgeText ? `<span class="${badgeClass(rawItem.badge)}">${escapeHtml(badgeText)}</span>` : '';
    const desc = item.description ? `<div class="item__desc">${escapeHtml(item.description)}</div>` : '';
    const prep = item.prepTime
      ? `<span class="item__prep" style="font-size:0.75rem;color:var(--accent);margin-left:0.4rem">\u23F1 ${escapeHtml(item.prepTime)}</span>`
      : '';

    return `
      <li class="item" data-item-id="${escapeHtml(item.id)}" data-cat-id="${escapeHtml(category.id)}" tabindex="0" role="button" title="${escapeHtml(t('tapForDetails'))}">
        <div class="item__main">
          <div class="item__top">
            <span class="item__name">${escapeHtml(item.name)}${badge}${prep}</span>
            <span class="item__leader"></span>
            <span class="item__price">${escapeHtml(money(item.price, currency))}</span>
          </div>
          ${desc}
        </div>
        <div class="item__arrow" aria-hidden="true">&rsaquo;</div>
      </li>`;
  }

  function cardMarkup(rawCategory, currency) {
    const category = getLocalizedCategory(rawCategory);
    const items = category.items.map((item) => itemMarkup(item, category, currency)).join('');
    const note = category.description ? `<p class="card__note">${escapeHtml(category.description)}</p>` : '';
    const tag = getCategoryBannerTag(category.id);
    const dishesWord = t('dishesCount');

    return `
      <article class="card card--${escapeHtml(category.id)}" id="cat-${escapeHtml(category.id)}" data-category="${escapeHtml(category.id)}">
        <div class="card__art" data-video-key="${escapeHtml(category.id)}">
          <span class="card__tag-pill">${escapeHtml(tag)}</span>
          ${window.renderCategoryIcon ? window.renderCategoryIcon(category.id || category.icon) : ''}
        </div>
        <div class="card__body">
          <div class="card__head">
            <div>
              <h2 class="card__title">${escapeHtml(category.name)}</h2>
              ${note}
            </div>
            <span class="card__count">${category.items.length} ${dishesWord}</span>
          </div>
          <ul class="items">${items}</ul>
        </div>
      </article>`;
  }

  function visibleCategories() {
    const query = state.query.trim().toLowerCase();
    const filter = state.dietaryFilter.toLowerCase();

    return state.menu.categories
      .filter((category) => state.activeCategory === 'all' || category.id === state.activeCategory)
      .map((category) => {
        let items = category.items;
        if (query) {
          items = items.filter((rawItem) => {
            const loc = getLocalizedItem(rawItem);
            return (
              `${rawItem.name} ${rawItem.description} ${rawItem.badge} ${loc.name} ${loc.description}`
                .toLowerCase()
                .includes(query)
            );
          });
        }
        if (filter !== 'all') {
          items = items.filter((item) => {
            const b = (item.badge || '').toLowerCase();
            const d = (item.description || '').toLowerCase();
            if (filter === 'popular') return b.includes('popular') || b.includes('signature');
            if (filter === 'spicy') return b.includes('spicy') || b.includes('hot') || d.includes('chilli');
            if (filter === 'new') return b.includes('new');
            if (filter === 'signature') return b.includes('signature') || b.includes('chef');
            return true;
          });
        }
        return { ...category, items };
      })
      .filter(
        (category) =>
          (!query && filter === 'all') ||
          category.items.length > 0 ||
          (query && category.name.toLowerCase().includes(query))
      );
  }

  function renderBoard() {
    const categories = visibleCategories();
    const currency = state.menu.cafe.currency;

    if (!categories.length) {
      els.grid.innerHTML = '';
      els.empty.hidden = false;
      els.empty.className = 'empty';
      els.empty.innerHTML = `<strong>${escapeHtml(t('noDishesFound'))}</strong>${escapeHtml(t('noDishesHint'))}`;
      return;
    }

    els.empty.hidden = true;
    els.grid.innerHTML = categories.map((category) => cardMarkup(category, currency)).join('');

    els.grid.querySelectorAll('.card').forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 60, 300)}ms`;
      card.classList.add('is-visible');
      revealObserver.observe(card);
    });

    applyActiveChip();
  }

  function applyActiveChip() {
    els.chips.querySelectorAll('.chip').forEach((chip) => {
      chip.classList.toggle('is-active', chip.dataset.category === state.activeCategory);
    });
  }

  /* ------------------------------------------------------ Dish Detail Modal */
  function findItemWithCategory(itemId) {
    if (!state.menu || !state.menu.categories) return null;
    for (const cat of state.menu.categories) {
      const it = cat.items.find((entry) => entry.id === itemId);
      if (it) return { item: it, category: cat };
    }
    return null;
  }

  function openDishModal(itemId) {
    playChime();
    const result = findItemWithCategory(itemId);
    if (!result) return;

    const { item, category } = result;
    const locItem = getLocalizedItem(item);
    const locCat = getLocalizedCategory(category);
    const currency = state.menu.cafe.currency || 'ETB';

    state.activeModalItem = item;

    // Set Video Stage for Dish
    if (els.modalDishVideoStage) {
      els.modalDishVideoStage.innerHTML = window.renderCategoryIcon
        ? window.renderCategoryIcon(category.id || category.icon)
        : '';
    }

    // Set Dish Details
    if (els.modalDishCategory) els.modalDishCategory.textContent = locCat.name;
    if (els.modalDishName) els.modalDishName.textContent = locItem.name;
    if (els.modalDishPrice) els.modalDishPrice.textContent = money(item.price, currency);
    if (els.modalDishDesc) els.modalDishDesc.textContent = locItem.description || '';

    // Badges
    if (els.modalDishBadges) {
      const badgeText = getBadgeLabel(item.badge);
      let badgesHtml = '';
      if (badgeText) {
        badgesHtml += `<span class="${badgeClass(item.badge)}">${escapeHtml(badgeText)}</span>`;
      }
      if (item.dietary) {
        badgesHtml += `<span class="badge badge--veg" style="margin-left:0.4rem">${escapeHtml(item.dietary)}</span>`;
      }
      els.modalDishBadges.innerHTML = badgesHtml;
    }

    // Prep time & Diet info
    if (els.modalDishPrep) {
      els.modalDishPrep.textContent = item.prepTime || (state.lang === 'am' ? '15 ደቂቃ' : '15 min');
    }
    if (els.modalDishDiet) {
      els.modalDishDiet.textContent = item.dietary || t('freshMade');
    }

    // Open Modal
    els.dishModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDishModal() {
    playPop();
    els.dishModal.classList.remove('is-open');
    document.body.style.overflow = '';
    state.activeModalItem = null;
  }

  /* ----------------------------------------------------------- Events */
  function bindEvents() {
    // Language Switcher
    if (els.langBtn) {
      els.langBtn.addEventListener('click', () => {
        playPop();
        state.lang = state.lang === 'en' ? 'am' : 'en';
        localStorage.setItem(LANG_KEY, state.lang);
        updateStaticLabels();
        if (state.menu) {
          renderHeader(state.menu);
          renderChips(state.menu);
          renderBoard();
        }
        if (state.activeModalItem) {
          openDishModal(state.activeModalItem.id);
        }
        showToast(t('langSwitchedToast'));
      });
    }

    // Hero video selector buttons
    if (els.heroVideoSelector) {
      els.heroVideoSelector.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-hero-video]');
        if (!btn) return;
        playPop();
        state.heroVideoKey = btn.dataset.heroVideo;
        renderHeroVideo();
      });
    }

    // Search input
    els.search.addEventListener('input', (event) => {
      state.query = event.target.value;
      renderBoard();
    });

    // Sound toggle
    els.soundBtn.addEventListener('click', () => {
      state.sound = !state.sound;
      localStorage.setItem(SOUND_KEY, state.sound ? 'true' : 'false');
      els.soundIcon.textContent = state.sound ? '\uD83D\uDD0A' : '\uD83D\uDD07';
      if (state.sound) playPop();
      showToast(state.sound ? 'Sound enabled' : 'Sound muted');
    });

    // Category chips
    els.chips.addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      playPop();
      state.activeCategory = chip.dataset.category;
      applyActiveChip();
      renderBoard();
    });

    // Secondary filters
    els.filtersRow.addEventListener('click', (event) => {
      const pill = event.target.closest('.filter-pill');
      if (!pill) return;
      playPop();
      els.filtersRow.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      state.dietaryFilter = pill.dataset.filter;
      renderBoard();
    });

    // Copy WiFi button
    els.copyWifi.addEventListener('click', () => {
      playPop();
      const pass = els.wifiPass.textContent;
      navigator.clipboard.writeText(pass).then(() => {
        showToast(t('wifiCopiedToast'));
      });
    });

    // Dish Click -> Open Dish Detail Modal
    els.grid.addEventListener('click', (event) => {
      const itemRow = event.target.closest('.item');
      if (itemRow && itemRow.dataset.itemId) {
        openDishModal(itemRow.dataset.itemId);
      }
    });

    // Keyboard navigation (Enter / Space on dish row)
    els.grid.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const itemRow = event.target.closest('.item');
        if (itemRow && itemRow.dataset.itemId) {
          event.preventDefault();
          openDishModal(itemRow.dataset.itemId);
        }
      }
    });

    // Dish Modal Close interactions
    if (els.closeDishModal) els.closeDishModal.addEventListener('click', closeDishModal);
    if (els.modalDoneBtn) els.modalDoneBtn.addEventListener('click', closeDishModal);
    if (els.dishModal) {
      els.dishModal.addEventListener('click', (e) => {
        if (e.target === els.dishModal) closeDishModal();
      });
    }

    // Keyboard ESC to close modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && els.dishModal.classList.contains('is-open')) {
        closeDishModal();
      }
    });
  }

  /* --------------------------------------------------------------- Boot */
  async function boot() {
    els.soundIcon.textContent = state.sound ? '\uD83D\uDD0A' : '\uD83D\uDD07';
    bindEvents();
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.menu = await response.json();
      renderHeader(state.menu);
      renderChips(state.menu);
      renderBoard();
    } catch (error) {
      els.grid.innerHTML =
        `<div class="empty"><strong>Menu could not be loaded</strong>` +
        `${escapeHtml(error.message)}<br />Ensure server is running with <code>npm start</code>.</div>`;
      els.empty.hidden = true;
    }
  }

  boot();
})();
