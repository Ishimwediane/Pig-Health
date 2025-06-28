import React from 'react';
import './PigBreedPage.css';

const Duroc = () => {
  return (
    <div className="pig-breed-page">
      <div className="breed-header profile-layout">
        <div className="breed-image">
          <img src="/images/pig-breeds/duroc.jpg" alt="Duroc Pig" />
        </div>
        <div className="breed-profile-card">
          <h2>Breed Profile</h2>
          <ul>
            <li>Red to golden-red color</li>
            <li>Excellent meat quality and marbling</li>
            <li>Fast growth rate</li>
            <li>Good feed conversion efficiency</li>
            <li>Hardy and adaptable</li>
            <li>Good temperament</li>
            <li>Used in crossbreeding programs</li>
          </ul>
        </div>
      </div>

      <div className="breed-content">
        <section className="breed-section">
          <h2>Overview</h2>
          <p>
          Duroc pigs are a popular breed known for their reddish-brown color, muscular build, and calm temperament. 
          Originating from the United States, they are commonly used in crossbreeding programs to improve meat quality and growth performance. 
          In Rwanda, Durocs are valued for their adaptability and ability to produce high-quality pork.
          </p>
        </section>

        <section className="breed-sectionp">
          <h2>Performance</h2>
          <div className="performance-metrics">
            <div className="metric">
              <h3>Growth Rate</h3>
              <p>800-1000g per day</p>
            </div>
            <div className="metric">
              <h3>Mature Weight</h3>
              <p>Boars: 320-360kg</p>
              <p>Sows: 270-320kg</p>
            </div>
            <div className="metric">
              <h3>Litter Size</h3>
              <p>9-11 piglets per litter</p>
            </div>
          </div>
        </section>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Characteristics</h2>
            <ul>
              <li>Red to golden-red color</li>
              <li>Medium-sized drooping ears</li>
              <li>Excellent meat quality</li>
              <li>Fast growth rate</li>
              <li>Good feed conversion efficiency</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Farming Benefits</h2>
            <ul>
              <li>Excellent meat quality with marbling</li>
              <li>Good feed conversion efficiency</li>
              <li>Hardy and adaptable to various climates</li>
              <li>Fast-growing and muscular</li>
              <li>Calm and manageable temperament</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Advantages</h2>
            <ul>
              <li>Excellent meat quality and marbling</li>
              <li>Fast growth rate</li>
              <li>Good feed conversion efficiency</li>
              <li>Hardy and adaptable</li>
              <li>Good temperament</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Disadvantages</h2>
            <ul>
              <li>Can be aggressive, especially males</li>
              <li>May not have strong maternal traits</li>
              <li>Less adaptable to extremely hot or cold climates</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Management Requirements</h2>
            <ul>
              <li>Requires high-quality feed for optimal growth</li>
              <li>Needs proper housing with good ventilation</li>
              <li>Regular exercise area needed</li>
              <li>Regular health monitoring recommended</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Challenges</h2>
            <ul>
              <li>Requires high-quality feed</li>
              <li>Needs proper management for optimal performance</li>
              <li>Can be aggressive if not properly managed</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Duroc; 