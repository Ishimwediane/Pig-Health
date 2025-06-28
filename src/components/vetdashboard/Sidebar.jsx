import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaPiggyBank, 
  FaUserFriends, 
  FaCalendarAlt, 
  FaComments, 
  FaSyringe, 
  FaFileMedical, 
  FaChartBar, 
  FaUserCog, 
  FaCog,
  FaBell,
  FaClipboardList,
  FaPrescriptionBottleAlt,
  FaNotesMedical,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    // Redirect to login
    navigate('/login');
  };

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/vet-dashboard' },
    { icon: <FaPiggyBank />, label: 'Pigs Under Care', path: '/vet-dashboard/pigs' },
    { icon: <FaBell />, label: 'Vet Requests', path: '/vet-dashboard/requests' },
    { icon: <FaComments />, label: 'Chat', path: '/vet-dashboard/chat' },
    { icon: <FaSyringe />, label: 'Vaccinations', path: '/vet-dashboard/vaccinations' },
    { icon: <FaNotesMedical />, label: 'Visit Notes', path: '/vet-dashboard/visit-notes' },
    { icon: <FaUserCog />, label: 'Profile', path: '/vet-dashboard/profile' },
  ];

  return (
    <aside style={{
      width: '250px',
      background: '#ffffff',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#1a1a1a',
          margin: 0
        }}>
          PigHealth Vet
        </h1>
      </div>
      
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                color: isActive ? '#4f8cff' : '#4b5563',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive ? '#f0f5ff' : 'transparent',
                borderLeft: isActive ? '3px solid #4f8cff' : '3px solid transparent',
                ':hover': {
                  background: '#f3f4f6',
                  color: '#1a1a1a'
                }
              }}
            >
              <span style={{ 
                marginRight: '12px', 
                fontSize: '18px',
                color: isActive ? '#4f8cff' : '#4b5563'
              }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ 
        padding: '24px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '12px 24px',
            color: '#ef4444',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            borderRadius: '6px',
            ':hover': {
              background: '#fee2e2'
            }
          }}
        >
          <FaSignOutAlt style={{ marginRight: '12px', fontSize: '18px' }} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 