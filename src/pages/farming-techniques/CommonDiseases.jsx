import React from 'react';
import '../pig-breeds/PigBreedPage.css';

const CommonDiseases = () => (
  <div className="pig-breed-page">
    <div className="breed-header">
      <h1>Common Pig Diseases</h1>
    </div>
    <div className="breed-content">
      <section className="breed-section">
        <h2>Why Disease Awareness Matters</h2>
        <p>
          Recognizing and managing common pig diseases is crucial for maintaining herd health, reducing losses, and ensuring food safety. Early detection and prevention are key to successful pig farming.
        </p>
      </section>
      <section className="breed-section">
        <h2>Common Pig Diseases</h2>
        <ul>
          <li><strong>Swine Fever:</strong> Highly contagious viral disease causing fever, loss of appetite, and high mortality.</li>
          <li><strong>Foot and Mouth Disease:</strong> Causes blisters, lameness, and reduced productivity.</li>
          <li><strong>Porcine Reproductive and Respiratory Syndrome (PRRS):</strong> Affects reproduction and causes respiratory issues.</li>
          <li><strong>Erysipelas:</strong> Causes skin lesions, fever, and joint pain.</li>
          <li><strong>Worm infestations:</strong> Lead to poor growth and digestive problems.</li>
          <li><strong>Scours (diarrhea):</strong> Common in piglets, can be fatal if untreated.</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>Prevention and Control</h2>
        <ul>
          <li>Vaccinate pigs according to veterinary guidelines</li>
          <li>Maintain strict biosecurity and hygiene</li>
          <li>Isolate sick animals immediately</li>
          <li>Regular deworming and parasite control</li>
          <li>Provide clean water and balanced nutrition</li>
        </ul>
      </section>
      <section className="breed-section">
        <h2>When to Call a Vet</h2>
        <ul>
          <li>Sudden deaths or rapid spread of illness</li>
          <li>Unusual symptoms or persistent health issues</li>
          <li>Outbreaks affecting multiple animals</li>
        </ul>
      </section>
    </div>
  </div>
);

export default CommonDiseases; 