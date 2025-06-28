import React from 'react';
import { FaUniversity, FaFlask, FaMoneyBillWave, FaChartLine, FaSchool, FaShieldAlt } from 'react-icons/fa';
import './GovernmentPolicies.css';

const GovernmentPolicies = () => (
  <div className="gov-policies-page">
    <h1 className="gov-title">Rwanda Government Policies for Modern Pig Farming</h1>
    <p className="gov-intro">
      Rwanda has implemented several government policies to modernize and expand its pig farming sector, aiming to meet growing domestic and export demands while enhancing food security and farmer incomes. Here's an overview of key initiatives:
    </p>

    <section className="gov-section">
      <h2><FaUniversity className="gov-icon" /> Infrastructure Development</h2>
      <ul>
        <li><strong>Modern Slaughterhouses:</strong> Rwf1.3 billion invested in 10 modern pig abattoirs across districts (Ruhango, Huye, Nyamagabe, etc.), each processing up to 50 pigs daily for hygienic standards and pork quality.</li>
        <li><strong>Value Chain Enhancement:</strong> Abattoirs serve as collection centers, streamlining pork distribution and reducing informal slaughtering.</li>
      </ul>
    </section>

    <section className="gov-section">
      <h2><FaFlask className="gov-icon" /> Genetic Improvement & Breeding Programs</h2>
      <ul>
        <li><strong>Artificial Insemination (AI):</strong> Since 2021, 65% of pig farmers have adopted AI to improve breed quality and productivity. The goal is to modernize 85% of operations by 2029.</li>
        <li><strong>Government Support:</strong> RAB allocates Rwf150 million annually for AI programs, technician training, and equipment.</li>
      </ul>
    </section>

    <section className="gov-section">
      <h2><FaMoneyBillWave className="gov-icon" /> Financial Support & Subsidies</h2>
      <ul>
        <li><strong>Reduced Loan Interest Rates:</strong> Subsidized loans with rates as low as 8% for pig/poultry farmers and feed producers.</li>
        <li><strong>Feed Innovation:</strong> Research into alternative feeds (black soldier flies, sweet potato vines) to cut costs and boost sustainability.</li>
      </ul>
    </section>

    <section className="gov-section">
      <h2><FaChartLine className="gov-icon" /> Production Targets & Market Expansion</h2>
      <ul>
        <li><strong>Pork Production Goals:</strong> Target to increase pork production from 22,839 tonnes (2023) to 31,144 tonnes (2029), a 36% growth.</li>
        <li><strong>Export Growth:</strong> Meat exports (including pork) rose to $22.3M in 2022/23, up from $8.8M the previous year.</li>
      </ul>
    </section>

    <section className="gov-section">
      <h2><FaSchool className="gov-icon" /> Integration into School Feeding Programs</h2>
      <ul>
        <li><strong>Nutritional Initiatives:</strong> Plans to include pork in school feeding programs to combat malnutrition and stimulate local demand. Schools are encouraged to start pig-rearing projects.</li>
      </ul>
    </section>

    <section className="gov-section">
      <h2><FaShieldAlt className="gov-icon" /> Animal Health & Biosecurity</h2>
      <ul>
        <li><strong>Disease Control:</strong> Targeted vaccination campaigns in response to swine erysipelas outbreaks to prevent disease spread and ensure herd health.</li>
      </ul>
    </section>
  </div>
);

export default GovernmentPolicies; 