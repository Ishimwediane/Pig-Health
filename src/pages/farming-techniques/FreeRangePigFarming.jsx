import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const FreeRangePigFarming = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Free-Range Pig Farming</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>What is Free-Range Pig Farming?</h2>
        <p>
          Free-range pig farming is a system where pigs are allowed to roam and forage in open spaces, rather than being confined to pens. This method promotes animal welfare and can produce high-quality pork.
        </p>
      </section>
      <section className="breed-section">
        <h2>Benefits of Free-Range Pig Farming</h2>
        <ul>
          <li>Improved animal welfare and natural behavior</li>
          <li>Lower stress and disease risk</li>
          <li>Potential for premium pork products</li>
          <li>Reduced feed costs through foraging</li>
          <li>Better manure distribution for soil health</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Key Considerations</h2>
        <ul>
          <li>Secure fencing to prevent escapes and protect from predators</li>
          <li>Access to shelter, shade, and clean water</li>
          <li>Rotational grazing to prevent overgrazing</li>
          <li>Regular health checks and parasite control</li>
          <li>Compliance with local regulations</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Provide a balanced diet to supplement foraging</li>
          <li>Monitor pig condition and growth</li>
          <li>Maintain clean shelters and water sources</li>
          <li>Record keeping for management and traceability</li>
        </ul>
      </section>
    </div>
  </div>
);

export default FreeRangePigFarming; 