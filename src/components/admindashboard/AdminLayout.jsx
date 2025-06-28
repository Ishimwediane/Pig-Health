import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  FaUsers, 
  FaPiggyBank, 
  FaUserMd, 
  FaTabletAlt, 
  FaClipboardList, 
  FaSyringe, 
  FaStethoscope, 
  FaComments, 
  FaFlag, 
  FaChartBar,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/pig-breeds', icon: <FaPiggyBank />, label: 'Pig Breeds' },
    { path: '/admin/veterinarians', icon: <FaUserMd />, label: 'Veterinarians' },
    { path: '/admin/devices', icon: <FaTabletAlt />, label: 'Devices' },
    { path: '/admin/service-requests', icon: <FaClipboardList />, label: 'Service Requests' },
    { path: '/admin/vaccinations', icon: <FaSyringe />, label: 'Vaccinations' },
    
    { path: '/admin/posts', icon: <FaComments />, label: 'Community Posts' },
   
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4 flex justify-between items-center">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold text-gray-800">AP</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 