import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VetLayout from './VetLayout';

const VetDataTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testEndpoints();
  }, []);

  const testEndpoints = async () => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const endpoints = [
      { name: 'Dashboard Stats', url: '/api/vet/dashboard/stats' },
      { name: 'Recent Activities', url: '/api/vet/dashboard/activities' },
      { name: 'Vet Requests', url: '/api/vet/requests' },
      { name: 'Visit History', url: '/api/vet-visits/history' },
      { name: 'Vaccination Records', url: '/api/vaccination-records' }
    ];

    const results = {};

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000${endpoint.url}`, { headers });
        results[endpoint.name] = {
          status: 'success',
          data: response.data
        };
      } catch (err) {
        results[endpoint.name] = {
          status: 'error',
          error: err.response?.data || err.message
        };
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <VetLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Testing Vet Data Endpoints...</h2>
          <div className="animate-pulse">Loading...</div>
        </div>
      </VetLayout>
    );
  }

  return (
    <VetLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Vet Data Endpoint Test Results</h2>
        <div className="space-y-4">
          {Object.entries(testResults).map(([name, result]) => (
            <div key={name} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              {result.status === 'success' ? (
                <div>
                  <div className="text-green-600 mb-2">✓ Success</div>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <div className="text-red-600 mb-2">✗ Error</div>
                  <pre className="bg-red-50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </VetLayout>
  );
};

export default VetDataTest; 