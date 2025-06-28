import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CTABanner.css';

const CTABanner = () => {
  const navigate = useNavigate();
  return (
    <div className="cta-banner">
      <div className="cta-content">
        <div className="cta-image">
          <img src="/src/assets/pig-standing.png" alt="Pink pig" />
        </div>
        <div className="cta-text">
          <span className="cta-label">Join the Pig Farming Network</span>
          <h2>Be part of Rwanda's fastest-growing pig farming community.</h2>
          <button className="sign-up-btn" onClick={() => navigate('/signup')}>Sign Up Now</button>
        </div>
      </div>
    </div>
  );
};

export default CTABanner; 