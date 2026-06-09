import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../config";

const CART_STORAGE_KEY = "menuCartItems";
const ORDER_STORAGE_KEY = "fallbackOrders";

function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedFromLocation = location.state?.cartItems;
    if (Array.isArray(savedFromLocation)) return savedFromLocation;
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({ customerName: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.cartItems?.length) setCartItems(location.state.cartItems);
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateTotal = () => cartItems.reduce((t, item) => t + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return false;
    }
    return true;
  };

  const saveLocalOrder = (order) => {
    const existing = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || "[]");
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([...existing, order]));
  };

  const placeOrder = async () => {
    if (!validateForm()) return;
    setPlacing(true);
    setError("");

    const payload = {
      customerName: formData.customerName.trim(),
      phone: formData.phone,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: calculateTotal(),
      status: "Pending"
    };

    const localId = `local-${Date.now()}`;
    let ref = localId.slice(-6).toUpperCase();

    try {
      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const id = data.orderId || data.order?._id || localId;
        ref = String(id).slice(-6).toUpperCase();
      } else {
        saveLocalOrder({
          ...payload,
          _id: localId,
          createdAt: new Date().toISOString()
        });
      }
    } catch {
      saveLocalOrder({
        ...payload,
        _id: localId,
        createdAt: new Date().toISOString()
      });
    }

    setOrderRef(ref);
    setOrderPlaced(true);
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    setPlacing(false);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success-page">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">✓</div>
          <h1>Order confirmed!</h1>
          <p className="checkout-order-ref">Order #{orderRef}</p>
          <p>Thanks, <strong>{formData.customerName}</strong>! We&apos;re preparing your order.</p>
          <ul className="checkout-next-steps">
            <li>📞 We&apos;ll text or call you at <strong>{formData.phone}</strong></li>
            <li>⏱️ Estimated ready in <strong>15–25 minutes</strong></li>
            <li>🏪 Pick up at <strong>Brew Haven counter</strong></li>
          </ul>
          <div className="checkout-success-actions">
            <Link to="/menu"><button type="button">Order again</button></Link>
            <Link to="/"><button type="button" className="secondary">Back to home</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Review your order and confirm pickup details</p>
      </div>

      <div className="checkout-layout">
        <section className="checkout-summary">
          <h2>Your order</h2>
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button type="button" onClick={() => navigate("/menu")}>Browse menu</button>
            </div>
          ) : (
            <>
              <ul className="checkout-item-list">
                {cartItems.map((item) => (
                  <li key={item._id} className="checkout-line">
                    {item.image && (
                      <img src={item.image} alt="" className="checkout-line-img" />
                    )}
                    <div className="checkout-line-info">
                      <strong>{item.name}</strong>
                      <span>Qty {item.quantity}</span>
                    </div>
                    <span className="checkout-line-price">₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="checkout-subtotal">
                <span>Subtotal</span>
                <strong>₹{calculateTotal()}</strong>
              </div>
              <p className="checkout-tax-note">Taxes included · Pay at pickup</p>
            </>
          )}
        </section>

        <section className="checkout-form-section">
          <h2>Pickup details</h2>
          {error && <div className="checkout-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="customerName">Full name</label>
            <input
              id="customerName"
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Mobile number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="10-digit number"
              maxLength={10}
            />
          </div>
          <button
            type="button"
            className="checkout-place-btn"
            onClick={placeOrder}
            disabled={placing || cartItems.length === 0}
          >
            {placing ? "Placing order..." : `Place order · ₹${calculateTotal()}`}
          </button>
          <button type="button" className="checkout-continue-btn" onClick={() => navigate("/menu")}>
            ← Continue shopping
          </button>
        </section>
      </div>
    </div>
  );
}

export default Cart;
