import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const PigHealthAndDevices = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Pig Health Monitoring Devices</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Use Health Monitoring Devices?</h2>
        <p>
          Modern devices help farmers monitor pig health, detect problems early, and improve productivity. Technology makes it easier to track vital signs, behavior, and environmental conditions.
        </p>
      </section>
      <section className="breed-section">
        <h2>Types of Pig Health Devices</h2>
        <ul>
          <li>Wearable sensors for temperature, heart rate, and activity</li>
          <li>RFID tags for identification and tracking</li>
          <li>Automated weighing systems</li>
          <li>Environmental monitors (temperature, humidity, air quality)</li>
          <li>Video surveillance for behavior monitoring</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Benefits</h2>
        <ul>
          <li>Early detection of illness or stress</li>
          <li>Improved record keeping and traceability</li>
          <li>Better management of feeding and environment</li>
          <li>Reduced labor and improved efficiency</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Choose devices suitable for your farm size and needs</li>
          <li>Train staff to use and maintain devices</li>
          <li>Regularly calibrate and service equipment</li>
          <li>Integrate data with farm management systems</li>
        </ul>
      </section>
    </div>
  </div>
);

export default PigHealthAndDevices; 