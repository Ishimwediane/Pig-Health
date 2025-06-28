import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const Housing = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Pig Housing</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Importance of Proper Pig Housing</h2>
        <p>
          Proper housing is essential for the health, productivity, and welfare of pigs. Good housing protects pigs from harsh weather, predators, and diseases, while providing a comfortable environment for growth and reproduction.
        </p>
      </section>
      <section className="breed-section">
        <h2>Key Features of Good Pig Housing</h2>
        <ul>
          <li>Well-ventilated to reduce heat and humidity</li>
          <li>Easy to clean and disinfect</li>
          <li>Dry, draft-free, and well-drained floors</li>
          <li>Enough space for each pig to move and rest comfortably</li>
          <li>Protection from extreme weather and predators</li>
          <li>Access to clean water and feed</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Types of Pig Housing</h2>
        <ul>
          <li><strong>Traditional Housing:</strong> Simple structures made from locally available materials.</li>
          <li><strong>Modern Housing:</strong> Concrete floors, metal roofing, and advanced ventilation systems.</li>
          <li><strong>Open Housing:</strong> Suitable for free-range or semi-intensive systems.</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Regularly clean and disinfect pens</li>
          <li>Provide bedding such as straw or sawdust</li>
          <li>Ensure proper drainage to avoid waterlogging</li>
          <li>Monitor temperature and humidity</li>
          <li>Separate sick animals to prevent disease spread</li>
        </ul>
      </section>
    </div>
  </div>
);

export default Housing; 