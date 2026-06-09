import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      setError('Valid 10-digit phone number is required');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (validateForm()) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-header">Get in Touch 📧</h1>
      <p className="page-subheader">We'd love to hear from you! Drop us a message anytime.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
        {/* Contact Information */}
        <div className="contact-info">
          <h2 style={{ color: '#6f4e37', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700' }}>Reach Us</h2>
          
          <div className="contact-item">
            <div className="contact-item-icon">📍</div>
            <div>
              <strong>Visit Us</strong><br />
              MG Road, Mangaluru - 575001<br />
              Karnataka, India
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">📞</div>
            <div>
              <strong>Call Us</strong><br />
              +91 98765 43210<br />
              +91 88765 43210
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">📧</div>
            <div>
              <strong>Email Us</strong><br />
              hello@brewhaven.com<br />
              info@brewhaven.com
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">🕒</div>
            <div>
              <strong>Opening Hours</strong><br />
              Mon - Fri: 8 AM – 10 PM<br />
              Sat - Sun: 9 AM – 11 PM
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">🚗</div>
            <div>
              <strong>Parking</strong><br />
              Free parking available<br />
              Ample street and basement parking
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="form-container">
            <h2 style={{ color: '#6f4e37', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Send us a Message</h2>

            {error && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', fontWeight: '600' }}>
                ⚠️ {error}
              </div>
            )}

            {submitted && (
              <div style={{ background: '#d4edda', color: '#155724', padding: '1.2rem', borderRadius: '6px', marginBottom: '1rem', fontWeight: '600' }}>
                ✅ Thank you for your message! We'll get back to you within 24 hours.
              </div>
            )}

            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
              ></textarea>
            </div>

            <button type="submit" style={{ width: '100%', fontSize: '1.05rem', padding: '1rem', fontWeight: '700' }}>
              Send Message ✉️
            </button>
          </form>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ color: '#6f4e37', marginBottom: '1.5rem', textAlign: 'center' }}>Find Us Here 🗺️</h2>
        <div style={{
          background: 'linear-gradient(135deg, #D2B48C 0%, #8B6F47 100%)',
          borderRadius: '12px',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          📍 Map integration coming soon! Visit us at MG Road, Mangaluru
        </div>
      </div>
    </div>
  );
}

export default Contact;
