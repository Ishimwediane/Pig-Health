import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const Biosecurity = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Biosecurity</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Biosecurity Matters</h2>
        <p>
          Biosecurity is the practice of preventing the introduction and spread of diseases on a pig farm. Good biosecurity protects animal health, farm profits, and public safety.
        </p>
      </section>
      <section className="breed-section">
        <h2>Key Biosecurity Measures</h2>
        <ul>
          <li>Limit farm access to essential personnel only</li>
          <li>Disinfect footwear, hands, and equipment before entry</li>
          <li>Quarantine new or returning pigs before mixing with the herd</li>
          <li>Control rodents, insects, and wild animals</li>
          <li>Use clean water and feed sources</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Maintain perimeter fencing and secure gates</li>
          <li>Keep detailed visitor and animal movement records</li>
          <li>Train staff on biosecurity protocols</li>
          <li>Regularly clean and disinfect pig housing and equipment</li>
          <li>Dispose of dead animals safely and promptly</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Responding to Disease Outbreaks</h2>
        <ul>
          <li>Isolate affected animals immediately</li>
          <li>Contact a veterinarian for diagnosis and advice</li>
          <li>Increase cleaning and disinfection measures</li>
          <li>Review and strengthen biosecurity protocols</li>
        </ul>
      </section>
    </div>
  </div>
);

export default Biosecurity; 