import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const Feeding = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Pig Feeding</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Importance of Proper Pig Feeding</h2>
        <p>
          Proper feeding is crucial for the growth, health, and productivity of pigs. A balanced diet ensures optimal weight gain, strong immunity, and high-quality pork production.
        </p>
      </section>
      <section className="breed-section">
        <h2>Key Components of Pig Diet</h2>
        <ul>
          <li>Energy sources: maize, cassava, sweet potatoes</li>
          <li>Protein sources: soybean meal, fish meal, groundnut cake</li>
          <li>Vitamins and minerals: premixes, salt, bone meal</li>
          <li>Clean, fresh water at all times</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Feeding Stages</h2>
        <ul>
          <li><strong>Starter:</strong> For piglets (0-8 weeks), high protein and energy</li>
          <li><strong>Grower:</strong> For growing pigs (8-16 weeks), balanced protein and energy</li>
          <li><strong>Finisher:</strong> For finishing pigs (16 weeks to market), more energy, moderate protein</li>
          <li><strong>Sow and Boar:</strong> Special diets for breeding animals</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Feed pigs at regular intervals</li>
          <li>Avoid sudden changes in diet</li>
          <li>Monitor feed intake and pig growth</li>
          <li>Store feed in a dry, cool place to prevent spoilage</li>
          <li>Consult a nutritionist for feed formulation</li>
        </ul>
      </section>
    </div>
  </div>
);

export default Feeding; 