import React from 'react';
import './Features.css';

const Features = () => {
  const infoCards = [
    {
      category: 'HEALTH',
      title: 'Prevent Diseases',
      description: 'Regular vaccination reduces disease risks and ensures healthier pigs.',
    },
    {
      category: 'VETERINARY',
      title: 'Emergency Care',
      description: 'Know when to call a vet to save your pigs from critical illnesses.',
    },
    {
      category: 'BUSINESS',
      title: 'Profit Strategies',
      description: 'Smart management increases farm revenue and long-term success.',
    },
  ];

  return (
    <div className="features-container">
      <div className="info-cards">
        {infoCards.map((card, index) => (
          <div key={index} className="info-card">
            <span className="category">{card.category}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      <div className="connect-section">
        <h2>Connect, Learn & Grow</h2>
        <p>
          Become part of Rwanda's largest pig farming network. Share experiences, 
          get expert advice, and grow your farm successfully.
        </p>
        <button className="join-now">Join Now</button>
      </div>
    </div>
  );
};

export default Features; 