import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import heroPig from '../assets/hero-pig.jpg';
import heroPig1 from '../assets/hero-pig1.jpg';
import heroPig2 from '../assets/hero-pig2.jpg';
import './Hero.css';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [heroPig, heroPig1, heroPig2];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="hero"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                    url(${images[currentImage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      <div className="hero-content">
        <div className="hero-text">
          <h1>Transforming Pig Farming with Innovation</h1>
          <p>
            Start your journey to modern pig farming with the latest technologies. 
            Discover smart solutions for your farm that improve productivity and animal welfare.
          </p>
          <button className="get-started" onClick={() => navigate('/signup')}>Get Started</button>
        </div>

        <div className="hero-links">
          <a href="/pig-breeds/large-white" className="hero-link">
            <span>Explore the Best Pig Breeds for Your Farm</span>
            <FaArrowRight />
          </a>
          <a href="/medicine-supplies/pig-health-and-devices" className="hero-link">
            <span>Healthy Pigs, Strong Community</span>
            <FaArrowRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;