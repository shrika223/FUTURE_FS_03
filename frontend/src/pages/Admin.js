import React, { useEffect, useState } from "react";
import {
  API_ENDPOINTS,
  ADMIN_TOKEN_KEY,
  ADMIN_CREDENTIALS,
  OFFLINE_ADMIN_TOKEN_PREFIX
} from "../config";
import { DASHBOARD_BG } from "../data/menuItems";

const ORDER_STORAGE_KEY = "fallbackOrders";

function credentialsMatch(email, password) {
  return (
    email.toLowerCase().trim() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  );
}

function isOfflineToken(token) {
  return token && token.startsWith(OFFLINE_ADMIN_TOKEN_PREFIX);
}

const STATUS_OPTIONS = ["Pending", "Confirmed", "Preparing", "Ready", "Delivered", "Cancelled"];

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [localOrders, setLocalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchOrder, setSearchOrder] = useState("");
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setSessionChecked(true);
      setLoading(false);
      return;
    }

    if (isOfflineToken(token)) {
      setIsAuthenticated(true);
      setAdminEmail(ADMIN_CREDENTIALS.email);
      setOfflineMode(true);
      setSessionChecked(true);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ADMIN_VERIFY, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setAdminEmail(data.admin?.email || "");
        } else {
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        }
      } catch {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      } finally {
        setSessionChecked(true);
      }
    };

    verifySession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    setLoading(true);
    fetchOrders();
    setLocalOrders(loadLocalOrders());
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadLocalOrders = () => {
    try {
      return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveLocalOrders = (list) => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(list));
    setLocalOrders(list);
  };

  const finishLogin = (email, offline = false) => {
    if (offline) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, `${OFFLINE_ADMIN_TOKEN_PREFIX}${Date.now()}`);
    }
    setOfflineMode(offline);
    setIsAuthenticated(true);
    setAdminEmail(email);
    setLoginPassword("");
    setLoading(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const email = loginEmail.toLowerCase().trim();

    if (!credentialsMatch(email, loginPassword)) {
      setLoginError("Invalid email or password.");
      setLoginLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: loginPassword })
      });
      const text = await response.text();
      let data = {};
      if (text) try { data = JSON.parse(text); } catch { /* offline */ }

      if (response.ok && data.token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        finishLogin(data.admin?.email || email, false);
      } else {
        finishLogin(email, true);
      }
    } catch {
      finishLogin(email, true);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAuthenticated(false);
    setOrders([]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS);
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      }
    } catch {
      /* keep local orders visible */
    } finally {
      setLoading(false);
    }
  };

  const getAllOrders = () => {
    const map = new Map();
    [...orders, ...localOrders].forEach((o) => {
      if (!map.has(o._id)) map.set(o._id, o);
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (String(orderId).startsWith("local-")) {
      saveLocalOrders(
        localOrders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      return;
    }
    try {
      const res = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch {
      /* silent */
    }
  };

  const orderTotal = (items) =>
    items.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2);

  if (!sessionChecked) {
    return <div className="admin-login-page"><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page" style={{ backgroundImage: `url(${DASHBOARD_BG})` }}>
        <div className="admin-login-overlay" />
        <div className="admin-login-card">
          <div className="admin-brand">☕ Brew Haven</div>
          <h1>Staff login</h1>
          <p className="admin-login-sub">Manage customer orders from your dashboard</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-email">Email</label>
              <input id="admin-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@brewhaven.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input id="admin-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            </div>
            {loginError && <div className="admin-login-error">{loginError}</div>}
            <button type="submit" className="admin-login-btn" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign in to dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const allOrders = getAllOrders();
  const filtered = allOrders.filter((o) => {
    const matchStatus = filter === "All" || o.status === filter;
    const q = searchOrder.toLowerCase();
    const matchSearch =
      !q ||
      o.customerName?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      String(o._id).toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const pending = allOrders.filter((o) => o.status === "Pending").length;
  const revenue = allOrders.reduce((t, o) => t + parseFloat(o.total || orderTotal(o.items)), 0);

  return (
    <div className="admin-dashboard" style={{ backgroundImage: `url(${DASHBOARD_BG})` }}>
      <div className="admin-dashboard-overlay" />

      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">☕ Brew Haven</div>
        <p className="admin-sidebar-role">Order management</p>
        <nav className="admin-sidebar-nav">
          <span className="admin-nav-active">📋 Live orders</span>
        </nav>
        <div className="admin-sidebar-user">
          <span>{adminEmail}</span>
          <button type="button" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Today&apos;s orders</h1>
            <p>Update status as you prepare and complete each order</p>
          </div>
          {offlineMode && (
            <span className="admin-live-badge offline">Offline mode — start backend for new online orders</span>
          )}
          {!offlineMode && <span className="admin-live-badge">● Live</span>}
        </header>

        <div className="admin-kpi-row">
          <div className="admin-kpi">
            <span className="admin-kpi-label">Total orders</span>
            <strong>{allOrders.length}</strong>
          </div>
          <div className="admin-kpi highlight">
            <span className="admin-kpi-label">Needs action</span>
            <strong>{pending}</strong>
          </div>
          <div className="admin-kpi">
            <span className="admin-kpi-label">Revenue today</span>
            <strong>₹{revenue.toFixed(2)}</strong>
          </div>
        </div>

        <div className="admin-toolbar">
          <input
            type="search"
            placeholder="Search by name, phone or order #..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            className="admin-search"
          />
          <div className="admin-filter-chips">
            {["All", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                type="button"
                className={`admin-chip ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <section className="admin-orders-panel">
          {loading && allOrders.length === 0 ? (
            <p className="admin-empty-msg">Loading orders...</p>
          ) : filtered.length === 0 ? (
            <div className="admin-empty-msg">
              <p>No orders yet</p>
              <span>When customers place orders from the menu, they appear here instantly.</span>
            </div>
          ) : (
            <div className="admin-orders-list">
              {filtered.map((order) => (
                <article key={order._id} className={`admin-order-card status-${order.status?.toLowerCase()}`}>
                  <div className="admin-order-top">
                    <div>
                      <span className="admin-order-id">Order #{String(order._id).slice(-6).toUpperCase()}</span>
                      <h3>{order.customerName}</h3>
                      <p>{order.phone} · {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="admin-status-select"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <ul className="admin-order-items">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="admin-order-total">
                    <span>Total</span>
                    <strong>₹{order.total || orderTotal(order.items)}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Admin;
