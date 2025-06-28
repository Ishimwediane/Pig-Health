import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const VeterinaryMedicine = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Veterinary Medicine</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Role of Veterinary Medicine</h2>
        <p>
          Veterinary medicines are essential for preventing, treating, and controlling diseases in pigs. They help ensure animal welfare, food safety, and farm profitability.
        </p>
      </section>
      <section className="breed-section">
        <h2>Types of Veterinary Medicines</h2>
        <ul>
          <li>Antibiotics (for bacterial infections, use only as prescribed)</li>
          <li>Antiparasitics (dewormers, external parasite control)</li>
          <li>Vaccines (for disease prevention)</li>
          <li>Anti-inflammatories and pain relief</li>
          <li>Vitamins and mineral supplements</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Safe Use of Veterinary Medicines</h2>
        <ul>
          <li>Always follow veterinary advice and prescriptions</li>
          <li>Observe withdrawal periods before slaughter</li>
          <li>Store medicines in a cool, dry, secure place</li>
          <li>Keep records of all treatments</li>
          <li>Never use expired or unapproved products</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Consult a veterinarian for diagnosis and treatment plans</li>
          <li>Train staff in proper medicine administration</li>
          <li>Monitor pigs for side effects or treatment failure</li>
          <li>Dispose of unused medicines safely</li>
        </ul>
      </section>
    </div>
  </div>
);

export default VeterinaryMedicine; 