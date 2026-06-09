/** 
 * Menu items with real photographic images from Unsplash
 * Images are sourced from Unsplash's free image library
 */

export const CATEGORIES = [
  { 
    id: "All", 
    label: "All Menu", 
    icon: "✨", 
    tagline: "Explore everything", 
    banner: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "Coffee", 
    label: "Coffee", 
    icon: "☕", 
    tagline: "Freshly brewed classics", 
    banner: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "Drinks", 
    label: "Drinks", 
    icon: "🥤", 
    tagline: "Tea, smoothies & more", 
    banner: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "Food", 
    label: "Food", 
    icon: "🍽️", 
    tagline: "Sandwiches & brunch", 
    banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    id: "Sweet Treats", 
    label: "Sweet Treats", 
    icon: "🍰", 
    tagline: "Pastries & desserts", 
    banner: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80" 
  }
];

export const DASHBOARD_BG = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80";

export const MENU_ITEMS = [
  // Coffee items
  { 
    _id: "c1", 
    name: "Espresso", 
    description: "Bold single shot with rich crema", 
    price: 120, 
    category: "Coffee", 
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "c2", 
    name: "Cappuccino", 
    description: "Espresso topped with velvety milk foam", 
    price: 150, 
    category: "Coffee", 
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "c3", 
    name: "Café Latte", 
    description: "Smooth espresso with steamed milk", 
    price: 160, 
    category: "Coffee", 
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "c5", 
    name: "Mocha", 
    description: "Chocolate and espresso in harmony", 
    price: 170, 
    category: "Coffee", 
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=400&h=300&q=80" 
  },

  // Drinks items
  { 
    _id: "d1", 
    name: "English Breakfast Tea", 
    description: "Classic strong black tea with milk", 
    price: 90, 
    category: "Drinks", 
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "d3", 
    name: "Iced Latte", 
    description: "Chilled espresso with cold milk over ice", 
    price: 165, 
    category: "Drinks", 
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "d5", 
    name: "Strawberry Smoothie", 
    description: "Fresh strawberries blended with yogurt", 
    price: 150, 
    category: "Drinks", 
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "d6", 
    name: "Cold Brew Coffee", 
    description: "Slow-steeped, smooth and low-acid coffee", 
    price: 155, 
    category: "Drinks", 
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&h=300&q=80" 
  },

  // Food items - Replaced Veg Club Sandwich with Bruschetta
  { 
    _id: "f1", 
    name: "Bruschetta", 
    description: "Toasted bread with tomatoes, basil and olive oil", 
    price: 120, 
    category: "Food", 
    image: "https://images.unsplash.com/photo-1572695157369-1f5ebdb4ab83?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "f2", 
    name: "Grilled Cheese", 
    description: "Aged cheddar on toasted sourdough", 
    price: 130, 
    category: "Food", 
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "f4", 
    name: "Avocado Toast", 
    description: "Smashed avocado, chili flakes, sourdough", 
    price: 180, 
    category: "Food", 
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "f6", 
    name: "Eggs Benedict", 
    description: "Poached eggs and hollandaise on muffin", 
    price: 210, 
    category: "Food", 
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=400&h=300&q=80" 
  },

  // Sweet Treats items - Replaced Cheesecake with Chocolate Cake
  { 
    _id: "s1", 
    name: "Blueberry Muffin", 
    description: "Bakery-fresh muffin loaded with berries", 
    price: 80, 
    category: "Sweet Treats", 
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "s2", 
    name: "Butter Croissant", 
    description: "Golden, flaky all-butter croissant", 
    price: 90, 
    category: "Sweet Treats", 
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "s4", 
    name: "Chocolate Cake", 
    description: "Rich chocolate layer cake with ganache", 
    price: 150, 
    category: "Sweet Treats", 
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&h=300&q=80" 
  },
  { 
    _id: "s5", 
    name: "Chocolate Brownie", 
    description: "Dense fudgy brownie with walnuts", 
    price: 110, 
    category: "Sweet Treats", 
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&h=300&q=80" 
  }
];

export const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&h=300&q=80";