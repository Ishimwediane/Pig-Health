import React from 'react';
import './Guide.css';

const Guide = () => {
  const guideItems = [
    "Provide proper shelter with adequate ventilation and space for pigs to move.",
    "Maintain a clean environment and implement strict biosecurity measures.",
    "Feed balanced nutrition with the right mix of proteins, vitamins, and minerals.",
    "Establish a regular health check and vaccination schedule.",
    "Monitor water quality and ensure constant fresh water availability.",
    "Keep detailed records of growth, health, and breeding activities."
  ];

  return ( 
    <div className="guide-container"> 
      <div className="guide-content">
        <div className="guide-image">
          <img src="/src/assets/pig-guide.jpg" alt="Pigs feeding" />
        </div>
        
        <div className="guide-text">
          <span className="guide-label">Getting Started with Pig Farming</span>
          <h2>Your Guide to Successful Pig Farming</h2>
          <p>
            Pig farming is both a rewarding and sustainable practice. To help you succeed,
            here are some key steps to start taking proper care of your pigs.
          </p>
          
          <div className="guide-items">
            {guideItems.map((item, index) => (
              <div key={index} className="guide-item">
                <span className="checkmark">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          
          {/* <button className="read-more">Read More</button> */}
        </div>
      </div>
    </div>
  );
};

export default Guide; 