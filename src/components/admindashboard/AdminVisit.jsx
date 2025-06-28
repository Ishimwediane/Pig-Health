import React, { useState, useEffect } from 'react';
import { getVetVisitRecords } from '../../services/adminService';
import { FaEye } from 'react-icons/fa';

const AdminVisit = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVetVisitRecords();
      console.log('Visit records response:', response);
      setVisits(response);
    } catch (err) {
      console.error('Error fetching visit records:', err);
      setError(err.message || 'Failed to load visit records');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'Not set';
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vet Visit Records</h1>
          <p className="text-gray-600">View and manage veterinary visit records</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Visit Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pig Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visits && visits.length > 0 ? (
              visits.map((visit) => (
                <tr key={visit.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{visit.pig?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(visit.visit_time)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visit.service_request?.purpose}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Dr. {visit.vet?.license_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      visit.service_request?.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      visit.service_request?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visit.service_request?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(visit)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No visit records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedVisit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Visit Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pig Information</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Name: {selectedVisit.pig?.name}<br />
                    Age: {selectedVisit.pig?.age} months<br />
                    Gender: {selectedVisit.pig?.gender}<br />
                    Health Status: {selectedVisit.pig?.health_status}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Request</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Purpose: {selectedVisit.service_request?.purpose}<br />
                    Description: {selectedVisit.service_request?.description}<br />
                    Urgency Level: {selectedVisit.service_request?.urgency_level}<br />
                    Status: {selectedVisit.service_request?.status}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Visit Information</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Visit Time: {formatDateTime(selectedVisit.visit_time)}<br />
                    Notes: {selectedVisit.notes}<br />
                    Prescriptions: {selectedVisit.prescriptions}<br />
                    Recommendations: {selectedVisit.recommendations}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Veterinarian</label>
                  <p className="mt-1 text-sm text-gray-900">
                    License Number: {selectedVisit.vet?.license_number}<br />
                    Specialization: {selectedVisit.vet?.specialization || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedVisit.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedVisit.updated_at)}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVisit; 