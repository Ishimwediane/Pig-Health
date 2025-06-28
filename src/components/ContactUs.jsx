import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would normally send the form data to your backend or email service
  };

  return (
    <section className="contact-us-section">
      <div className="contact-us-content">
        <h2>Contact Us</h2>
        <p>Have questions or need support? Reach out to our team!</p>
        <div className="contact-us-main">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
            />
            <button type="submit" className="contact-btn">Send Message</button>
            {submitted && <div className="contact-success">Thank you! We'll get back to you soon.</div>}
          </form>
          <div className="contact-details">
            <h4>Contact Information</h4>
            <p><strong>Email:</strong> info@pighealth.rw</p>
            <p><strong>Phone:</strong> +250 123 456 789</p>
            <p><strong>Address:</strong> Kigali, Rwanda</p>
            <div className="contact-socials">
              <a href="#" aria-label="Facebook">🌐</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="WhatsApp">💬</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
