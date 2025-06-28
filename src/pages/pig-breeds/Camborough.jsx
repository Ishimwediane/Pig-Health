import React from 'react';
import './PigBreedPage.css';

const Camborough = () => {
  return (
    <div className="pig-breed-page">
      <div className="breed-header profile-layout">
        <div className="breed-image">
          <img src="/images/pig-breeds/camborough.png" alt="Camborough Pig" />
        </div>
        <div className="breed-profile-card">
          <h2>Breed Profile</h2>
          <ul>
            <li>Modern hybrid breed</li>
            <li>Excellent reproductive performance</li>
            <li>Good growth rate</li>
            <li>High feed conversion efficiency</li>
            <li>Good mothering abilities</li>
            <li>Adaptable to various farming conditions</li>
            <li>Requires good management practices</li>
          </ul>
        </div>
      </div>

      <div className="breed-content">
        <section className="breed-section">
          <h2>Overview</h2>
          <p>
            The Camborough is a genetically engineered commercial sow line developed by PIC, widely used in industrial pork production. 
            It is popular in Rwanda due to its excellent mothering ability, fertility, and low mortality rate. 
            Farmers value it for its productivity, especially in intensive breeding programs.
          </p>
        </section>

        <section className="breed-sectionp">
          <h2>Performance</h2>
          <div className="performance-metrics">
            <div className="metric">
              <h3>Growth Rate</h3>
              <p>750-950g per day</p>
            </div>
            <div className="metric">
              <h3>Mature Weight</h3>
              <p>Boars: 290-330kg</p>
              <p>Sows: 240-290kg</p>
            </div>
            <div className="metric">
              <h3>Litter Size</h3>
              <p>12-14 piglets per litter</p>
            </div>
          </div>
        </section>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Characteristics</h2>
            <ul>
              <li>White color with good body conformation</li>
              <li>Excellent mothering abilities</li>
              <li>High fertility rates</li>
              <li>Good feed conversion efficiency</li>
              <li>Adaptable to various climates</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Farming Benefits</h2>
            <ul>
              <li>High reproductive efficiency (large litters)</li>
              <li>Low piglet mortality</li>
              <li>Fast growth in offspring</li>
              <li>Efficient feed conversion</li>
              <li>Good maternal traits and easy farrowing</li>
              <li>Performs well in structured breeding systems</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Advantages</h2>
            <ul>
              <li>Excellent reproductive performance</li>
              <li>Good growth rate</li>
              <li>High feed conversion efficiency</li>
              <li>Good mothering abilities</li>
              <li>Adaptable to various farming conditions</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Disadvantages</h2>
            <ul>
              <li>Higher cost due to hybrid breeding</li>
              <li>May require specific management systems</li>
              <li>Not commonly used for backyard farming</li>
            </ul>
          </section>
        </div>

        <div className="breed-section-row">
          <section className="breed-section">
            <h2>Management Requirements</h2>
            <ul>
              <li>Requires balanced nutrition for optimal performance</li>
              <li>Needs proper housing with good ventilation</li>
              <li>Regular health monitoring essential</li>
              <li>Proper biosecurity measures needed</li>
            </ul>
          </section>

          <section className="breed-section">
            <h2>Challenges</h2>
            <ul>
              <li>Requires good management practices</li>
              <li>Needs proper nutrition for optimal performance</li>
              <li>Regular health monitoring required</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Camborough; 