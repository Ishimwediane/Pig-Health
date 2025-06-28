import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const WasteManagement = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Waste Management</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Waste Management Matters</h2>
        <p>
          Proper waste management is essential for maintaining a healthy pig farm, protecting the environment, and ensuring community well-being. Effective systems reduce disease risk, odor, and pollution.
        </p>
      </section>
      <section className="breed-section">
        <h2>Types of Pig Waste</h2>
        <ul>
          <li>Solid waste (manure, bedding)</li>
          <li>Liquid waste (urine, wash water)</li>
          <li>Feed waste and other organic matter</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Waste Management Methods</h2>
        <ul>
          <li>Composting manure for use as fertilizer</li>
          <li>Biogas production from pig waste</li>
          <li>Proper storage and regular removal of waste</li>
          <li>Constructed wetlands or lagoons for liquid waste</li>
          <li>Safe disposal of non-compostable materials</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Keep pens clean and dry</li>
          <li>Separate solid and liquid waste</li>
          <li>Use protective gear when handling waste</li>
          <li>Educate workers on safe waste handling</li>
          <li>Monitor for signs of pollution or disease</li>
        </ul>
      </section>
    </div>
  </div>
);

export default WasteManagement; 