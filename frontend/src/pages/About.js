import React, { useState } from "react";
import { Link } from "react-router-dom";

const VALUES = [
  { icon: "🌍", title: "Ethically sourced", text: "Fair-trade beans from small farms we know by name." },
  { icon: "🥐", title: "Baked fresh daily", text: "Pastries out of the oven every morning — never frozen." },
  { icon: "🏡", title: "Cozy space", text: "Warm lights, soft music, and room to stay awhile." },
  { icon: "💚", title: "Community first", text: "Local art on the walls and events every month." }
];

const MILESTONES = [
  { year: "2020", title: "Doors open", text: "A tiny corner shop with one espresso machine and big dreams." },
  { year: "2022", title: "Growing family", text: "Expanded menu, more seats, and our first pastry chef." },
  { year: "2024", title: "Order online", text: "Browse the menu and order from your phone — we brew when you arrive." },
  { year: "Today", title: "Your table awaits", text: "Still the same warmth, now with 30+ drinks and bites to love." }
];

const TEAM = [
  { name: "Priya", role: "Head Barista", emoji: "☕" },
  { name: "Arjun", role: "Pastry Chef", emoji: "👨‍🍳" },
  { name: "Meera", role: "Café Manager", emoji: "✨" }
];

function About() {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div className="about-page">
      <section
        className="about-hero"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(62, 42, 28, 0.82), rgba(111, 78, 55, 0.75)), url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)"
        }}
      >
        <h1>About Brew Haven</h1>
        <p>More than coffee — a place to slow down, connect, and feel at home.</p>
        <Link to="/menu">
          <button type="button" className="about-hero-btn">See what&apos;s brewing →</button>
        </Link>
      </section>

      <div className="about-stats">
        <div className="about-stat">
          <strong>30+</strong>
          <span>Menu items</span>
        </div>
        <div className="about-stat">
          <strong>4</strong>
          <span>Categories</span>
        </div>
        <div className="about-stat">
          <strong>2020</strong>
          <span>Founded</span>
        </div>
        <div className="about-stat">
          <strong>100%</strong>
          <span>Fresh daily</span>
        </div>
      </div>

      <div className="about-tabs">
        {[
          { id: "story", label: "Our story" },
          { id: "values", label: "What we stand for" },
          { id: "team", label: "Meet the team" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`about-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "story" && (
        <div className="about-panel">
          <div className="about-story-grid">
            <div className="about-story-text">
              <h2>How we started</h2>
              <p>
                Brew Haven began with a simple idea: everyone deserves a calm, beautiful place for a great cup of coffee.
                What started as a neighborhood hideout is now a gathering spot for students, remote workers, families, and friends.
              </p>
              <p>
                We roast carefully, bake patiently, and greet you like family — because that&apos;s who you are to us.
              </p>
            </div>
            <div
              className="about-story-image"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1495474472568-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80)"
              }}
            />
          </div>
          <div className="about-timeline">
            {MILESTONES.map((m) => (
              <div key={m.year} className="about-milestone">
                <span className="about-milestone-year">{m.year}</span>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "values" && (
        <div className="about-panel">
          <div className="about-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="about-value-card">
                <span className="about-value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="about-panel">
          <p className="about-team-intro">The people behind every perfect pour.</p>
          <div className="about-team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="about-team-card">
                <span className="about-team-emoji">{member.emoji}</span>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="about-cta">
        <h2>Ready for your next cup?</h2>
        <p>Explore our menu or drop by — we&apos;d love to see you.</p>
        <div className="about-cta-actions">
          <Link to="/menu">
            <button type="button">View Menu</button>
          </Link>
          <Link to="/contact">
            <button type="button" className="secondary">Contact Us</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
