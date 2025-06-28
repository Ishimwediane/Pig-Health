import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const EquipmentAndFarmSupplies = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Equipment and Farm Supplies</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Equipment and Supplies Matter</h2>
        <p>
          The right equipment and farm supplies are essential for efficient pig farming, animal welfare, and farm hygiene. Investing in quality tools improves productivity and reduces labor.
        </p>
      </section>
      <section className="breed-section">
        <h2>Essential Equipment for Pig Farms</h2>
        <ul>
          <li>Feeders and waterers</li>
          <li>Farrowing crates and pens</li>
          <li>Weighing scales</li>
          <li>Manure handling tools</li>
          <li>Fencing and gates</li>
          <li>Disinfection and cleaning equipment</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Farm Supplies</h2>
        <ul>
          <li>Bedding materials (straw, sawdust)</li>
          <li>Protective clothing and boots</li>
          <li>First aid kits and basic medicines</li>
          <li>Record-keeping books or software</li>
          <li>Lighting and heating equipment</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Regularly clean and maintain all equipment</li>
          <li>Store supplies in a dry, secure place</li>
          <li>Replace worn or broken items promptly</li>
          <li>Train staff in safe equipment use</li>
        </ul>
      </section>
    </div>
  </div>
);

export default EquipmentAndFarmSupplies; 