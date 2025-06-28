import React from 'react';
import './PigBreedPage.css';

const LargeWhite = () => {
  console.log('LargeWhite component rendered!'); // Debug log
  
  return (
    <div className="pig-breed-page">
      {/* Debug element */}
     
      
      <div className="breed-header profile-layout">
        <div className="breed-image">
          <img src="/images/pig-breeds/large-white.png" alt="Large White Pig" />
        </div>
        <div className="breed-profile-card">
          <h2>Breed Profile</h2>
          <ul>
            <li>Many and healthy litters</li>
            <li>High milk production</li>
            <li>Good feed conversion</li>
            <li>High carcass lean meat content</li>
            <li>Free from RYR1T gene</li>
            <li>Well adapted to various climates</li>
            <li>Late maturity</li>
          </ul>
        </div>
      </div>

      <div className="breed-content">
        <section className="breed-section">
          <h2>Overview</h2>
          <p>
            The Large White, also known as the Yorkshire pig, is one of the most popular pig breeds worldwide. 
            Originating from Yorkshire, England, this breed is known for its excellent meat quality and adaptability.
          </p>
          <p> The Large White pig is one of the most widely used commercial pig breeds in the world, including Rwanda.
        It is known for its rapid growth, high feed efficiency, and superior meat quality. Its adaptability to 
        various climates and good mothering abilities make it ideal for both small and large-scale farms.</p>
        </section>

        <section className="breed-sectionp">
          <h2>Performance</h2>
          <div className="performance-metrics">
            <div className="metric">
              <h3>Growth Rate</h3>
              <p>700-900g per day</p>
            </div>
            <div className="metric">
              <h3>Mature Weight</h3>
              <p>Boars: 300-350kg</p>
              <p>Sows: 250-300kg</p>
            </div>
            <div className="metric">
              <h3>Litter Size</h3>
              <p>10-12 piglets per litter</p>
            </div>
          </div>
        </section>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Characteristics</h2>
            <ul>
              <li>Large, white-colored body with erect ears</li>
              <li>Excellent mothering abilities</li>
              <li>High feed conversion efficiency</li>
              <li>Good growth rate and lean meat production</li>
              <li>Adaptable to various climates</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Farming Benefits</h2>
            <ul>
              <li>High feed-to-meat conversion efficiency</li>
              <li>Adaptable to Rwandan farming conditions</li>
              <li>Preferred for meat production due to lean carcass</li>
              <li>Performs well in crossbreeding programs</li>
              <li>Easy to manage with good reproductive traits</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Advantages</h2>
            <ul>
              <li>Excellent meat quality</li>
              <li>Good mothering abilities</li>
              <li>High feed conversion efficiency</li>
              <li>Adaptable to various climates</li>
              <li>Good temperament</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Disadvantages</h2>
            <ul>
              <li>Prone to sunburn due to white skin</li>
              <li>May not perform well in very hot climates</li>
              <li>Requires proper housing and feeding management</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Management Requirements</h2>
            <ul>
              <li>Requires good quality feed for optimal growth</li>
              <li>Needs proper housing with good ventilation</li>
              <li>Regular health monitoring recommended</li>
              <li>Regular exercise area needed</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Challenges</h2>
            <ul>
              <li>Susceptible to sunburn (requires shade)</li>
              <li>Needs good quality feed</li>
              <li>Requires proper management for optimal performance</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LargeWhite; 