import React, { useState, useEffect } from 'react';
import VetLayout from './VetLayout';
import StatCard from './StatCard';
import RecentActivity from './RecentActivity';
import SearchBar from './SearchBar';
import { vetService } from '../../services/vetService';
import { getVetDashboardStats } from '../../services/vetService';
import { FaCheckCircle, FaClock, FaHourglassHalf } from 'react-icons/fa';
import './VetDashboard.css';

const VetDashboard = () => {
  const [stats, setStats] = useState({
    completed_requests: 0,
    pending_requests: 0,
    accepted_requests: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVetDashboardStats();
      console.log('Dashboard stats response:', response);
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to load dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <VetLayout>
      <SearchBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Veterinarian Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completed Requests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Requests</p>
                <p className="text-2xl font-bold">{stats.completed_requests}</p>
              </div>
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold">{stats.pending_requests}</p>
              </div>
              <FaClock className="text-yellow-500 text-3xl" />
            </div>
          </div>

          {/* Accepted Requests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Accepted Requests</p>
                <p className="text-2xl font-bold">{stats.accepted_requests}</p>
              </div>
              <FaHourglassHalf className="text-blue-500 text-3xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="recent-activities">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </VetLayout>
  );
};

export default VetDashboard; 