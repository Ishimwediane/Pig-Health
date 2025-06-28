import React from 'react';
import './Stats.css';

const Stats = () => {
  return (
    <div className="stats-container">
      <div className="stats-header">
        <div className="stats-title ">
          <span>ABOUT</span>
          <span>PIG IN RWANDA</span>
        </div>
      </div>
      
      <div className="stats-grid ">
        <div className="stat-item">
          <h2>100+</h2>
          <p>Categories</p>
        </div>
        <div className="stat-item">
          <h2>100+</h2>
          <p>Categories</p>
        </div>
        <div className="stat-item">
          <h2>100+</h2>
          <p>Categories</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;