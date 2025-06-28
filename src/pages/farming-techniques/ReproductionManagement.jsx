import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const ReproductionManagement = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Reproduction Management</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Reproduction Management Matters</h2>
        <p>
          Effective reproduction management is key to maximizing piglet production, improving herd genetics, and ensuring the profitability of a pig farm. Good management practices help reduce piglet mortality and increase litter size.
        </p>
      </section>
      <section className="breed-section">
        <h2>Key Aspects of Reproduction Management</h2>
        <ul>
          <li>Proper selection of breeding stock (healthy sows and boars)</li>
          <li>Monitoring heat cycles and timely mating</li>
          <li>Artificial insemination or natural mating</li>
          <li>Pregnancy diagnosis and care of pregnant sows</li>
          <li>Proper farrowing management and piglet care</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Keep accurate breeding and farrowing records</li>
          <li>Provide balanced nutrition for breeding animals</li>
          <li>Maintain good hygiene in breeding and farrowing areas</li>
          <li>Monitor sows for signs of heat and pregnancy</li>
          <li>Assist with farrowing if necessary and care for newborn piglets</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Common Challenges</h2>
        <ul>
          <li>Missed heat cycles or poor heat detection</li>
          <li>Low conception rates</li>
          <li>Piglet mortality due to poor farrowing management</li>
          <li>Inbreeding and genetic problems</li>
        </ul>
      </section>
    </div>
  </div>
);

export default ReproductionManagement; 