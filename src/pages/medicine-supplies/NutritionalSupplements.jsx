import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const NutritionalSupplements = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Nutritional Supplements</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Nutritional Supplements Matter</h2>
        <p>
          Nutritional supplements help pigs achieve optimal growth, health, and productivity. They provide essential vitamins, minerals, and nutrients that may be lacking in regular feed.
        </p>
      </section>
      <section className="breed-section">
        <h2>Types of Nutritional Supplements</h2>
        <ul>
          <li>Vitamin supplements (A, D, E, B-complex, etc.)</li>
          <li>Mineral supplements (calcium, phosphorus, zinc, iron, selenium, etc.)</li>
          <li>Amino acid supplements (lysine, methionine, etc.)</li>
          <li>Probiotics and prebiotics</li>
          <li>Electrolytes for hydration</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>When to Use Supplements</h2>
        <ul>
          <li>During periods of rapid growth or stress</li>
          <li>For pregnant and lactating sows</li>
          <li>When feed quality is poor or variable</li>
          <li>To support recovery from illness</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Consult a veterinarian or nutritionist for supplement plans</li>
          <li>Follow recommended dosages</li>
          <li>Mix supplements thoroughly with feed or water</li>
          <li>Monitor pigs for response and adjust as needed</li>
          <li>Store supplements in a cool, dry place</li>
        </ul>
      </section>
    </div>
  </div>
);

export default NutritionalSupplements; 