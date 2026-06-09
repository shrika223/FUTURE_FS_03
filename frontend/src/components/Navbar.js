import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div className="brand">☕ Brew Haven</div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/admin" className="nav-admin-link">🔐 Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
