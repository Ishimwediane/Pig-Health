import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const PigFeedAndMedicine = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Pig Feed and Medicine</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Importance of Proper Feed and Medicine</h2>
        <p>
          Providing pigs with balanced nutrition and timely medication is essential for their growth, health, and productivity. Good feed and medicine practices help prevent diseases and ensure high-quality pork production.
        </p>
      </section>
      <section className="breed-section">
        <h2>Types of Pig Feed</h2>
        <ul>
          <li>Starter feed for piglets</li>
          <li>Grower feed for young pigs</li>
          <li>Finisher feed for market pigs</li>
          <li>Sow and boar feed for breeding animals</li>
          <li>Supplements: vitamins, minerals, and amino acids</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Common Medicines for Pigs</h2>
        <ul>
          <li>Antibiotics (use only as prescribed by a vet)</li>
          <li>Dewormers for internal parasites</li>
          <li>Vaccines for disease prevention</li>
          <li>Mineral and vitamin supplements</li>
          <li>Electrolytes for dehydration</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Consult a veterinarian for feed and medicine plans</li>
          <li>Store feed and medicine in a cool, dry place</li>
          <li>Follow dosage instructions carefully</li>
          <li>Keep records of all treatments and feed types</li>
          <li>Never use expired or unapproved products</li>
        </ul>
      </section>
    </div>
  </div>
);

export default PigFeedAndMedicine; 