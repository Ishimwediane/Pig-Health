import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const VeterinaryServices = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Veterinary Services</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Veterinary Services Matter</h2>
        <p>
          Access to veterinary services is essential for maintaining pig health, preventing disease outbreaks, and ensuring food safety. Vets provide expert care, advice, and emergency support for your herd.
        </p>
      </section>
      <section className="breed-section">
        <h2>Types of Veterinary Services</h2>
        <ul>
          <li>Routine health checks and disease diagnosis</li>
          <li>Vaccination and parasite control programs</li>
          <li>Emergency care and treatment of sick animals</li>
          <li>Reproductive management and artificial insemination</li>
          <li>Advice on nutrition, housing, and biosecurity</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>When to Call a Vet</h2>
        <ul>
          <li>Sudden illness or death in pigs</li>
          <li>Unusual symptoms or persistent health problems</li>
          <li>Outbreaks of disease or high mortality</li>
          <li>Assistance with farrowing or breeding</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Establish a relationship with a local veterinarian</li>
          <li>Keep accurate health and treatment records</li>
          <li>Follow veterinary advice for disease prevention</li>
          <li>Train staff in basic animal health care</li>
        </ul>
      </section>
    </div>
  </div>
);

export default VeterinaryServices; 