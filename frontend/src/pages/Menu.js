import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATEGORIES, MENU_ITEMS } from "../data/menuItems";

const CART_STORAGE_KEY = "menuCartItems";

function Menu() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (fromUrl && CATEGORIES.some((c) => c.id === fromUrl)) {
      setActiveCategory(fromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredItems = useMemo(() => {
    let list = MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const getItemQuantity = (itemId) => {
    const item = cartItems.find((cartItem) => cartItem._id === itemId);
    return item ? item.quantity : 0;
  };

  const incrementItem = (item, showMessage = true) => {
    const existing = cartItems.find((cartItem) => cartItem._id === item._id);
    const updatedCart = existing
      ? cartItems.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      : [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCart);
    if (showMessage) setToast(`${item.name} added to cart`);
  };

  const decrementItem = (item) => {
    const existing = cartItems.find((cartItem) => cartItem._id === item._id);
    if (!existing) return;
    const updatedCart =
      existing.quantity > 1
        ? cartItems.map((cartItem) =>
            cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
          )
        : cartItems.filter((cartItem) => cartItem._id !== item._id);
    setCartItems(updatedCart);
  };

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const displayCategories = CATEGORIES.filter((c) => c.id !== "All");

  return (
    <div className="menu-page-wrap">
      <section className="menu-hero-banner">
        <div className="menu-hero-content">
          <h1>Our Menu</h1>
          <p>Handcrafted drinks & bites — order for pickup at Brew Haven</p>
        </div>
      </section>

      <div className="menu-page-inner">
        <div className="menu-toolbar-row">
          <input
            type="search"
            className="menu-search"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="menu-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <h2 className="menu-categories-title">Choose a category</h2>
        <div className="category-cards-row">
          <button
            type="button"
            className={`category-card ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => selectCategory("All")}
          >
            <div className="category-card-bg" style={{ backgroundImage: `url(${CATEGORIES[0].banner})` }} />
            <div className="category-card-overlay" />
            <div className="category-card-body">
              <span className="category-card-icon">✨</span>
              <span className="category-card-label">All Menu</span>
              <span className="category-card-tag">Full selection</span>
            </div>
          </button>

          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-card ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => selectCategory(cat.id)}
            >
              <div className="category-card-bg" style={{ backgroundImage: `url(${cat.banner})` }} />
              <div className="category-card-overlay" />
              <div className="category-card-body">
                <span className="category-card-icon">{cat.icon}</span>
                <span className="category-card-label">{cat.label}</span>
                <span className="category-card-tag">{cat.tagline}</span>
              </div>
            </button>
          ))}
        </div>

        {cartCount > 0 && (
          <div className="menu-cart-strip">
            <span>🛒 {cartCount} items · ₹{cartTotal}</span>
            <button type="button" onClick={() => navigate("/cart", { state: { cartItems } })}>
              View cart
            </button>
          </div>
        )}

        <h2 className="menu-items-heading">
          {activeCategory === "All" ? "All items" : activeCategory}
        </h2>

        {filteredItems.length === 0 ? (
          <div className="menu-empty-state">
            <p>Nothing found. Try another search or category.</p>
            <button type="button" className="secondary" onClick={() => { setSearchQuery(""); selectCategory("All"); }}>
              Show all
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article key={item._id} className={`menu-card ${getItemQuantity(item._id) > 0 ? "in-cart" : ""}`}>
                <div className="menu-card-image">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&h=300&q=80";
                    }}
                  />
                  <span className="menu-card-badge">{item.category}</span>
                </div>
                <div className="menu-card-content">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="menu-card-footer">
                    <span className="menu-card-price">₹{item.price}</span>
                    <div className="qty-controls compact">
                      <button type="button" className="qty-btn" onClick={() => decrementItem(item)} disabled={getItemQuantity(item._id) === 0}>−</button>
                      <span className="qty-value">{getItemQuantity(item._id)}</span>
                      <button type="button" className="qty-btn qty-btn-plus" onClick={() => incrementItem(item)}>+</button>
                    </div>
                  </div>
                  <button type="button" className="add-cart-btn" onClick={() => incrementItem(item)}>
                    Add to order
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {cartCount > 0 && (
        <div className="menu-floating-cart">
          <button type="button" onClick={() => navigate("/cart", { state: { cartItems } })}>
            Checkout · ₹{cartTotal} ({cartCount})
          </button>
        </div>
      )}

      {toast && <div className="menu-toast">{toast}</div>}
    </div>
  );
}

export default Menu;
