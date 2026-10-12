'use strict';

/**
 * The default menu that is written to data/menu.json the first time the
 * server starts (and whenever the admin presses "Reset demo data").
 * Prices are plain numbers, the currency is defined in `cafe`.
 */
module.exports = {
  cafe: {
    name: 'Prism Cafe',
    tagline: 'Freshly brewed, freshly grilled',
    currency: 'ETB',
    footer: 'Scan, browse, enjoy. Ask our staff for today\u2019s special.',
    logo: '\u2615',
    phone: '+251 91 123 4567',
    wifi_ssid: 'Prism-Cafe-5G',
    wifi_pass: 'coffee123',
  },
  categories: [
    {
      id: 'burgers',
      name: 'Burgers',
      icon: 'burger',
      description: 'Hand-pressed patties, toasted brioche buns.',
      items: [
        {
          id: 'classic-beef-burger',
          name: 'Classic Beef Burger',
          description: 'Beef patty, cheddar, lettuce, tomato, house sauce.',
          price: 320,
          badge: 'Popular',
        },
        {
          id: 'double-cheese-burger',
          name: 'Double Cheese Burger',
          description: 'Two patties, double cheddar, caramelised onion.',
          price: 420,
        },
        {
          id: 'crispy-chicken-burger',
          name: 'Crispy Chicken Burger',
          description: 'Buttermilk fried chicken, slaw, honey mustard.',
          price: 350,
          badge: 'New',
        },
        {
          id: 'spicy-jalapeno-burger',
          name: 'Spicy Jalape\u00f1o Burger',
          description: 'Beef patty, jalape\u00f1os, pepper jack, chipotle mayo.',
          price: 370,
          badge: 'Spicy',
        },
        {
          id: 'mushroom-swiss-burger',
          name: 'Mushroom Swiss Burger',
          description: 'Saut\u00e9ed mushrooms, swiss cheese, garlic aioli.',
          price: 380,
        },
      ],
    },
    {
      id: 'pizza',
      name: 'Pizza',
      icon: 'pizza',
      description: 'Stone-baked, thin crust, 30 cm.',
      items: [
        {
          id: 'margherita',
          name: 'Margherita',
          description: 'Tomato, mozzarella, fresh basil.',
          price: 360,
          badge: 'Popular',
        },
        {
          id: 'pepperoni',
          name: 'Pepperoni',
          description: 'Pepperoni, mozzarella, oregano.',
          price: 420,
        },
        {
          id: 'four-cheese',
          name: 'Four Cheese',
          description: 'Mozzarella, gouda, parmesan, blue cheese.',
          price: 460,
        },
        {
          id: 'veggie-supreme',
          name: 'Veggie Supreme',
          description: 'Peppers, mushroom, olive, onion, sweetcorn.',
          price: 400,
        },
      ],
    },
    {
      id: 'coffee',
      name: 'Coffee',
      icon: 'coffee',
      description: 'Locally roasted single-origin beans.',
      items: [
        {
          id: 'espresso',
          name: 'Espresso',
          description: 'Double shot, rich and velvety.',
          price: 70,
        },
        {
          id: 'cappuccino',
          name: 'Cappuccino',
          description: 'Espresso, steamed milk, thick foam.',
          price: 120,
          badge: 'Popular',
        },
        {
          id: 'caramel-latte',
          name: 'Caramel Latte',
          description: 'Espresso, milk, caramel, whipped cream.',
          price: 150,
        },
        {
          id: 'macchiato',
          name: 'Macchiato',
          description: 'Espresso marked with a dash of foam.',
          price: 100,
        },
        {
          id: 'ethiopian-pour-over',
          name: 'Ethiopian Pour Over',
          description: 'Yirgacheffe beans, floral and citrusy.',
          price: 180,
          badge: 'Signature',
        },
      ],
    },
    {
      id: 'breakfast',
      name: 'Breakfast',
      icon: 'breakfast',
      description: 'Served every morning from 7:00 to 11:30.',
      items: [
        {
          id: 'full-breakfast',
          name: 'Full Breakfast',
          description: 'Eggs, sausage, beans, toast, grilled tomato.',
          price: 280,
        },
        {
          id: 'avocado-toast',
          name: 'Avocado Toast',
          description: 'Sourdough, smashed avocado, poached egg, chilli.',
          price: 240,
          badge: 'Popular',
        },
        {
          id: 'buttermilk-pancakes',
          name: 'Buttermilk Pancakes',
          description: 'Three stacks, maple syrup, butter, berries.',
          price: 220,
        },
        {
          id: 'shakshuka',
          name: 'Shakshuka',
          description: 'Eggs baked in spiced tomato with flatbread.',
          price: 260,
        },
      ],
    },
    {
      id: 'desserts',
      name: 'Desserts',
      icon: 'dessert',
      description: 'Baked in-house every day.',
      items: [
        {
          id: 'tiramisu',
          name: 'Tiramisu',
          description: 'Mascarpone, espresso-soaked ladyfingers, cocoa.',
          price: 190,
          badge: 'Popular',
        },
        {
          id: 'cheesecake',
          name: 'New York Cheesecake',
          description: 'Vanilla cheesecake with berry compote.',
          price: 180,
        },
        {
          id: 'chocolate-lava',
          name: 'Chocolate Lava Cake',
          description: 'Warm molten centre with vanilla ice cream.',
          price: 210,
        },
        {
          id: 'gelato',
          name: 'Gelato (2 scoops)',
          description: 'Ask for today\u2019s flavours.',
          price: 130,
        },
      ],
    },
    {
      id: 'drinks',
      name: 'Cold Drinks',
      icon: 'drinks',
      description: 'Refreshing, shaken and poured.',
      items: [
        {
          id: 'fresh-lemonade',
          name: 'Fresh Lemonade',
          description: 'Hand-pressed lemon, mint, ice.',
          price: 110,
          badge: 'Popular',
        },
        {
          id: 'mango-smoothie',
          name: 'Mango Smoothie',
          description: 'Ripe mango, yoghurt, honey.',
          price: 160,
        },
        {
          id: 'iced-tea',
          name: 'Iced Tea',
          description: 'Black tea, peach, lemon slice.',
          price: 100,
        },
        {
          id: 'sparkling-water',
          name: 'Sparkling Water',
          description: 'Chilled bottle, 500 ml.',
          price: 60,
        },
      ],
    },
  ],
};
