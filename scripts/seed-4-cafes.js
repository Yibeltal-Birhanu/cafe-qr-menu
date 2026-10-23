'use strict';

require('dotenv').config();
const crypto = require('crypto');
const pool = require('../server/db/pool');
const { auth, createManagerUser, bootstrapSuperAdmin } = require('../server/auth');
const store = require('../server/store');
const seed = require('../server/seed');

const THE_FOUR_CAFES = [
  {
    slug: 'abol-cafe',
    name: 'Abol Cafe & Roasters',
    tagline: 'Authentic Ethiopian roast, smash burgers & fresh dining',
    currency: 'ETB',
    phone: '+251 91 123 4567',
    wifi_ssid: 'Abol-Guest',
    wifi_pass: 'coffee123',
    managerEmail: 'manager@cafe.com',
    managerName: 'Abol Cafe Manager',
    managerPassword: 'manager123!',
    theme: {
      preset: 'espresso',
      primaryColor: '#e6923c',
      accentColor: '#fbbf24',
      backgroundColor: '#0e0a07',
      backgroundMode: 'dark',
      surfaceColor: 'rgba(28, 20, 15, 0.85)',
      textColor: '#fff8f0',
      fontFamily: 'Plus Jakarta Sans',
    },
    useSeed: true,
  },
  {
    slug: 'sunset-bistro',
    name: 'Sunset Bistro & Grill',
    tagline: 'Wood-fired specialties, stone pizzas & coastal sunset dining',
    currency: 'ETB',
    phone: '+251 92 456 7890',
    wifi_ssid: 'Sunset-Bistro-WiFi',
    wifi_pass: 'sunset2026',
    managerEmail: 'manager@sunset.com',
    managerName: 'Sunset Bistro Manager',
    managerPassword: 'sunset123!',
    theme: {
      preset: 'terracotta',
      primaryColor: '#ea580c',
      accentColor: '#f59e0b',
      backgroundColor: '#140805',
      backgroundMode: 'dark',
      surfaceColor: 'rgba(38, 16, 11, 0.88)',
      textColor: '#fff7ed',
      fontFamily: 'Plus Jakarta Sans',
    },
    categories: [
      {
        id: 'wood-fired-pizzas',
        name: 'Wood-Fired Pizzas',
        icon: 'pizza',
        description: 'Crisp sourdough crust fermented for 48 hours and fired at 450°C.',
        items: [
          {
            id: 'margherita-di-bufala',
            name: 'Margherita di Bufala',
            description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil.',
            price: 360,
            badge: 'Popular',
            prepTime: '12 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408842/cafe-qr-menu/dishes/margherita-pizza.jpg',
          },
          {
            id: 'diavola-flame',
            name: 'Diavola Flame',
            description: 'Spicy artisanal salami, calabrian chili oil, fior di latte mozzarella, hot honey drizzle.',
            price: 420,
            badge: 'Spicy',
            prepTime: '14 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409080/cafe-qr-menu/dishes/pepperoni-pizza.jpg',
          },
          {
            id: 'truffle-wild-mushroom',
            name: 'Truffle & Wild Mushroom Pizza',
            description: 'Cremini and shiitake mushrooms, white truffle cream, fontina cheese, fresh thyme.',
            price: 460,
            badge: 'Chef Special',
            prepTime: '15 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409089/cafe-qr-menu/dishes/truffle-mushroom-pizza.jpg',
          },
        ],
      },
      {
        id: 'flame-grills',
        name: 'Flame Grills & Steaks',
        icon: 'habesha',
        description: 'Charcoal-grilled prime meats seared with rosemary garlic butter.',
        items: [
          {
            id: 'dry-aged-ribeye',
            name: 'Dry-Aged Ribeye Steak (350g)',
            description: 'Prime cut ribeye grilled medium-rare, served with roasted garlic baby potatoes and chimichurri.',
            price: 680,
            badge: 'Signature',
            prepTime: '20 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409085/cafe-qr-menu/dishes/special-beef-tibs.jpg',
          },
          {
            id: 'sunset-smash-burger',
            name: 'Sunset Double Smash Burger',
            description: 'Two dry-aged beef patties, smoked cheddar, crispy bacon, caramelized onion jam on toasted brioche.',
            price: 380,
            badge: 'Popular',
            prepTime: '12 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409067/cafe-qr-menu/dishes/double-cheese-burger.jpg',
          },
        ],
      },
      {
        id: 'sunset-cocktails',
        name: 'Craft Sunset Cocktails',
        icon: 'drinks',
        description: 'Shaken with premium spirits, fresh citrus and exotic botanical infusions.',
        items: [
          {
            id: 'smoked-old-fashioned',
            name: 'Smoked Oak Old Fashioned',
            description: 'Bourbon, aromatic bitters, orange oils, smoked applewood mist.',
            price: 240,
            badge: 'Signature',
            prepTime: '5 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409074/cafe-qr-menu/dishes/iced-tea.jpg',
          },
          {
            id: 'passionfruit-sunset-fizz',
            name: 'Passionfruit Sunset Fizz',
            description: 'Fresh passionfruit pulp, sparkling prosecco, mint syrup, crushed ice.',
            price: 210,
            badge: 'Refreshing',
            prepTime: '4 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409071/cafe-qr-menu/dishes/fresh-lemonade.jpg',
          },
        ],
      },
    ],
  },
  {
    slug: 'skyline-lounge',
    name: 'Skyline Lounge & Terrace',
    tagline: 'Panoramic rooftop views, craft coffee & gourmet dinners',
    currency: 'ETB',
    phone: '+251 93 789 0123',
    wifi_ssid: 'Skyline-Guest-5G',
    wifi_pass: 'skyline2026',
    managerEmail: 'manager@skyline.com',
    managerName: 'Skyline Lounge Manager',
    managerPassword: 'skyline123!',
    theme: {
      preset: 'emerald',
      primaryColor: '#10b981',
      accentColor: '#fbbf24',
      backgroundColor: '#061a14',
      backgroundMode: 'dark',
      surfaceColor: 'rgba(11, 41, 32, 0.88)',
      textColor: '#f0fdf4',
      fontFamily: 'Playfair Display',
    },
    categories: [
      {
        id: 'skyline-coffee',
        name: 'Artisan Coffee Roasts',
        icon: 'coffee',
        description: 'Single-estate specialty coffee sourced from Yirgacheffe and Sidama.',
        items: [
          {
            id: 'v60-pour-over',
            name: 'V60 Ethiopian Yirgacheffe Pour-Over',
            description: 'Floral jasmine notes, bright bergamot citrus, and velvety peach finish.',
            price: 180,
            badge: 'Award Winner',
            prepTime: '6 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409070/cafe-qr-menu/dishes/espresso.jpg',
          },
          {
            id: 'spanish-iced-latte',
            name: 'Skyline Spanish Iced Latte',
            description: 'Double espresso pulled over sweet condensed milk and cold whole milk with crushed ice.',
            price: 190,
            badge: 'Popular',
            prepTime: '4 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409075/cafe-qr-menu/dishes/iced-latte.jpg',
          },
          {
            id: 'caramel-macchiato-rooftop',
            name: 'Rooftop Caramel Macchiato',
            description: 'Steamed vanilla milk stained with espresso and drizzled with golden salted caramel.',
            price: 195,
            badge: 'Signature',
            prepTime: '5 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408832/cafe-qr-menu/dishes/cappuccino.jpg',
          },
        ],
      },
      {
        id: 'small-plates',
        name: 'Fine Dining Small Plates',
        icon: 'habesha',
        description: 'Sophisticated savory bites tailored for rooftop sharing.',
        items: [
          {
            id: 'truffle-sliders',
            name: 'Truffle Wagyu Sliders (3pcs)',
            description: 'Mini brioche buns, wagyu beef, black truffle aioli, melted gruyere.',
            price: 490,
            badge: 'Chef Pick',
            prepTime: '15 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409079/cafe-qr-menu/dishes/mushroom-swiss-burger.jpg',
          },
          {
            id: 'crispy-salmon-bites',
            name: 'Crispy Salmon Rice Bites',
            description: 'Pan-crisped sushi rice cakes topped with spicy salmon tartare, avocado and unagi glaze.',
            price: 450,
            badge: 'Popular',
            prepTime: '12 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408838/cafe-qr-menu/dishes/crispy-chicken-burger.jpg',
          },
        ],
      },
      {
        id: 'skyline-desserts',
        name: 'Gourmet Desserts',
        icon: 'dessert',
        description: 'Decadent sweets crafted fresh daily by our pastry team.',
        items: [
          {
            id: 'matcha-basque-cheesecake',
            name: 'Matcha Basque Burnt Cheesecake',
            description: 'Creamy ceremonial matcha center with caramelized exterior and berry compote.',
            price: 240,
            badge: 'Signature',
            prepTime: '5 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408834/cafe-qr-menu/dishes/cheesecake.jpg',
          },
          {
            id: 'classic-valrhona-tiramisu',
            name: 'Valrhona Cocoa Tiramisu',
            description: 'Single-origin espresso soaked savoiardi with light mascarpone cream and Valrhona cocoa.',
            price: 220,
            badge: 'Popular',
            prepTime: '5 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409088/cafe-qr-menu/dishes/tiramisu.jpg',
          },
        ],
      },
    ],
  },
  {
    slug: 'artisan-patisserie',
    name: 'Artisan Cafe & Patisserie',
    tagline: 'Handcrafted french viennoiserie, strawberry cream & gelato',
    currency: 'ETB',
    phone: '+251 94 901 2345',
    wifi_ssid: 'Artisan-Patisserie-Guest',
    wifi_pass: 'artisan2026',
    managerEmail: 'manager@artisan.com',
    managerName: 'Artisan Patisserie Manager',
    managerPassword: 'artisan123!',
    theme: {
      preset: 'pastel',
      primaryColor: '#ec4899',
      accentColor: '#10b981',
      backgroundColor: '#160d14',
      backgroundMode: 'dark',
      surfaceColor: 'rgba(42, 24, 38, 0.88)',
      textColor: '#fdf2f8',
      fontFamily: 'Plus Jakarta Sans',
    },
    categories: [
      {
        id: 'french-viennoiserie',
        name: 'French Viennoiserie',
        icon: 'breakfast',
        description: 'Baked fresh every morning at 6:00 AM with cultured french butter.',
        items: [
          {
            id: 'pure-butter-croissant',
            name: 'Traditional Butter Croissant',
            description: 'Flaky 27-layer laminated dough, golden crisp shell, honeycomb butter center.',
            price: 140,
            badge: 'Best Seller',
            prepTime: '3 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408840/cafe-qr-menu/dishes/french-croissant.jpg',
          },
          {
            id: 'pain-au-chocolat',
            name: 'Pain au Chocolat',
            description: 'Buttery laminated pastry filled with two batons of dark Belgian chocolate.',
            price: 160,
            badge: 'Popular',
            prepTime: '3 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408836/cafe-qr-menu/dishes/chocolate-lava.jpg',
          },
          {
            id: 'almond-cream-croissant',
            name: 'Twice-Baked Almond Croissant',
            description: 'Stuffed with almond frangipane cream, topped with toasted sliced almonds and powdered sugar.',
            price: 180,
            badge: 'Signature',
            prepTime: '3 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408840/cafe-qr-menu/dishes/french-croissant.jpg',
          },
        ],
      },
      {
        id: 'fine-patisserie',
        name: 'Patisserie & Tarts',
        icon: 'dessert',
        description: 'Exquisite modern tarts, entremets and individual dessert sculptures.',
        items: [
          {
            id: 'strawberry-rose-tart',
            name: 'Wild Strawberry & Rose Tart',
            description: 'Crisp sable breton base, Madagascar vanilla diplomate cream, fresh strawberries, rose glaze.',
            price: 260,
            badge: 'Signature',
            prepTime: '5 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408834/cafe-qr-menu/dishes/cheesecake.jpg',
          },
          {
            id: 'pistachio-paris-brest',
            name: 'Bronte Pistachio Paris-Brest',
            description: 'Choux pastry ring filled with roasted pistachio praline mousseline and crunchy pistachio nibs.',
            price: 280,
            badge: 'Chef Special',
            prepTime: '5 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409073/cafe-qr-menu/dishes/gelato.jpg',
          },
        ],
      },
      {
        id: 'specialty-beverages',
        name: 'Artisan Teas & Lattes',
        icon: 'drinks',
        description: 'Delicate loose-leaf teas, floral lattes and chilled botanicals.',
        items: [
          {
            id: 'rose-petal-latte',
            name: 'Rose Damascena Latte',
            description: 'Silky microfoam infused with organic rose water, beet extract, and espresso.',
            price: 190,
            badge: 'Popular',
            prepTime: '4 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792408832/cafe-qr-menu/dishes/cappuccino.jpg',
          },
          {
            id: 'ceremonial-matcha-latte',
            name: 'Uji Ceremonial Matcha Latte',
            description: 'First-harvest Uji matcha whisked with warm oat milk and touch of wildflower honey.',
            price: 210,
            badge: 'Organic',
            prepTime: '5 min',
            image: 'https://res.cloudinary.com/zsyultue/image/upload/v1792409076/cafe-qr-menu/dishes/mango-smoothie.jpg',
          },
        ],
      },
    ],
  },
];

