const fs = require("fs");
const path = require("path");

const colors = {
  Coffee: { bg: "#5c4033", accent: "#d4a574" },
  Drinks: { bg: "#2d5a4a", accent: "#7ec8a3" },
  Food: { bg: "#6b4e3d", accent: "#e8c49a" },
  "Sweet Treats": { bg: "#5c3d5c", accent: "#f0b7d8" }
};

const items = [
  { id: "c1", name: "Espresso", cat: "Coffee" },
  { id: "c2", name: "Cappuccino", cat: "Coffee" },
  { id: "c3", name: "Café Latte", cat: "Coffee" },
  { id: "c4", name: "Americano", cat: "Coffee" },
  { id: "c5", name: "Mocha", cat: "Coffee" },
  { id: "c6", name: "Caramel Macchiato", cat: "Coffee" },
  { id: "c7", name: "Flat White", cat: "Coffee" },
  { id: "c8", name: "Affogato", cat: "Coffee" },
  { id: "d1", name: "Masala Chai", cat: "Drinks" },
  { id: "d2", name: "Green Tea", cat: "Drinks" },
  { id: "d3", name: "Iced Latte", cat: "Drinks" },
  { id: "d4", name: "Cold Brew", cat: "Drinks" },
  { id: "d5", name: "Fresh Lemonade", cat: "Drinks" },
  { id: "d6", name: "Hot Chocolate", cat: "Drinks" },
  { id: "d7", name: "Mango Smoothie", cat: "Drinks" },
  { id: "f1", name: "Veg Club Sandwich", cat: "Food" },
  { id: "f2", name: "Grilled Cheese", cat: "Food" },
  { id: "f3", name: "Caprese Panini", cat: "Food" },
  { id: "f4", name: "Avocado Toast", cat: "Food" },
  { id: "f5", name: "Pancake Stack", cat: "Food" },
  { id: "f6", name: "Eggs Benedict", cat: "Food" },
  { id: "f7", name: "Caesar Salad", cat: "Food" },
  { id: "f8", name: "Garlic Bread", cat: "Food" },
  { id: "s1", name: "Blueberry Muffin", cat: "Sweet Treats" },
  { id: "s2", name: "Butter Croissant", cat: "Sweet Treats" },
  { id: "s3", name: "Cinnamon Roll", cat: "Sweet Treats" },
  { id: "s4", name: "Cheesecake", cat: "Sweet Treats" },
  { id: "s5", name: "Chocolate Brownie", cat: "Sweet Treats" },
  { id: "s6", name: "Tiramisu", cat: "Sweet Treats" },
  { id: "s7", name: "Lava Cake", cat: "Sweet Treats" },
  { id: "s8", name: "Chip Cookies", cat: "Sweet Treats" }
];

const icons = { Coffee: "☕", Drinks: "🥤", Food: "🍽️", "Sweet Treats": "🍰" };

function svg(name, cat) {
  const c = colors[cat];
  const icon = icons[cat];
  const safe = name.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:${c.bg}"/><stop offset="100%" style="stop-color:${c.accent};stop-opacity:0.85"/>
  </linearGradient></defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <circle cx="650" cy="120" r="90" fill="${c.accent}" opacity="0.25"/>
  <circle cx="120" cy="480" r="70" fill="${c.accent}" opacity="0.2"/>
  <text x="400" y="260" text-anchor="middle" font-size="120">${icon}</text>
  <text x="400" y="340" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="36" font-weight="bold">${safe}</text>
  <text x="400" y="390" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="22">${cat}</text>
</svg>`;
}

const out = path.join(__dirname, "..", "public", "menu");
fs.mkdirSync(out, { recursive: true });

items.forEach((item) => {
  fs.writeFileSync(path.join(out, `${item.id}.svg`), svg(item.name, item.cat));
});

["cat-coffee", "cat-drinks", "cat-food", "cat-sweets", "dashboard"].forEach((id) => {
  const cat = id.includes("coffee") ? "Coffee" : id.includes("drinks") ? "Drinks" : id.includes("food") ? "Food" : id.includes("sweets") ? "Sweet Treats" : "Coffee";
  const label = id === "dashboard" ? "Brew Haven" : cat;
  fs.writeFileSync(path.join(out, `${id}.svg`), svg(label, cat));
});

console.log("Generated", items.length + 5, "menu images in public/menu/");
