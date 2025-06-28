import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: "🐷",
      title: "Pig Breeds & Selection",
      description: "Select the best pigs for breeding to improve herd quality."
    },
    {
      icon: "🌾",
      title: "Farming Techniques",
      description: "Discover sustainable farming practices that promote healthy pigs and efficient operations."
    },
    {
      icon: "👨‍⚕️",
      title: "Veterinary Services",
      description: "Get expert veterinary care and disease management to keep your pigs healthy."
    },
    {
      icon: "📚",
      title: "Training & Education",
      description: "Access free resources, courses, and training on pig farming."
    },
    {
      icon: "🛠️",
      title: "Pig Resources",
      description: "Buy feed, equipment, and other farm supplies from trusted sources."
    }
  ];

  return (
    <div className="services-container">
      <div className="services-header">
        <h2>Why Choose Smart Pig for Your Farm?</h2>
        <p className="subtitle">click here for more info</p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">
              <span>{service.icon}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>

      <div className="vet-services-highlight">
        <div className="highlight-text">
          <p>
            We offer access to skilled veterinarians who can help with disease prevention,
            vaccinations, and treatment plans tailored to your farm. Regular health checks are
            essential for keeping your pigs healthy and productive.
          </p>
          <button className="find-vet-btn">Find a Vet</button>
        </div>
        <div className="highlight-image"> 
          <img src="/src/assets/vet-service.jpg" alt="Veterinary service" />
        </div>
      </div>
    </div>
  );
};

export default Services; 