export const videoMap = {
  habesha: {
    src: '/images/habesha.jpg',
    type: 'image',
    alt: 'Habesha Specials - Authentic Ethiopian Platter with Teff Injera',
  },
  burger: {
    src: '/videos/burger.mp4',
    type: 'video',
    poster: '/videos/burger-poster.jpg',
  },
  burgers: {
    src: '/videos/burger.mp4',
    type: 'video',
    poster: '/videos/burger-poster.jpg',
  },
  pizza: {
    src: '/images/pizza.jpg',
    type: 'image',
    alt: 'Stone-baked artisan pizza with melting mozzarella cheese stretch',
  },
  coffee: {
    src: '/images/coffee.jpg',
    type: 'image',
    alt: 'Traditional Ethiopian Buna Coffee Ceremony',
  },
  dessert: {
    src: '/images/desserts.jpg',
    type: 'image',
    alt: 'Artisan Gourmet Desserts & Cakes',
  },
  desserts: {
    src: '/images/desserts.jpg',
    type: 'image',
    alt: 'Artisan Gourmet Desserts & Cakes',
  },
  drink: {
    src: '/images/drinks.jpg',
    type: 'image',
    alt: 'Refreshing Cold Drinks & Fresh Fruit Juices',
  },
  drinks: {
    src: '/images/drinks.jpg',
    type: 'image',
    alt: 'Refreshing Cold Drinks & Fresh Fruit Juices',
  },
  breakfast: {
    src: '/images/breakfast.jpg',
    type: 'image',
    alt: 'Fresh Morning Breakfast & Artisan Brunch',
  },
};

export const dishImageMap = {
  'special-beef-tibs': '/images/dishes/special-beef-tibs.jpg',
  'doro-wat-special': '/images/dishes/doro-wat-special.jpg',
  'beyeaynetu-fasting-platter': '/images/dishes/beyeaynetu-fasting-platter.jpg',
  'special-kitfo': '/images/dishes/special-kitfo.jpg',
  'shiro-tegabino': '/images/dishes/shiro-tegabino.jpg',
  'gomen-besiga': '/images/dishes/gomen-besiga.jpg',
  'dereq-tibs-crunch': '/images/dishes/dereq-tibs-crunch.jpg',
  'classic-smash-double': '/images/dishes/classic-smash-double.jpg',
  'crispy-chicken-burger': '/images/dishes/crispy-chicken-burger.jpg',
  'truffle-mushroom-swiss': '/images/dishes/truffle-mushroom-swiss.jpg',
  'spicy-jalapeno-volcano': '/images/dishes/spicy-jalapeno-volcano.jpg',
  'smoky-bbq-bacon-stack': '/images/dishes/smoky-bbq-bacon-stack.jpg',
  'habesha-spiced-tibs-burger': '/images/dishes/habesha-spiced-tibs-burger.jpg',
  'margherita': '/images/dishes/margherita.jpg',
  'pepperoni-diavola': '/images/dishes/pepperoni-diavola.jpg',
  'quattro-formaggi': '/images/dishes/quattro-formaggi.jpg',
  'bbq-chicken-supreme': '/images/dishes/bbq-chicken-supreme.jpg',
  'truffle-wild-mushroom': '/images/dishes/truffle-wild-mushroom.jpg',
  'traditional-buna-ceremony': '/images/dishes/traditional-buna-ceremony.jpg',
  'spanish-latte-dulce': '/images/dishes/spanish-latte-dulce.jpg',
  'pistachio-iced-latte': '/images/dishes/pistachio-iced-latte.jpg',
  'ethiopian-pour-over': '/images/dishes/ethiopian-pour-over.jpg',
  'caramel-macchiato-reserve': '/images/dishes/caramel-macchiato-reserve.jpg',
  'molten-lava-chocolate-cake': '/images/dishes/molten-lava-chocolate-cake.jpg',
  'classic-san-sebastian-cheesecake': '/images/dishes/classic-san-sebastian-cheesecake.jpg',
  'tiramisu-espresso-classico': '/images/dishes/tiramisu-espresso-classico.jpg',
  'warm-belgian-waffle-delight': '/images/dishes/warm-belgian-waffle-delight.jpg',
  'fresh-mango-passion-fruit-smoothie': '/images/dishes/fresh-mango-passion-fruit-smoothie.jpg',
  'iced-hibiscus-berry-refresher': '/images/dishes/iced-hibiscus-berry-refresher.jpg',
  'signature-mojito-sparkler': '/images/dishes/signature-mojito-sparkler.jpg',
  'fresh-avocado-special-spris': '/images/dishes/fresh-avocado-special-spris.jpg',
  'shakshuka-mediterranean-pan': '/images/dishes/shakshuka-mediterranean-pan.jpg',
  'avocado-artisan-toast': '/images/dishes/avocado-artisan-toast.jpg',
  'ful-mudammas-special': '/images/dishes/ful-mudammas-special.jpg',
  'fluffy-buttermilk-pancake-stack': '/images/dishes/fluffy-buttermilk-pancake-stack.jpg',
};

export function getDishMedia(item, category) {
  if (item && dishImageMap[item.id]) {
    return {
      type: 'image',
      src: dishImageMap[item.id],
    };
  }

  const catKey = category?.id || category?.icon;
  if (catKey && videoMap[catKey]) {
    return videoMap[catKey];
  }

  return {
    type: 'image',
    src: '/images/habesha.jpg',
  };
}
