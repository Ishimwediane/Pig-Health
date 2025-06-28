import React from 'react';
import { FaTwitter, FaFacebookF, FaPinterestP, FaInstagram, FaArrowRight } from 'react-icons/fa';
import './Footer.css';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo and Description */}
        <div className="footer-brand">
          <div className="footer-logo">
            <h2>PigHealth</h2>
            <span>Rwanda</span>
          </div>
          <p className="footer-description">
          A tech-driven platform improving pig farming in Rwanda through innovation, education, and supportive policies.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Pinterest"><FaPinterestP /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li>
              <Link to="/" onClick={e => {
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 300);
                }
              }}>
                Home
              </Link>
            </li>
            <li><Link to="/about" onClick={e => {
              e.preventDefault();
              if (window.location.pathname !== '/about') {
                navigate('/about');
                setTimeout(() => {
                  const aboutSection = document.querySelector('.about-us-section');
                  if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              } else {
                const aboutSection = document.querySelector('.about-us-section');
                if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}>About Us</Link></li>
            <li><a href="#contact-us" onClick={e => {
              e.preventDefault();
              if (window.location.pathname !== '/about') {
                navigate('/about');
                setTimeout(() => {
                  if (window.scrollToContactUs) window.scrollToContactUs();
                }, 300);
              } else {
                if (window.scrollToContactUs) window.scrollToContactUs();
              }
            }}>Contact Us</a></li>
            {/* <li><a href="#">Community</a></li> */}
          </ul>
        </div>

        {/* News Section */}
        <div className="footer-section">
          <h3>News</h3>
          <div className="news-item">
            <h4>New Farming Techniques</h4>
            <p>Discover modern pig farming methods for better yields.</p>
          </div>
          <div className="news-item">
            <h4>Disease Prevention Tips</h4>
            <p>Learn how to keep your pigs healthy year-round.</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <p>
              <a href="tel:+250790755675">+250790755675</a>
            </p>
            <p>
              <a href="mailto:ishimwediane40@gmail.com">ishimwediane40@gmail.com</a>
            </p>
            <p>Kigali,Rwanda</p>
          </div>
          <div className="newsletter">
            <input type="email" placeholder="Your Email Address" />
            <button type="submit" aria-label="Subscribe">
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 