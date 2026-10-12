'use strict';

/**
 * Public Animated Digital QR Menu with Multi-Language Support (English / Amharic),
 * 4K Hero Showcase Food Video, Interactive Tray & Table Service.
 */
(function () {
  const LANG_KEY = 'cafe-menu-language';
  const SOUND_KEY = 'cafe-menu-sound-enabled';

  /* ----------------------------------------------------------- Translation Dictionary */
  const i18n = {
    en: {
      tagline: 'Artisan Bistro • Digital Menu',
      table: 'Table',
      searchPlaceholder: 'Search tibs, burgers, coffee, pizza…',
      langLabel: 'አማርኛ',
      heroEyebrow: '✨ LIVE DIGITAL MENU • TABLE ORDERING',
      heroTitle: 'Culinary Passion & Authentic Flavors',
      heroText: 'Handcrafted Habesha specialties, flame-grilled burgers, stone-baked pizzas & single-origin Ethiopian coffee.',
      heroLiveText: '4K LIVE SHOWCASE',
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
      trayTitle: 'Your Table Tray',
      viewOrder: 'View Order →',
      drawerTitle: 'Your Table Order',
      drawerTableSubtitle: '• Dine-In',
      trayEmptyMsg: 'Your order tray is empty. Tap the “+” button on any dish to add it!',
      notesLabel: 'Special instructions / allergies',
      notesPlaceholder: 'e.g. Extra awaze, no onions, less ice',
      estimatedTotal: 'Estimated Total:',
      sendWhatsApp: '📱 Send Order via WhatsApp',
      callWaiter: '🔔 Call Waiter / Bell',
      clearTray: 'Clear Tray',
      tableModalTitle: 'Select Your Table',
      tableModalText: 'Choose the table number you are seated at:',
      currentTableLabel: 'Current Table',
      confirmTable: 'Confirm Table',
      noDishesFound: 'No dishes found',
      noDishesHint: 'Try searching for burgers, pizza, or coffee.',
      orderToast: 'Added to tray',
      trayClearedToast: 'Tray cleared',
      waiterCalledToast: 'Waiter summoned to Table #',
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
      table: 'ጠረጴዛ',
      searchPlaceholder: 'ጥብስ፣ በርገር፣ ቡና፣ ፒዛ ይፈልጉ...',
      langLabel: 'English',
      heroEyebrow: '✨ የቀጥታ ዲጂታል ሜኑ • የጠረጴዛ ትዕዛዝ',
      heroTitle: 'ልዩ የጣዕም ምርጫዎች እና ባህላዊ ምግቦች',
      heroText: 'የተመረጡ የሀበሻ ባህላዊ ምግቦች፣ በእሳት የተጠበሱ በርገሮች፣ በምድጃ የተጋገረ ፒዛ እና ትኩስ የኢትዮጵያ ቡና።',
      heroLiveText: '4K የቀጥታ እይታ',
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
      trayTitle: 'የትዕዛዝ ቅርጫት',
      viewOrder: 'ትዕዛዝ ይመልከቱ →',
      drawerTitle: 'የጠረጴዛዎ ትዕዛዝ',
      drawerTableSubtitle: '• እዚህ የሚመገቡ',
      trayEmptyMsg: 'የትዕዛዝ ቅርጫትዎ ባዶ ነው። ማንኛውንም ምግብ ለመጨመር የ“+” ምልክቱን ይጫኑ!',
      notesLabel: 'ልዩ ማስታወሻ / አለርጂ',
      notesPlaceholder: 'ለምሳሌ፡ አዋዜ በብዛት፣ ሽንኩርት አይግባበት...',
      estimatedTotal: 'የተገመተው ጠቅላላ:',
      sendWhatsApp: '📱 ትዕዛዙን በዋትስአፕ ላክ',
      callWaiter: '🔔 አስተናጋጅ ጥራ',
      clearTray: 'ቅርጫቱን አጽዳ',
      tableModalTitle: 'ጠረጴዛዎን ይምረጡ',
      tableModalText: 'የተቀመጡበትን የጠረጴዛ ቁጥር ይምረጡ:',
      currentTableLabel: 'አሁን የተቀመጡበት ጠረጴዛ',
      confirmTable: 'ጠረጴዛ አረጋግጥ',
      noDishesFound: 'ምንም ምግብ አልተገኘም',
      noDishesHint: 'እባክዎ እንደ ጥብስ፣ በርገር፣ ቡና ብለው ይፈልጉ።',
      orderToast: 'ወደ ትዕዛዝ ቅርጫት ተጨምሯል',
      trayClearedToast: 'የትዕዛዝ ቅርጫቱ ጸድቷል',
      waiterCalledToast: 'አስተናጋጅ ተጠርቷል ለጠረጴዛ #',
      wifiCopiedToast: 'የዋይፋይ ይለፍ ቃል ተቀድቷል!',
      langSwitchedToast: 'ቋንቋ ወደ አማርኛ ተቀይሯል',
      footerNote: 'ይቃኙ፣ ይዘዙ እና ይደሰቱ። ለጠረጴዛዎ ትኩስ ሆኖ የተዘጋጀ።',
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
    'cold-brew-reserve': {
      name: 'ኮልድ ብሩው ቡና',
      desc: 'ለ18 ሰዓታት በቀዝቃዛ ውሃ የተነከረ ለስላሳ እና ጣፋጭ ቡና።',
    },
    'sunrise-breakfast-skillet': {
      name: 'የማለዳ የቁርስ ቅንብር',
      desc: 'በሸክላ ድስት የተጠበሰ እንቁላል፣ ቋሊማ፣ ድንች እና ቶስት።',
    },
    'brioche-french-toast': {
      name: 'ብሪዮሽ ፍሬንች ቶስት',
      desc: 'በእንቁላል የተጠበሰ ወርቃማ ብሪዮሽ ዳቦ ከሜፕል ሲረፕ እና ከቤሪ ጋር።',
    },
    'avocado-poached-eggs': {
      name: 'አቮካዶ እና እንቁላል ቁርስ',
      desc: 'በአርቲሳን ዳቦ ላይ የተፈጨ አቮካዶ እና የተቀቀለ እንቁላል።',
    },
    'fluffy-pancake-stack': {
      name: 'ፓንኬክ ከማር ጋር',
      desc: 'ለስላሳ ፓንኬኮች ከቅቤ፣ ከንብ ማር እና ከትኩስ ፍራፍሬዎች ጋር።',
    },
    'belgian-dark-chocolate-cake': {
      name: 'ቤልጂየም ቸኮሌት ኬክ',
      desc: 'ባለ ብዙ ሽፋን ጥቁር ቸኮሌት ኬክ ከቸኮሌት ጋናሽ ጋር።',
    },
    'madagascar-vanilla-cheesecake': {
      name: 'ቫኒላ ቺዝኬክ',
      desc: 'ክሬሚ ቺዝኬክ ከማዳጋስካር ቫኒላ እና ከቤሪ ኮምፖት ጋር።',
    },
    'tiramisu-tradizionale': {
      name: 'ጣፋጭ ቲራሚሱ',
      desc: 'በቡና የተነከሩ ሌዲፊንገርስ ከማስካርፖኔ ክሬም እና ከኮኮዋ ጋር።',
    },
    'pistachio-croissant': {
      name: 'ፒስታቺዮ ክሮይሳንት',
      desc: 'በቅቤ የተጋገረ ክሮይሳንት በጣፋጭ ፒስታቺዮ ክሬም የተሞላ።',
    },
    'passionfruit-sparkler': {
      name: 'ፓሽንፍሩት ስፓርክለር',
      desc: 'ትኩስ ፓሽንፍሩት ከሶዳ እና ከአዝሙድ ቅጠል ጋር።',
    },
    'iced-matcha-latte': {
      name: 'ቀዝቃዛ ማቻ ላቴ',
      desc: 'የጃፓን አረንጓዴ ሻይ ከቀዝቃዛ ወተት እና ከማር ጋር።',
    },
    'fresh-berry-lemonade': {
      name: 'የቤሪ ሌሞኔድ',
      desc: 'የተጨመቀ ሎሚ ከትኩስ እንጆሪ እና ሰማያዊ ቤሪ ጋር።',
    },
    'mint-peach-iced-tea': {
      name: 'የአዝሙድ ፒች አይስ ቲ',
      desc: 'የተጠመቀ ጥቁር ሻይ ከፒች እና ከአዝሙድ ቅጠል ጋር።',
    },
  };

  /* Category Translations for Amharic */
  const categoryTranslations = {
    habesha: {
      name: 'የሀበሻ ባህላዊ ምግቦች',
      desc: 'የተመረጡ የኢትዮጵያ ባህላዊ ምግቦች፣ የሚንተከተኩ ጥብሶች ከጤፍ እንጀራ ጋር።',
      tag: 'በሸክላ ድስት የሚንተከተክ • እንጀራ',
    },
    burgers: {
      name: 'በርገሮች',
      desc: 'በእሳት የተጠበሱ ጭማቂ ድርብ በርገሮች በሞቀ ብሪዮሽ ዳቦ።',
      tag: 'በእሳት የተጠበሰ • ብሪዮሽ',
    },
    pizza: {
      name: 'ፒዛ',
      desc: 'በድንጋይ ምድጃ የተጋገረ ሞዛሬላ ፒዛ እና ትኩስ ቅመሞች።',
      tag: 'በድንጋይ ምድጃ • 30 ሳ.ሜ',
    },
    coffee: {
      name: 'ቡና እና ሙቅ መጠጦች',
      desc: 'የኢትዮጵያ ምርጥ ቡና በባህላዊ ጀበና እና እጣን ተዘጋጅቶ።',
      tag: 'የኢትዮጵያ ምርጥ • ትኩስ ቡና',
    },
    drinks: {
      name: 'ቀዝቃዛ መጠጦች',
      desc: 'ቀዝቃዛና መንፈስን የሚያድሱ የፍራፍሬ መጠጦች።',
      tag: 'ቀዝቃዛ • በበረዶ የቀረበ',
    },
    desserts: {
      name: 'ጣፋጮች',
      desc: 'በየቀኑ ትኩስ የተዘጋጁ ጣፋጭ ኬኮች እና ፔስትሪዎች።',
      tag: 'በየቀኑ ትኩስ የተጋገረ',
    },
    breakfast: {
      name: 'ቁርስ',
      desc: 'የተመጣጠኑ እና ኃይል ሰጪ የማለዳ ቁርሶች።',
      tag: 'የማለዳ ቁርስ',
    },
    pasta: {
      name: 'ፓስታ',
      desc: 'በጣፋጭ ሶስ እና በፓርሜሳን ቺዝ የተዘጋጀ ፓስታ።',
      tag: 'አርቲሳን ፓስታ',
    },
    salad: {
      name: 'ሰላጣ',
      desc: 'ትኩስ የአትክልት ሰላጣ በወይራ ዘይት።',
      tag: 'ትኩስ አትክልቶች',
    },
  };

  const state = {
    menu: null,
    query: '',
    activeCategory: 'all',
    dietaryFilter: 'all',
    table: new URLSearchParams(window.location.search).get('table') || '1',
    tray: {},
    sound: localStorage.getItem(SOUND_KEY) !== 'false',
    lang: localStorage.getItem(LANG_KEY) || 'en',
    heroVideoKey: 'habesha',
  };

  const els = {
    logo: document.getElementById('cafeLogo'),
    name: document.getElementById('cafeName'),
    tagline: document.getElementById('cafeTagline'),
    tablePill: document.getElementById('tablePill'),
    tablePillText: document.getElementById('tablePillText'),
    heroEyebrow: document.getElementById('heroEyebrow'),
    heroTitle: document.getElementById('heroTitle'),
    heroText: document.getElementById('heroText'),
    wifiCard: document.getElementById('wifiCard'),
    wifiLabel: document.getElementById('wifiLabel'),
    wifiSsid: document.getElementById('wifiSsid'),
    wifiPassLabel: document.getElementById('wifiPassLabel'),
    wifiPass: document.getElementById('wifiPass'),
    copyWifi: document.getElementById('copyWifi'),
    heroVideoCard: document.getElementById('heroVideoCard'),
    heroVideoStage: document.getElementById('heroVideoStage'),
    heroVideoSelector: document.getElementById('heroVideoSelector'),
    heroLiveText: document.getElementById('heroLiveText'),
    chips: document.getElementById('chips'),
    filtersRow: document.getElementById('filtersRow'),
    pillAll: document.getElementById('pillAll'),
    pillPopular: document.getElementById('pillPopular'),
    pillSpicy: document.getElementById('pillSpicy'),
    pillNew: document.getElementById('pillNew'),
    pillSignature: document.getElementById('pillSignature'),
    grid: document.getElementById('grid'),
    empty: document.getElementById('emptyState'),
    search: document.getElementById('search'),
    langBtn: document.getElementById('langBtn'),
    langLabel: document.getElementById('langLabel'),
    soundBtn: document.getElementById('soundBtn'),
    soundIcon: document.getElementById('soundIcon'),
    trayBar: document.getElementById('trayBar'),
    trayCount: document.getElementById('trayCount'),
    trayTotal: document.getElementById('trayTotal'),
    trayBarTitle: document.getElementById('trayBarTitle'),
    trayBarBtnText: document.getElementById('trayBarBtnText'),
    openTrayBtn: document.getElementById('openTrayBtn'),
    trayDrawerBackdrop: document.getElementById('trayDrawerBackdrop'),
    closeTrayBtn: document.getElementById('closeTrayBtn'),
    trayList: document.getElementById('trayList'),
    trayEmpty: document.getElementById('trayEmpty'),
    notesLabel: document.getElementById('notesLabel'),
    trayNotes: document.getElementById('trayNotes'),
    drawerTitle: document.getElementById('drawerTitle'),
    drawerTotal: document.getElementById('drawerTotal'),
    drawerTotalLabel: document.getElementById('drawerTotalLabel'),
    drawerTableLabel: document.getElementById('drawerTableLabel'),
    sendWhatsappBtn: document.getElementById('sendWhatsappBtn'),
    callWaiterBtn: document.getElementById('callWaiterBtn'),
    clearTrayBtn: document.getElementById('clearTrayBtn'),
    qrModal: document.getElementById('qrModal'),
    qrTitle: document.getElementById('qrTitle'),
    qrPrompt: document.getElementById('qrPrompt'),
    qrTableLabel: document.getElementById('qrTableLabel'),
    qrTableSelect: document.getElementById('qrTableSelect'),
    closeQr: document.getElementById('closeQr'),
    footerCafe: document.getElementById('footerCafe'),
    footerNote: document.getElementById('footerNote'),
    footerHours: document.getElementById('footerHours'),
    toast: document.getElementById('toast'),
  };

  /* ------------------------------------------------------------- Audio FX */
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
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
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch { /* Audio not allowed */ }
  }

  function playChime() {
    if (!state.sound) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [880, 1320, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.5);
      });
    } catch { /* Audio not allowed */ }
  }

  /* --------------------------------------------------------- Helper Functions */
  function t(key) {
    return (i18n[state.lang] && i18n[state.lang][key]) || (i18n.en && i18n.en[key]) || '';
  }

  function money(value, currency) {
    const amount = Number(value) || 0;
    const formatted = amount.toLocaleString(undefined, {
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return currency ? `${formatted} ${currency}` : formatted;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
  }

  let toastTimer;
  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.className = 'toast is-on is-good';
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.className = 'toast';
    }, 2800);
  }

  function badgeClass(badge) {
    const b = String(badge || '').toLowerCase();
    if (b.includes('spicy') || b.includes('hot')) return 'badge badge--spicy';
    if (b.includes('new')) return 'badge badge--new';
    if (b.includes('signature')) return 'badge badge--signature';
    if (b.includes('veg')) return 'badge badge--veg';
    return 'badge badge--popular';
  }

  function getBadgeLabel(badge) {
    if (!badge) return '';
    if (state.lang !== 'am') return badge;
    const b = badge.toLowerCase();
    if (b.includes('spicy') || b.includes('hot')) return t('badgeSpicy');
    if (b.includes('new')) return t('badgeNew');
    if (b.includes('signature')) return t('badgeSignature');
    if (b.includes('chef')) return t('badgeChef');
    if (b.includes('popular')) return t('badgePopular');
    return badge;
  }

  function getLocalizedCategory(category) {
    if (state.lang === 'am' && categoryTranslations[category.id]) {
      return {
        ...category,
        name: categoryTranslations[category.id].name,
        description: categoryTranslations[category.id].desc,
      };
    }
    return category;
  }

  function getCategoryBannerTag(categoryId) {
    if (state.lang === 'am' && categoryTranslations[categoryId]) {
      return categoryTranslations[categoryId].tag;
    }
    const tags = {
      habesha: 'Sizzling Clay Skillet • Injera',
      burgers: 'Flame-Grilled • Brioche',
      pizza: 'Stone-Baked • 30cm',
      coffee: 'Single Origin • Fresh Buna',
      drinks: 'Artisan Chilled • Iced',
      desserts: 'House Baked Daily',
      breakfast: 'Fresh Mornings',
      pasta: 'Handcrafted Pasta',
      fries: 'Crispy Golden',
      salad: 'Garden Fresh',
      sandwich: 'Toasted Artisan',
      tea: 'Steeped Herbal',
    };
    return tags[categoryId] || 'Chef Special';
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
          item.style.animationDelay = `${Math.min(index * 60, 600)}ms`;
        });
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.06 }
  );

  /* ------------------------------------------------------------ Rendering */
  function updateStaticLabels() {
    const cafeName = state.menu ? state.menu.cafe.name : 'Prism Cafe';
    document.title = `${cafeName} \u2014 ${state.lang === 'am' ? 'ዲጂታል ሜኑ' : 'Digital QR Menu'}`;

    if (els.langLabel) els.langLabel.textContent = t('langLabel');
    if (els.tagline) els.tagline.textContent = t('tagline');
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

    if (els.tablePillText) els.tablePillText.textContent = `${t('table')} #${state.table}`;
    if (els.drawerTableLabel) els.drawerTableLabel.textContent = `${t('table')} #${state.table} ${t('drawerTableSubtitle')}`;

    if (els.trayBarTitle) els.trayBarTitle.textContent = t('trayTitle');
    if (els.trayBarBtnText) els.trayBarBtnText.textContent = t('viewOrder');
    if (els.drawerTitle) els.drawerTitle.textContent = t('drawerTitle');
    if (els.trayEmpty) els.trayEmpty.textContent = t('trayEmptyMsg');
    if (els.notesLabel) els.notesLabel.textContent = t('notesLabel');
    if (els.trayNotes) els.trayNotes.placeholder = t('notesPlaceholder');
    if (els.drawerTotalLabel) els.drawerTotalLabel.textContent = t('estimatedTotal');
    if (els.sendWhatsappBtn) els.sendWhatsappBtn.textContent = t('sendWhatsApp');
    if (els.callWaiterBtn) els.callWaiterBtn.textContent = t('callWaiter');
    if (els.clearTrayBtn) els.clearTrayBtn.textContent = t('clearTray');

    if (els.qrTitle) els.qrTitle.textContent = t('tableModalTitle');
    if (els.qrPrompt) els.qrPrompt.textContent = t('tableModalText');
    if (els.qrTableLabel) els.qrTableLabel.textContent = t('currentTableLabel');
    if (els.closeQr) els.closeQr.textContent = t('confirmTable');

    if (els.footerNote) els.footerNote.textContent = t('footerNote');
    if (els.footerHours) els.footerHours.textContent = t('footerHours');
  }

  function renderHeader(menu) {
    const { cafe } = menu;
    if (els.logo) els.logo.textContent = cafe.logo || '\u2615';
    if (els.name) els.name.textContent = cafe.name;
    if (els.footerCafe) els.footerCafe.textContent = cafe.name;

    // WiFi info
    if (els.wifiCard) {
      if (cafe.wifi_ssid) {
        els.wifiCard.hidden = false;
        if (els.wifiSsid) els.wifiSsid.textContent = cafe.wifi_ssid;
        if (els.wifiPass) els.wifiPass.textContent = cafe.wifi_pass || 'No password';
      } else {
        els.wifiCard.hidden = true;
      }
    }

    updateStaticLabels();
    renderHeroVideo();
  }

  function renderChips(menu) {
    const total = menu.categories.reduce((sum, category) => sum + category.items.length, 0);
    const allLabel = t('allCategories');

    const chips = [
      `<button class="chip${state.activeCategory === 'all' ? ' is-active' : ''}" data-category="all" type="button">${escapeHtml(allLabel)}<span class="chip__count">${total}</span></button>`,
      ...menu.categories.map((rawCategory) => {
        const category = getLocalizedCategory(rawCategory);
        return (
          `<button class="chip${state.activeCategory === category.id ? ' is-active' : ''}" data-category="${escapeHtml(category.id)}" type="button">` +
          `${escapeHtml(category.name)}<span class="chip__count">${category.items.length}</span></button>`
        );
      }),
    ];
    els.chips.innerHTML = chips.join('');
  }

  function itemMarkup(rawItem, currency) {
    const item = getLocalizedItem(rawItem);
    const badgeText = getBadgeLabel(rawItem.badge);
    const badge = badgeText ? `<span class="${badgeClass(rawItem.badge)}">${escapeHtml(badgeText)}</span>` : '';
    const desc = item.description ? `<div class="item__desc">${escapeHtml(item.description)}</div>` : '';
    const prep = item.prepTime ? `<span style="font-size:0.75rem;color:var(--accent);margin-left:0.4rem">\u23F1 ${escapeHtml(item.prepTime)}</span>` : '';

    return `
      <li class="item" data-item-id="${escapeHtml(item.id)}">
        <div class="item__main" data-add="${escapeHtml(item.id)}" title="Add to table order">
          <div class="item__top">
            <span class="item__name">${escapeHtml(item.name)}${badge}${prep}</span>
            <span class="item__leader"></span>
            <span class="item__price">${escapeHtml(money(item.price, currency))}</span>
          </div>
          ${desc}
        </div>
        <button class="item__add-btn" data-add="${escapeHtml(item.id)}" type="button" title="Add to table tray" aria-label="Add ${escapeHtml(item.name)}">+</button>
      </li>`;
  }

  function cardMarkup(rawCategory, currency) {
    const category = getLocalizedCategory(rawCategory);
    const items = category.items.map((item) => itemMarkup(item, currency)).join('');
    const note = category.description ? `<p class="card__note">${escapeHtml(category.description)}</p>` : '';
    const tag = getCategoryBannerTag(category.id);
    const dishesWord = t('dishesCount');

    return `
      <article class="card card--${escapeHtml(category.id)}" id="cat-${escapeHtml(category.id)}" data-category="${escapeHtml(category.id)}">
        <div class="card__art" data-art-bounce="${escapeHtml(category.id)}" title="Tap for live animation & sound!">
          <span class="card__tag-pill">${escapeHtml(tag)}</span>
          ${window.renderCategoryIcon ? window.renderCategoryIcon(category.icon || category.id) : ''}
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
      .filter((category) => !query && filter === 'all' || category.items.length > 0 || (query && category.name.toLowerCase().includes(query)));
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
      card.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
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

  /* ---------------------------------------------------------- Order Tray */
  function findItemById(itemId) {
    for (const cat of state.menu.categories) {
      const it = cat.items.find((entry) => entry.id === itemId);
      if (it) return it;
    }
    return null;
  }

  function addToTray(itemId) {
    playPop();
    const item = findItemById(itemId);
    if (!item) return;

    if (!state.tray[itemId]) {
      state.tray[itemId] = { item, qty: 1 };
    } else {
      state.tray[itemId].qty += 1;
    }
    updateTrayUI();
    const loc = getLocalizedItem(item);
    showToast(`${loc.name} ${t('orderToast')}`);
  }

  function updateQty(itemId, delta) {
    playPop();
    if (!state.tray[itemId]) return;
    state.tray[itemId].qty += delta;
    if (state.tray[itemId].qty <= 0) {
      delete state.tray[itemId];
    }
    updateTrayUI();
  }

  function updateTrayUI() {
    const entries = Object.values(state.tray);
    const count = entries.reduce((sum, e) => sum + e.qty, 0);
    const currency = state.menu ? state.menu.cafe.currency : 'ETB';
    const total = entries.reduce((sum, e) => sum + e.qty * (Number(e.item.price) || 0), 0);

    els.trayCount.textContent = count;
    els.trayTotal.textContent = money(total, currency);
    els.drawerTotal.textContent = money(total, currency);

    els.trayBar.classList.toggle('is-visible', count > 0);

    if (count === 0) {
      els.trayList.innerHTML = '';
      els.trayEmpty.hidden = false;
      return;
    }

    els.trayEmpty.hidden = true;
    els.trayList.innerHTML = entries
      .map(({ item, qty }) => {
        const loc = getLocalizedItem(item);
        const subtotal = money((Number(item.price) || 0) * qty, currency);
        return `
          <li class="tray-row">
            <div>
              <div class="tray-row__name">${escapeHtml(loc.name)}</div>
              <div class="tray-row__price">${escapeHtml(subtotal)}</div>
            </div>
            <div class="tray-row__controls">
              <button class="tray-row__btn" data-qty-change="${escapeHtml(item.id)}" data-delta="-1" type="button" aria-label="Decrease">&minus;</button>
              <span class="tray-row__qty">${qty}</span>
              <button class="tray-row__btn" data-qty-change="${escapeHtml(item.id)}" data-delta="1" type="button" aria-label="Increase">+</button>
            </div>
          </li>`;
      })
      .join('');
  }

  function openTrayDrawer() {
    playChime();
    els.trayDrawerBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeTrayDrawer() {
    els.trayDrawerBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function sendWhatsAppOrder() {
    const entries = Object.values(state.tray);
    if (!entries.length) {
      showToast(t('trayEmptyMsg'));
      return;
    }
    const currency = state.menu ? state.menu.cafe.currency : 'ETB';
    const total = entries.reduce((sum, e) => sum + e.qty * (Number(e.item.price) || 0), 0);
    const notes = els.trayNotes ? els.trayNotes.value.trim() : '';
    const phone = state.menu.cafe.phone || '+251 91 123 4567';

    const lines = [
      `*${state.menu.cafe.name} — Table Order*`,
      `Table: #${state.table}`,
      '--------------------------',
      ...entries.map(({ item, qty }) => {
        const loc = getLocalizedItem(item);
        return `• ${loc.name} x ${qty} = ${money((Number(item.price) || 0) * qty, currency)}`;
      }),
      '--------------------------',
      `*Total: ${money(total, currency)}*`,
    ];

    if (notes) {
      lines.push(`Notes: ${notes}`);
    }

    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const url = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function callWaiter() {
    playChime();
    showToast(`${t('waiterCalledToast')}${state.table}`);
    closeTrayDrawer();
  }

  function openQrModal() {
    playChime();
    if (els.qrTableSelect) els.qrTableSelect.value = state.table;
    els.qrModal.classList.add('is-open');
  }

  function closeQrModal() {
    els.qrModal.classList.remove('is-open');
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
          renderChips(state.menu);
          renderBoard();
          updateTrayUI();
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

    // Table Pill click
    els.tablePill.addEventListener('click', () => {
      if (els.qrTableSelect) els.qrTableSelect.value = state.table;
      openQrModal();
    });

    // Add to tray clicks inside grid (delegated)
    els.grid.addEventListener('click', (event) => {
      const addBtn = event.target.closest('[data-add]');
      if (addBtn) {
        addToTray(addBtn.dataset.add);
        return;
      }
      const bounceArt = event.target.closest('[data-art-bounce]');
      if (bounceArt) {
        playPop();
        const svg = bounceArt.querySelector('svg');
        if (svg) {
          svg.style.transition = 'transform 0.15s cubic-bezier(0.2, 1.8, 0.5, 1)';
          svg.style.transform = 'scale(1.22) rotate(-5deg)';
          setTimeout(() => {
            svg.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            svg.style.transform = '';
          }, 240);
        }
      }
    });

    // Hero video stage click bounce
    if (els.heroVideoStage) {
      els.heroVideoStage.addEventListener('click', () => {
        playPop();
        const svg = els.heroVideoStage.querySelector('svg');
        if (svg) {
          svg.style.transition = 'transform 0.15s cubic-bezier(0.2, 1.8, 0.5, 1)';
          svg.style.transform = 'scale(1.18) rotate(-4deg)';
          setTimeout(() => {
            svg.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            svg.style.transform = '';
          }, 240);
        }
      });
    }

    // Tray interactions
    els.openTrayBtn.addEventListener('click', openTrayDrawer);
    els.closeTrayBtn.addEventListener('click', closeTrayDrawer);
    els.trayDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === els.trayDrawerBackdrop) closeTrayDrawer();
    });

    els.trayList.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-qty-change]');
      if (!btn) return;
      updateQty(btn.dataset.qtyChange, Number(btn.dataset.delta) || 0);
    });

    els.sendWhatsappBtn.addEventListener('click', sendWhatsAppOrder);
    els.callWaiterBtn.addEventListener('click', callWaiter);
    els.clearTrayBtn.addEventListener('click', () => {
      state.tray = {};
      updateTrayUI();
      closeTrayDrawer();
      showToast(t('trayClearedToast'));
    });

    // QR / Table modal interactions
    if (els.closeQr) els.closeQr.addEventListener('click', closeQrModal);
    if (els.qrModal) {
      els.qrModal.addEventListener('click', (e) => {
        if (e.target === els.qrModal) closeQrModal();
      });
    }

    if (els.qrTableSelect) {
      els.qrTableSelect.addEventListener('change', () => {
        state.table = els.qrTableSelect.value;
        if (els.tablePillText) els.tablePillText.textContent = `${t('table')} #${state.table}`;
        if (els.drawerTableLabel) els.drawerTableLabel.textContent = `${t('table')} #${state.table} ${t('drawerTableSubtitle')}`;
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeQrModal();
        closeTrayDrawer();
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
      updateTrayUI();
    } catch (error) {
      els.grid.innerHTML =
        `<div class="empty"><strong>Menu could not be loaded</strong>` +
        `${escapeHtml(error.message)}<br />Ensure server is running with <code>npm start</code>.</div>`;
      els.empty.hidden = true;
    }
  }

  boot();
})();
