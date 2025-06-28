import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const Vaccination = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Vaccination</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Vaccination Matters</h2>
        <p>
          Vaccination is a key tool in preventing infectious diseases in pigs, reducing mortality, and improving herd productivity. It helps protect both animal and public health.
        </p>
      </section>
      <section className="breed-section">
        <h2>Common Vaccines for Pigs</h2>
        <ul>
          <li>Classical Swine Fever (CSF)</li>
          <li>Porcine Reproductive and Respiratory Syndrome (PRRS)</li>
          <li>Foot and Mouth Disease (FMD)</li>
          <li>Erysipelas</li>
          <li>Mycoplasma hyopneumoniae (Enzootic pneumonia)</li>
          <li>Parvovirus (for breeding sows)</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Vaccination Schedule</h2>
        <ul>
          <li>Follow local veterinary guidelines for timing and dosage</li>
          <li>Start vaccinations in piglets as early as 2-3 weeks old</li>
          <li>Booster shots as recommended by a vet</li>
          <li>Record all vaccinations for each animal</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use only approved vaccines and store them properly</li>
          <li>Use clean, sterile equipment for injections</li>
          <li>Observe pigs for side effects after vaccination</li>
          <li>Consult a veterinarian for a tailored vaccination program</li>
        </ul>
      </section>
    </div>
  </div>
);

export default Vaccination; 