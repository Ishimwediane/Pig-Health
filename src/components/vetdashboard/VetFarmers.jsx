import React, { useState, useEffect } from 'react';
import VetLayout from './VetLayout';
import axios from 'axios';
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPiggyBank, FaCalendarAlt } from 'react-icons/fa';

const VetFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/vet/farmers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setFarmers(response.data.farmers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch farmers data');
      setLoading(false);
      console.error('Error fetching farmers:', err);
    }
  };

  const filteredFarmers = farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <VetLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </VetLayout>
    );
  }

  if (error) {
    return (
      <VetLayout>
        <div className="flex justify-center items-center h-screen text-red-600">
          {error}
        </div>
      </VetLayout>
    );
  }

  return (
    <VetLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Farmers Under Care</h1>
          <p className="text-gray-600">Manage and communicate with farmers under your veterinary care</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Farmers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <div key={farmer.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{farmer.name}</h3>
                  <p className="text-sm text-gray-600">{farmer.farm_name}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-gray-400" /> {farmer.phone}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" /> {farmer.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" /> {farmer.location}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaPiggyBank className="text-gray-400" /> {farmer.total_pigs} Pigs
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" /> Joined {new Date(farmer.joined_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Profile
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Send Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No farmers found matching your search</p>
          </div>
        )}
      </div>
    </VetLayout>
  );
};

export default VetFarmers; 