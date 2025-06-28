import React, { useState, useEffect } from 'react';
import { 
  getUsers, 
  getPigBreeds, 
  getVeterinarians, 
  getDevices,
  getVetServiceRequests,
  getVaccinations,
  getVetVisitRecords,
  getPosts,
  getReports
} from '../../services/adminService';
import { 
  FaUsers, 
  FaPiggyBank, 
  FaUserMd, 
  FaTabletAlt, 
  FaClipboardList, 
  FaSyringe, 
  FaStethoscope, 
  FaComments, 
  FaFlag 
} from 'react-icons/fa';

const AdminDashboard = () => {
  console.log('AdminDashboard component rendering');

  const [stats, setStats] = useState({
    users: 0,
    pigBreeds: 0,
    veterinarians: 0,
    devices: 0,
    serviceRequests: 0,
    vaccinations: 0,
    visitRecords: 0,
    posts: 0,
    reports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    users: true,
    pigBreeds: true,
    veterinarians: true,
    devices: true,
    serviceRequests: true,
    vaccinations: true,
    visitRecords: true,
    posts: true,
    reports: true
  });

  useEffect(() => {
    console.log('AdminDashboard useEffect running');
    fetchStats();
  }, []);

  const fetchStats = async () => {
    console.log('Fetching stats...');
    try {
      setLoading(true);
      setError(null);

      const fetchData = async (endpoint, key) => {
        try {
          console.log(`Fetching ${key}...`);
          const data = await endpoint();
          console.log(`${key} data:`, data);
          setStats(prev => ({ ...prev, [key]: data.length }));
          setLoadingStates(prev => ({ ...prev, [key]: false }));
        } catch (err) {
          console.error(`Error fetching ${key}:`, err);
          setLoadingStates(prev => ({ ...prev, [key]: false }));
        }
      };

      await Promise.all([
        fetchData(getUsers, 'users'),
        fetchData(getPigBreeds, 'pigBreeds'),
        fetchData(getVeterinarians, 'veterinarians'),
        fetchData(getDevices, 'devices'),
        fetchData(getVetServiceRequests, 'serviceRequests'),
        fetchData(getVaccinations, 'vaccinations'),
        fetchData(getVetVisitRecords, 'visitRecords'),
        fetchData(getPosts, 'posts'),
        fetchData(getReports, 'reports')
      ]);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, loading }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of system statistics and activities</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={FaUsers}
          loading={loadingStates.users}
        />
        <StatCard
          title="Pig Breeds"
          value={stats.pigBreeds}
          icon={FaPiggyBank}
          loading={loadingStates.pigBreeds}
        />
        <StatCard
          title="Veterinarians"
          value={stats.veterinarians}
          icon={FaUserMd}
          loading={loadingStates.veterinarians}
        />
        <StatCard
          title="Devices"
          value={stats.devices}
          icon={FaTabletAlt}
          loading={loadingStates.devices}
        />
        <StatCard
          title="Service Requests"
          value={stats.serviceRequests}
          icon={FaClipboardList}
          loading={loadingStates.serviceRequests}
        />
        <StatCard
          title="Vaccinations"
          value={stats.vaccinations}
          icon={FaSyringe}
          loading={loadingStates.vaccinations}
        />
        <StatCard
          title="Visit Records"
          value={stats.visitRecords}
          icon={FaStethoscope}
          loading={loadingStates.visitRecords}
        />
        <StatCard
          title="Community Posts"
          value={stats.posts}
          icon={FaComments}
          loading={loadingStates.posts}
        />
        <StatCard
          title="Reports"
          value={stats.reports}
          icon={FaFlag}
          loading={loadingStates.reports}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Activity logs will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 