async function seedPlatform() {
  console.log('--- Cleaning Up Dummy Test Cafes & Seeding Exactly 4 Production Cafes ---');

  // 1. Ensure Super Admin user exists
  await bootstrapSuperAdmin();

  // 2. Identify allowed cafe slugs & allowed emails
  const allowedSlugs = THE_FOUR_CAFES.map((c) => c.slug);
  const allowedEmails = [
    'superadmin@cafemenu.com',
    ...THE_FOUR_CAFES.map((c) => c.managerEmail),
  ];

  console.log(`Allowed Venues: ${allowedSlugs.join(', ')}`);

  // 3. Delete non-allowed cafes from DB
  const [existingCafes] = await pool.query('SELECT id, slug, name FROM cafes');
  for (const c of existingCafes) {
    if (!allowedSlugs.includes(c.slug)) {
      console.log(`Removing dummy cafe: ${c.name} (${c.slug})`);
      await pool.query('DELETE FROM items WHERE cafeId = ?', [c.id]);
      await pool.query('DELETE FROM categories WHERE cafeId = ?', [c.id]);
      await pool.query('DELETE FROM cafes WHERE id = ?', [c.id]);
    }
  }

  // 4. Delete non-allowed users from DB
  const [existingUsers] = await pool.query('SELECT id, email, role FROM user');
  for (const u of existingUsers) {
    if (!allowedEmails.includes(u.email)) {
      console.log(`Removing dummy user: ${u.email} (${u.role})`);
      await pool.query('DELETE FROM session WHERE userId = ?', [u.id]);
      await pool.query('DELETE FROM account WHERE userId = ?', [u.id]);
      await pool.query('DELETE FROM user WHERE id = ?', [u.id]);
    }
  }

  // 5. Seed / Update the 4 Curated Cafes
  for (const cafeConf of THE_FOUR_CAFES) {
    console.log(`\nSetting up ${cafeConf.name} (${cafeConf.slug})...`);

    // Provision or get manager user
    const manager = await createManagerUser({
      email: cafeConf.managerEmail,
      name: cafeConf.managerName,
      password: cafeConf.managerPassword,
    });
    console.log(`Manager ready: ${manager.email} (${manager.role})`);

    // Upsert Cafe
    const [found] = await pool.query('SELECT id FROM cafes WHERE slug = ?', [cafeConf.slug]);
    let cafeId = cafeConf.slug === 'abol-cafe' ? 'default-abol-cafe' : crypto.randomUUID();
    if (found.length > 0) {
      cafeId = found[0].id;
      await pool.query(
        `UPDATE cafes SET name = ?, tagline = ?, currency = ?, footer = ?, logo = ?, phone = ?, wifi_ssid = ?, wifi_pass = ?, status = 'active', owner_id = ?, theme = ?
         WHERE id = ?`,
        [
          cafeConf.name,
          cafeConf.tagline,
          cafeConf.currency,
          'Scan, browse, enjoy.',
          'coffee',
          cafeConf.phone,
          cafeConf.wifi_ssid,
          cafeConf.wifi_pass,
          manager.id,
          JSON.stringify(cafeConf.theme),
          cafeId,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO cafes (id, slug, name, tagline, currency, footer, logo, phone, wifi_ssid, wifi_pass, status, owner_id, theme)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
        [
          cafeId,
          cafeConf.slug,
          cafeConf.name,
          cafeConf.tagline,
          cafeConf.currency,
          'Scan, browse, enjoy.',
          'coffee',
          cafeConf.phone,
          cafeConf.wifi_ssid,
          cafeConf.wifi_pass,
          manager.id,
          JSON.stringify(cafeConf.theme),
        ]
      );
    }

    // Upsert Categories & Items
    const categoriesToSeed = cafeConf.useSeed ? seed.categories : cafeConf.categories || [];

    // Clear existing categories for this cafe to ensure pristine catalog
    await pool.query('DELETE FROM items WHERE cafeId = ?', [cafeId]);
    await pool.query('DELETE FROM categories WHERE cafeId = ?', [cafeId]);

    for (let cIdx = 0; cIdx < categoriesToSeed.length; cIdx++) {
      const cat = categoriesToSeed[cIdx];
      await pool.query(
        `INSERT INTO categories (id, cafeId, name, icon, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cat.id, cafeId, cat.name, cat.icon || 'coffee', cat.description || '', cIdx]
      );

      for (let iIdx = 0; iIdx < (cat.items || []).length; iIdx++) {
        const item = cat.items[iIdx];
        await pool.query(
          `INSERT INTO items (id, cafeId, categoryId, name, description, image, price, badge, prepTime, dietary, available, sortOrder)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            cafeId,
            cat.id,
            item.name,
            item.description || '',
            item.image || '',
            Number(item.price) || 0,
            item.badge || '',
            item.prepTime || '',
            item.dietary || '',
            item.available !== undefined ? Boolean(item.available) : true,
            iIdx,
          ]
        );
      }
    }

    console.log(`Seeded ${categoriesToSeed.length} categories with items for ${cafeConf.name}.`);
  }

  // 6. Reload store in memory
  await store.load('abol-cafe');

  console.log('\n✅ Successfully cleaned up all dummy cafes and configured exactly 4 production cafes!');
  process.exit(0);
}

seedPlatform().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
