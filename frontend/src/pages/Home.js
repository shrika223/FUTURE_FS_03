import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { CATEGORIES } from '../data/menuItems';

const QUICK_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'All');

const HIGHLIGHTS = [
  { title: '30+ menu items', detail: 'Across 4 curated categories' },
  { title: 'Order online', detail: 'Add to cart & checkout in minutes' },
  { title: 'Fresh daily', detail: 'Baked goods made every morning' }
];

function Home() {
  const [activeHighlight, setActiveHighlight] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % HIGHLIGHTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-container home-page">
      <div className="hero-section">
        <h1>Welcome to Brew Haven ☕</h1>
        <p>Your cozy spot for premium coffee, fresh pastries, and unforgettable moments</p>
        <div className="hero-actions">
          <Link to="/menu">
            <button type="button">Explore Our Menu →</button>
          </Link>
          <Link to="/menu?category=Coffee">
            <button type="button" className="hero-btn-outline">Start with Coffee</button>
          </Link>
        </div>
        <div className="hero-ticker" aria-live="polite">
          <span className="hero-ticker-label">Today&apos;s highlight:</span>
          <strong>{HIGHLIGHTS[activeHighlight].title}</strong>
          <span> — {HIGHLIGHTS[activeHighlight].detail}</span>
        </div>
      </div>

      <section className="home-section">
        <h2 className="section-title">Browse by category</h2>
        <p className="section-subtitle">Four simple categories — plenty to choose from</p>
        <div className="category-grid">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu?category=${encodeURIComponent(cat.id)}`}
              className="category-tile"
            >
              <span className="category-tile-icon">{cat.icon}</span>
              <h3>{cat.label}</h3>
              <p>{cat.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">☕</div>
          <h3>Artisan Coffee</h3>
          <p>Freshly roasted beans from around the world, expertly brewed to perfection by our skilled baristas.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🥐</div>
          <h3>Fresh Pastries</h3>
          <p>Handmade pastries and baked goods prepared fresh daily with premium ingredients and love.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌟</div>
          <h3>Warm Ambiance</h3>
          <p>A cozy retreat perfect for work, study, meetings, or simply unwinding with friends and family.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
