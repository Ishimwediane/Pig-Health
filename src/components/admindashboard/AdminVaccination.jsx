import React, { useState, useEffect } from 'react';
import { getVaccinations } from '../../services/adminService';
import { FaEye } from 'react-icons/fa';

const AdminVaccination = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVaccinations();
      console.log('Vaccinations response:', response);
      setVaccinations(response.vaccinations || []);
    } catch (err) {
      console.error('Error fetching vaccinations:', err);
      setError(err.message || 'Failed to load vaccinations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const handleViewDetails = (vaccination) => {
    setSelectedVaccination(vaccination);
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vaccination Records</h1>
          <p className="text-gray-600">View and manage vaccination records</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Vaccinations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Given</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administered By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vaccinations && vaccinations.length > 0 ? (
              vaccinations.map((vaccination) => (
                <tr key={vaccination.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{vaccination.vaccine_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(vaccination.date_given)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(vaccination.next_due_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vaccination.administered_by}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vaccination.batch_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vaccination.status)}`}>
                      {vaccination.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(vaccination)}
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
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No vaccination records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedVaccination && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Vaccination Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vaccine Information</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Name: {selectedVaccination.vaccine_name}<br />
                    Batch Number: {selectedVaccination.batch_number}<br />
                    Manufacturer: {selectedVaccination.manufacturer}<br />
                    Status: {selectedVaccination.status}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dates</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Date Given: {formatDate(selectedVaccination.date_given)}<br />
                    Next Due Date: {formatDate(selectedVaccination.next_due_date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Administration</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Administered By: {selectedVaccination.administered_by}<br />
                    Notes: {selectedVaccination.notes}
                  </p>
                </div>
                {selectedVaccination.document_path && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Document</label>
                    <a 
                      href={`/storage/${selectedVaccination.document_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedVaccination.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedVaccination.updated_at)}</p>
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

export default AdminVaccination; 