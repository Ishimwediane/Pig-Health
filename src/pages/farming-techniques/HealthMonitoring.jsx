import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const HealthMonitoring = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Health Monitoring</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Health Monitoring Matters</h2>
        <p>
          Regular health monitoring helps detect diseases early, improves pig welfare, and increases farm productivity. It is essential for preventing outbreaks and ensuring food safety.
        </p>
      </section>
      <section className="breed-section">
        <h2>Key Aspects of Health Monitoring</h2>
        <ul>
          <li>Daily observation of pigs for signs of illness</li>
          <li>Monitoring feed and water intake</li>
          <li>Checking for abnormal behavior or appearance</li>
          <li>Recording health data and treatments</li>
          <li>Regular weighing and growth tracking</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Common Signs of Health Problems</h2>
        <ul>
          <li>Loss of appetite or reduced feed intake</li>
          <li>Coughing, sneezing, or labored breathing</li>
          <li>Diarrhea or abnormal droppings</li>
          <li>Lameness or difficulty walking</li>
          <li>Skin lesions, wounds, or hair loss</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Train staff to recognize early signs of disease</li>
          <li>Keep accurate health records for each pig</li>
          <li>Isolate and treat sick animals promptly</li>
          <li>Consult a veterinarian for regular check-ups</li>
          <li>Maintain good hygiene and biosecurity</li>
        </ul>
      </section>
    </div>
  </div>
);

export default HealthMonitoring; 