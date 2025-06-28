import React from 'react';
import './PigBreedPage.css';

const Landrace = () => {
  return (
    <div className="pig-breed-page">
      <div className="breed-header profile-layout">
        <div className="breed-image">
          <img src="/images/pig-breeds/landrace.jpg" alt="Landrace Pig" />
        </div>
        <div className="breed-profile-card">
          <h2>Breed Profile</h2>
          <ul>
            <li>Long, white body with large drooping ears</li>
            <li>Excellent mothering abilities</li>
            <li>High fertility rates</li>
            <li>High-quality bacon production</li>
            <li>Good feed conversion</li>
            <li>Adaptable to various climates</li>
            <li>Requires spacious housing</li>
          </ul>
        </div>
      </div>

      <div className="breed-content">
        <section className="breed-section">
          <h2>Overview</h2>
          <p>
            The Landrace pig is a Danish breed known for its excellent mothering abilities and high-quality bacon production. 
            It's characterized by its long body and large, drooping ears, making it one of the most recognizable pig breeds.
            Landrace pigs are widely used in Rwanda for both breeding and pork production. 
            They are prized for their ability to produce large, healthy litters and grow quickly when managed properly.
          </p>
        </section>

        <section className="breed-sectionp">
          <h2>Performance</h2>
          <div className="performance-metrics">
            <div className="metric">
              <h3>Growth Rate</h3>
              <p>650-850g per day</p>
            </div>
            <div className="metric">
              <h3>Mature Weight</h3>
              <p>Boars: 280-320kg</p>
              <p>Sows: 230-280kg</p>
            </div>
            <div className="metric">
              <h3>Litter Size</h3>
              <p>11-13 piglets per litter</p>
            </div>
          </div>
        </section>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Characteristics</h2>
            <ul>
              <li>Long, white body with large drooping ears</li>
              <li>Excellent mothering abilities</li>
              <li>High fertility rates</li>
              <li>Good feed conversion ratio</li>
              <li>Known for high-quality bacon production</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Farming Benefits</h2>
            <ul>
              <li>High litter sizes and excellent maternal instincts</li>
              <li>Good feed-to-meat conversion rate</li>
              <li>Well-suited for crossbreeding</li>
              <li>Popular in commercial pig production systems</li>
              <li>Fast growth and high carcass yield</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Advantages</h2>
            <ul>
              <li>Excellent mothering abilities</li>
              <li>High-quality bacon production</li>
              <li>Good feed conversion efficiency</li>
              <li>High fertility rates</li>
              <li>Good temperament</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Disadvantages</h2>
            <ul>
              <li>Susceptible to stress and heat</li>
              <li>Needs careful breeding to avoid deformities</li>
              <li>More prone to leg issues due to long bodies</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Management Requirements</h2>
            <ul>
              <li>Requires good quality feed with balanced nutrition</li>
              <li>Needs spacious housing due to long body length</li>
              <li>Regular health monitoring essential</li>
              <li>Proper ventilation in housing facilities</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Challenges</h2>
            <ul>
              <li>Requires more space due to long body</li>
              <li>Needs careful management of feed</li>
              <li>Susceptible to stress in poor conditions</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Landrace; 