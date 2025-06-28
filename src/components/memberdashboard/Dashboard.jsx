import React, { useEffect, useState } from "react";
import { fetchDashboardData, getAllPigs, fetchHealthRecords, fetchVaccinationRecords } from "../../services/dashboardService";
import AddPigModal from "./AddPigModal";
import MemberSidebar from "./MemberSidebar";
import { FaPiggyBank, FaHeartbeat, FaCalendarCheck, FaExclamationTriangle } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalPigs: 0,
    sickPigs: 0,
    healthAlerts: [],
    vaccinationsDue: 0,
    upcomingVisits: [],
    pigs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPigModal, setShowAddPigModal] = useState(false);
  const [selectedPig, setSelectedPig] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [iotData, setIotData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateToken = (token) => {
      try {
        const decoded = jwtDecode(token);
        if (!decoded || !decoded.sub) {
          console.error("Invalid token format");
          return null;
        }
        return decoded;
      } catch (error) {
        console.error("Token validation failed:", error);
        return null;
      }
    };

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get token and validate it
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate('/login');
          return;
        }

        const decodedToken = validateToken(token);
        if (!decodedToken) {
          console.log("Invalid token, redirecting to login");
          localStorage.removeItem("authToken");
          navigate('/login');
          return;
        }

        // Set user data from token
        const userData = {
          id: decodedToken.sub,
          name: decodedToken.name || 'User',
          email: decodedToken.email
        };
        setUser(userData);

        console.log("Fetching dashboard data for user:", userData);
        const data = await fetchDashboardData(decodedToken.sub);
        console.log("Dashboard data received:", data);
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        
        if (error.response?.status === 401) {
          console.log("Unauthorized access, redirecting to login");
          localStorage.removeItem("authToken");
          navigate('/login');
        } else if (error.response?.status === 404) {
          setError("Some data could not be loaded. Please try again later.");
        } else {
          setError("An error occurred while loading the dashboard. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleAddPig = () => {
    setShowAddPigModal(true);
  };

  const handlePigAdded = async () => {
    setShowAddPigModal(false);
    const data = await fetchDashboardData(user.id);
    setDashboardData(data);
  };

  const handlePigSelect = async (pig) => {
    setSelectedPig(pig);
    try {
      const healthData = await fetchHealthRecords(pig.id);
      const vaccinationData = await fetchVaccinationRecords(pig.id);
      setHealthRecords(healthData);
      setVaccinationRecords(vaccinationData);
      // Simulate IoT data (replace with actual API call)
      setIotData({
        temperature: 38.5,
        heartbeat: 75,
        activity: "Normal",
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to load pig details:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your pig farm</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Pigs</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{dashboardData.totalPigs}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaPiggyBank className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Sick Pigs</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{dashboardData.sickPigs}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaHeartbeat className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Vaccinations Due</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{dashboardData.vaccinationsDue}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCalendarCheck className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming Visits</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{dashboardData.upcomingVisits.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCalendarCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Health Alerts Section */}
      {dashboardData.healthAlerts.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-red-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Health Alerts</h2>
          </div>
          <div className="space-y-4">
            {dashboardData.healthAlerts.map((alert, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-red-800">
                  <span className="font-semibold">{alert.pigName}</span>: {alert.issue}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Visits Section */}
      {dashboardData.upcomingVisits.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Veterinary Visits</h2>
          <div className="space-y-4">
            {dashboardData.upcomingVisits.map((visit, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-800 font-semibold">
                      {new Date(visit.date).toLocaleDateString()}
                    </p>
                    <p className="text-blue-600">{visit.purpose}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {visit.status || "Scheduled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {dashboardData.pigs.slice(0, 5).map((pig) => (
            <div key={pig.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-4">
                  <FaPiggyBank className="text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{pig.name}</p>
                  <p className="text-sm text-gray-600">
                    {pig.health_status || "Healthy"} • Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                pig.health_status?.toLowerCase().includes("sick")
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {pig.health_status || "Healthy"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pigs Grid */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Pigs</h2>
          <button
            onClick={handleAddPig}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Add New Pig
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.pigs.map((pig) => (
            <div
              key={pig.id}
              onClick={() => handlePigSelect(pig)}
              className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{pig.name}</h3>
                  <p className="text-gray-600">Age: {pig.age} years</p>
                  <p className="text-gray-600">Breed: {pig.breed?.name || "Unknown"}</p>
                  <p className="text-gray-600">Weight: {pig.weight || "N/A"} kg</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  pig.health_status?.toLowerCase().includes("sick") 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {pig.health_status || "Healthy"}
                </span>
              </div>
              
              {/* IoT Data Preview */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Latest IoT Data</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Temperature:</span>
                    <span className="ml-2">{iotData.temperature || "N/A"}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Heartbeat:</span>
                    <span className="ml-2">{iotData.heartbeat || "N/A"} bpm</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Pig Details Modal */}
      {selectedPig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedPig.name}'s Details</h2>
              <button
                onClick={() => setSelectedPig(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Health Records */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Health Records</h3>
              {healthRecords.length > 0 ? (
                <div className="space-y-3">
                  {healthRecords.map((record, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Date: {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-800">{record.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No health records available</p>
              )}
            </div>

            {/* Vaccination Records */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Vaccination Records</h3>
              {vaccinationRecords.length > 0 ? (
                <div className="space-y-3">
                  {vaccinationRecords.map((record, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {record.vaccine_name} - {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-800">Status: {record.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No vaccination records available</p>
              )}
            </div>

            {/* IoT Data */}
            <div>
              <h3 className="text-lg font-semibold mb-3">IoT Device Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-lg font-semibold">{iotData.temperature || "N/A"}°C</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Heartbeat</p>
                  <p className="text-lg font-semibold">{iotData.heartbeat || "N/A"} bpm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Activity</p>
                  <p className="text-lg font-semibold">{iotData.activity || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-lg font-semibold">
                    {iotData.lastUpdated ? new Date(iotData.lastUpdated).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddPigModal && (
        <AddPigModal
          onClose={() => setShowAddPigModal(false)}
          onSubmit={handlePigAdded}
        />
      )}
    </div>
  );
};

export default Dashboard; 