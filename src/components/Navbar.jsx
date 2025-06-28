import React, { useEffect, useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { VscAccount } from 'react-icons/vsc';
import './Navbar.css';
import MemberSidebar from './memberdashboard/MemberSidebar';

import axios from 'axios';


const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use effect hook to update the user from localStorage
 useEffect(() => {
  const storedUser = localStorage.getItem('userName');
  if (storedUser) {
    setUser(storedUser);
  }
}, []);  // This ensures the navbar checks the stored user on mount

 const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        setUser(""); // Clear user state
        setIsAccountOpen(false);
        setIsSidebarOpen(false); // Close sidebar on logout
        navigate("/"); // Redirect to Home page
        window.location.reload()
    };

  const handleDropdownClick = (menu) => {
    console.log('Dropdown clicked:', menu); // Debug log
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleDropdownItemClick = () => {
    console.log('Dropdown item clicked'); // Debug log
    setActiveDropdown(null);
  };
  const handleContactUsClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/about') {
      navigate('/about');
      setTimeout(() => {
        if (window.scrollToContactUs) window.scrollToContactUs();
      }, 300);
    } else {
      if (window.scrollToContactUs) window.scrollToContactUs();
    }
  };

  return (
    <>
      <nav className="navbar z-30">
        <div className="container">
          {/* Top Row: Logo and Search */}
          <div className="top-row">
            <Link to="/" className="brand">
              <span className="brand-name text-[#B08968]">PigHealth</span>
              <span className="brand-subtitle text-[#B08968]">Rwanda</span>
            </Link>

            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
                aria-label="Search"
              />
              <FaSearch className="search-icon" aria-hidden="true" />
            </div>
          </div>

          {/* Bottom Row: Navigation and User */}
          <div className="bottom-row">
            <div className="nav-menu">
              <Link to="/" className="nav-link text-[#B08968] hover:text-[#B08968]/80">Home</Link>

              <div
                className={`nav-item ${activeDropdown === 'farming' ? 'active' : ''}`}
                onClick={() => handleDropdownClick('farming')}
              >
                <button 
                  className="nav-link text-[#B08968] hover:text-[#B08968]/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('farming');
                  }}
                >
                  Pig Farming <span className="arrow" aria-hidden="true">▾</span>
                </button>
                {activeDropdown === 'farming' && (
                  <>
                    <div 
                      className="dropdown-backdrop" 
                      onClick={() => setActiveDropdown(null)}
                      aria-hidden="true"
                    />
                    <div className="dropdown-menu" role="menu">
                      <div className="dropdown-section">
                        <h3>Pig Breeds</h3>
                        <Link 
                          to="/pig-breeds/large-white" 
                          onClick={(e) => {
                            console.log('Large White link clicked!');
                            handleDropdownItemClick();
                          }} 
                          role="menuitem"
                        >
                          Large White
                        </Link>
                        <Link 
                          to="/pig-breeds/landrace" 
                          onClick={(e) => {
                            console.log('Landrace link clicked!');
                            handleDropdownItemClick();
                          }} 
                          role="menuitem"
                        >
                          Landrace
                        </Link>
                        <Link 
                          to="/pig-breeds/duroc" 
                          onClick={(e) => {
                            console.log('Duroc link clicked!');
                            handleDropdownItemClick();
                          }} 
                          role="menuitem"
                        >
                          Duroc
                        </Link>
                        <Link 
                          to="/pig-breeds/pietrain" 
                          onClick={(e) => {
                            console.log('Pietrain link clicked!');
                            handleDropdownItemClick();
                          }} 
                          role="menuitem"
                        >
                          Pietrain
                        </Link>
                        <Link 
                          to="/pig-breeds/camborough" 
                          onClick={(e) => {
                            console.log('Camborough link clicked!');
                            handleDropdownItemClick();
                          }} 
                          role="menuitem"
                        >
                          Camborough
                        </Link>
                      </div>
                      <div className="dropdown-section">
                        <h3>Farming Techniques</h3>
                        <Link to="/farming-techniques/housing" onClick={handleDropdownItemClick} role="menuitem">Housing</Link>
                        <Link to="/farming-techniques/feeding" onClick={handleDropdownItemClick} role="menuitem">Feeding</Link>
                        <Link to="/farming-techniques/reproduction-management" onClick={handleDropdownItemClick} role="menuitem">Reproduction Management</Link>
                        <Link to="/farming-techniques/waste-management" onClick={handleDropdownItemClick} role="menuitem">Waste Management</Link>
                        <Link to="/farming-techniques/free-range-pig-farming" onClick={handleDropdownItemClick} role="menuitem">Free-Range Pig Farming</Link>
                      </div>
                      <div className="dropdown-section">
                        <h3>Pig Health and Diseases</h3>
                        <Link to="/farming-techniques/common-diseases" onClick={handleDropdownItemClick} role="menuitem">Common Diseases</Link>
                        <Link to="/farming-techniques/health-monitoring" onClick={handleDropdownItemClick} role="menuitem">Health Monitoring</Link>
                        <Link to="/farming-techniques/vaccination" onClick={handleDropdownItemClick} role="menuitem">Vaccination</Link>
                        <Link to="/farming-techniques/veterinary-services" onClick={handleDropdownItemClick} role="menuitem">Veterinary Services</Link>
                        <Link to="/farming-techniques/biosecurity" onClick={handleDropdownItemClick} role="menuitem">Biosecurity</Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div
                className={`nav-item ${activeDropdown === 'shop' ? 'active' : ''}`}
                onClick={() => handleDropdownClick('shop')}
              >
                <button 
                  className="nav-link text-[#B08968] hover:text-[#B08968]/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('shop');
                  }}
                >
                  Medicine and Supplies <span className="arrow" aria-hidden="true">▾</span>
                </button>
                {activeDropdown === 'shop' && (
                  <>
                    <div 
                      className="dropdown-backdrop" 
                      onClick={() => setActiveDropdown(null)}
                      aria-hidden="true"
                    />
                    <div className="dropdown-menu" role="menu">
                    <div className="dropdown-section">
                  <Link to="/medicine-supplies/pig-feed-and-medicine">Pig Feed and Medicine</Link>
                  <Link to="/medicine-supplies/veterinary-medicine">Veterinary Medicines</Link>
                  <Link to="/medicine-supplies/equipment-and-farm-supplies">Equipment and Farm Supplies</Link>
                  <Link to="/medicine-supplies/nutritional-supplements">Nutritional Supplements</Link>
                  <Link to="/medicine-supplies/pig-health-and-devices">Pig Health Monitoring Devices</Link>
                </div>
                    </div>
                  </>
                )}
              </div>

              <div
                className={`nav-item ${activeDropdown === 'about' ? 'active' : ''}`}
                onClick={() => handleDropdownClick('about')}
              >
                <button 
                  className="nav-link text-[#B08968] hover:text-[#B08968]/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('about');
                  }}
                >
                  Elements <span className="arrow" aria-hidden="true">▾</span>
                </button>
                {activeDropdown === 'about' && (
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <Link to="/about">About Us</Link>
                  <a href="#contact-us" onClick={handleContactUsClick}>Contact Us</a>
                  <a href="#faq-section" onClick={e => {
                    e.preventDefault();
                    if (location.pathname !== '/about') {
                      navigate('/about');
                      setTimeout(() => {
                        if (window.scrollToFAQ) window.scrollToFAQ();
                      }, 300);
                    } else {
                      if (window.scrollToFAQ) window.scrollToFAQ();
                    }
                  }}>FAQ</a>
                  {/* <a href="#">Testimonials</a> */}
                  {/* <a href="#">News and Updates</a> */}
                </div>
              </div>
            )}
              </div>

              <Link to="/government-policies" className="nav-link text-[#B08968] hover:text-[#B08968]/80">Government policies</Link>
            </div>

            {/* User Section */}
            <div className="user-section">
              {user ? (
                <div className="flex items-center gap-3">
                  <button 
                    className="p-2 rounded-full hover:bg-[#B08968]/10 hover:text-[#B08968] text-[#B08968] transition-colors"
                    aria-label="Notifications"
                  >
                    <IoMdNotificationsOutline className="text-xl" />
                  </button>
                  <button 
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="p-2 rounded-full hover:bg-[#B08968]/10 hover:text-[#B08968] text-[#B08968] transition-colors"
                    aria-label="Account menu"
                  >
                    <VscAccount className="text-xl" />
                  </button>
                  <button 
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="user-name text-[#B08968]"
                  >
                    {user}
                  </button>
                </div>
              ) : (
                <Link 
                  to="/signup" 
                  className="inline-flex items-center px-4 py-2 rounded-full bg-[#B08968] text-white hover:bg-[#B08968]/90 transition-colors"
                >
                  Sign In / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Account Sidebar Backdrop - Lower z-index */}
      {isAccountOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
          onClick={() => setIsAccountOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Account Sidebar - Same z-index as navbar */}
      <MemberSidebar
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        userName={user}
        handleLogout={handleLogout}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
};

export default Navbar;
