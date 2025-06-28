import React from 'react';
import './PigBreedPage.css';

const Pietrain = () => {
  return (
    <div className="pig-breed-page">
      <div className="breed-header profile-layout">
        <div className="breed-image">
          <img src="/images/pig-breeds/pietrain.jpg" alt="Pietrain Pig" />
        </div>
        <div className="breed-profile-card">
          <h2>Breed Profile</h2>
          <ul>
            <li>Black and white spotted pattern</li>
            <li>High lean meat percentage</li>
            <li>Excellent meat quality</li>
            <li>Muscular build</li>
            <li>Good for crossbreeding programs</li>
            <li>Stress susceptible</li>
            <li>Lower fertility compared to other breeds</li>
          </ul>
        </div>
      </div>

      <div className="breed-content">
        <section className="breed-section">
          <h2>Overview</h2>
          <p>
            Pietrain pigs are a Belgian breed famous for their extreme muscularity and lean meat production. 
            They are typically white with black spots and have a compact, stocky build. Though they require careful 
            management due to stress sensitivity, Pietrains are favored in Rwanda for crossbreeding to enhance carcass leanness.
          </p>
        </section>

        <section className="breed-sectionp">
          <h2>Performance</h2>
          <div className="performance-metrics">
            <div className="metric">
              <h3>Growth Rate</h3>
              <p>600-800g per day</p>
            </div>
            <div className="metric">
              <h3>Mature Weight</h3>
              <p>Boars: 250-300kg</p>
              <p>Sows: 220-260kg</p>
            </div>
            <div className="metric">
              <h3>Litter Size</h3>
              <p>8-10 piglets per litter</p>
            </div>
          </div>
        </section>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Characteristics</h2>
            <ul>
              <li>Black and white spotted pattern</li>
              <li>Erect ears</li>
              <li>High lean meat percentage</li>
              <li>Excellent meat quality</li>
              <li>Muscular build</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Farming Benefits</h2>
            <ul>
              <li>High lean meat yield</li>
              <li>Great for improving carcass traits in crossbreeds</li>
              <li>Strong muscles, especially in ham and loin</li>
              <li>Efficient growth with proper feeding</li>
              <li>Low fat content – ideal for lean pork markets</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Advantages</h2>
            <ul>
              <li>High lean meat percentage</li>
              <li>Excellent meat quality</li>
              <li>Good feed conversion efficiency</li>
              <li>Well-muscled carcass</li>
              <li>Good for crossbreeding programs</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Disadvantages</h2>
            <ul>
              <li>Prone to Porcine Stress Syndrome</li>
              <li>Poor meat flavor despite high leanness</li>
              <li>Not ideal for natural or pasture-based systems</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Management Requirements</h2>
            <ul>
              <li>Requires high-quality feed with balanced protein</li>
              <li>Needs proper housing with good ventilation</li>
              <li>Regular exercise area needed</li>
              <li>Careful health monitoring required</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Challenges</h2>
            <ul>
              <li>Stress susceptibility</li>
              <li>Requires careful management</li>
              <li>Lower fertility compared to other breeds</li>
              <li>Needs high-quality feed</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Pietrain; 