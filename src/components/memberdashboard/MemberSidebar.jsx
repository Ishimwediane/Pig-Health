import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaCalendarAlt, FaFileAlt, FaCog, FaSignOutAlt, FaMicrochip, FaUserCircle, FaUsersCog, FaHeartbeat, FaHospital, FaComments } from "react-icons/fa";


const MemberSidebar = ({ isOpen, onClose, userName }) => {
    const navigate = useNavigate(); // Use navigate for redirection

    // Handle Logout
    const handleLogout = () => {
        // Clear all authentication and user data from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        
        // Clear any other app-specific data
        localStorage.removeItem("selectedPig");
        localStorage.removeItem("deviceData");
        
        // Close the sidebar
        onClose();
        
        // Redirect to login page
        navigate("/login");
    };

    const handleLinkClick = () => {
        onClose(); // Close the sidebar when a link is clicked
    };

    return (
        <div
            className={`fixed top-0 right-0 w-64 h-full bg-white mt-4 shadow-lg transition-transform duration-300 flex flex-col ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } z-50`}
        >
            {/* Header */}
            <div className="flex items-center p-4 border-b">
                <div className="bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center">
                    {/* User avatar placeholder */}
                </div>
                <span className="ml-3 font-semibold">{userName || "User"}</span>
                <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700 text-xl transition-colors">✖</button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto">
                <ul className="py-2">
                    <li>
                        <Link
                            to="/FarmerDashboard"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaHome className="text-gray-500" size={16} /> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/pighealth"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaHeartbeat className="text-gray-500" size={16} /> My Pig's Health
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/devices"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaMicrochip className="text-gray-500" size={16} /> Device Management
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/vetservices"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaHospital className="text-gray-500" size={16} /> Veterinary Services
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/community"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaComments className="text-gray-500" size={16} /> Community
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FaUserCircle className="text-gray-500" size={16} /> My Profile
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Logout Button - Fixed at bottom */}
            <div className="border-t p-4">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                    <FaSignOutAlt className="text-gray-500" size={16} /> Logout
                </button>
            </div>
        </div>
    );
};

export default MemberSidebar;
