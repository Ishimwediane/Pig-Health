import React, { forwardRef, useRef } from 'react';
import './AboutUs.css';
import ContactUs from './ContactUs';

export const AboutUs = () => (
  <section className="about-us-section">
    <div className="about-us-content">
      <h2>About Us</h2>
      <p>
        <strong>PigHealth Rwanda</strong> is dedicated to transforming pig farming through innovation, education, and community. Our mission is to empower farmers with the latest knowledge, tools, and support to achieve sustainable and profitable pig production.
      </p>
      <div className="about-us-highlights">
        <div className="highlight">
          <span role="img" aria-label="innovation">💡</span>
          <h4>Innovation</h4>
          <p>We bring the latest technology and best practices to Rwandan pig farmers.</p>
        </div>
        <div className="highlight">
          <span role="img" aria-label="community">🤝</span>
          <h4>Community</h4>
          <p>Join a supportive network of farmers, experts, and partners.</p>
        </div>
        <div className="highlight">
          <span role="img" aria-label="support">📞</span>
          <h4>Support</h4>
          <p>Access expert advice, resources, and training for your farm.</p>
        </div>
      </div>
    </div>
  </section>
);

export const FAQ = () => (
  <section className="faq-section" id="faq-section">
    <div className="faq-content">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        <div className="faq-item">
          <h4>How do I join PigHealth Rwanda?</h4>
          <p>Simply sign up using our registration form and follow the onboarding steps to become a member.</p>
        </div>
        <div className="faq-item">
          <h4>Is there support for new farmers?</h4>
          <p>Yes! We offer resources, training, and a community forum for new and experienced farmers alike.</p>
        </div>
        <div className="faq-item">
          <h4>How can I contact veterinary services?</h4>
          <p>Visit our Contact Us section or use the Veterinary Services page for more information.</p>
        </div>
        <div className="faq-item">
          <h4>Can I access PigHealth Rwanda on mobile?</h4>
          <p>Yes, our platform is fully responsive and works on all devices.</p>
        </div>
      </div>
    </div>
  </section>
);

const AboutAndContact = forwardRef((props, ref) => {
  const { contactRef, faqRef } = props;
  return (
    <div>
      <AboutUs />
      <div ref={contactRef}>
        <ContactUs />
      </div>
      <div ref={faqRef}>
        <FAQ />
      </div>
    </div>
  );
});

export default AboutAndContact;
