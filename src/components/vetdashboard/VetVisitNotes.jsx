import React, { useState, useEffect } from 'react';
import VetLayout from './VetLayout';
import { 
  getVisitRecords, 
  createVisitRecord, 
  updateVisitRecord, 
  deleteVisitRecord,
  getVetPigsUnderCare,
  getVetServiceRequests
} from '../../services/vetService';
import { FaSearch, FaFilter, FaPiggyBank, FaUser, FaCalendarAlt, FaStethoscope, FaPlus, FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';

const VetVisitNotes = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [pigs, setPigs] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [newVisit, setNewVisit] = useState({
    vet_service_request_id: '',
    vet_id: '',
    pig_id: '',
    visit_time: '',
    notes: '',
    prescriptions: '',
    recommendations: ''
  });

  useEffect(() => {
    fetchVisits();
    fetchPigs();
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      const response = await getVetServiceRequests();
      setServiceRequests(response || []);
    } catch (err) {
      console.error('Error fetching service requests:', err);
    }
  };

  const fetchPigs = async () => {
    try {
      const response = await getVetPigsUnderCare();
      setPigs(response.data.pigs || []);
    } catch (err) {
      console.error('Error fetching pigs:', err);
    }
  };

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await getVisitRecords();
      console.log('Visit records response:', response);
      setVisits(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch visit records');
      console.error('Error fetching visits:', err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    try {
      // Get vet_id from the token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Extract user ID from JWT token
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Full decoded token:', decodedToken);
      
      // Get the vet_id from the sub field
      const vet_id = decodedToken.sub;
      console.log('Extracted vet_id from token:', vet_id, 'Type:', typeof vet_id);

      if (!vet_id) {
        throw new Error('User ID not found in token');
      }

      if (!newVisit.vet_service_request_id || !newVisit.pig_id || !newVisit.visit_time) {
        throw new Error('Please fill in all required fields');
      }

      // Format the data exactly as required by the API
      const visitData = {
        vet_service_request_id: parseInt(newVisit.vet_service_request_id),
        vet_id: parseInt(vet_id),
        pig_id: parseInt(newVisit.pig_id),
        visit_time: newVisit.visit_time,
        notes: newVisit.notes || '',
        prescriptions: newVisit.prescriptions || '',
        recommendations: newVisit.recommendations || ''
      };

      // Log the final data being sent
      console.log('Final visit data being sent:', {
        ...visitData,
        vet_id_type: typeof visitData.vet_id,
        vet_id_value: visitData.vet_id
      });

      const response = await createVisitRecord(visitData);
      console.log('Create visit response:', response);
      
      setShowAddModal(false);
      setNewVisit({
        vet_service_request_id: '',
        vet_id: '',
        pig_id: '',
        visit_time: '',
        notes: '',
        prescriptions: '',
        recommendations: ''
      });
      fetchVisits();
    } catch (err) {
      console.error('Error adding visit:', err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError(err.message || 'Failed to create visit record. Please try again.');
      }
    }
  };

  const handleDeleteVisit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visit record?')) return;
    
    try {
      await deleteVisitRecord(id);
      fetchVisits();
    } catch (err) {
      console.error('Error deleting visit:', err);
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.pig?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.prescriptions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.service_request?.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Visit Records</h1>
            <p className="text-gray-600">Manage and track veterinary visit records</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Add Visit
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search visits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Visit Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaStethoscope className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {visit.service_request?.purpose || 'Visit Record'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <FaPiggyBank className="inline mr-2" />
                      {visit.pig?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <FaUser className="inline mr-2" />
                      Farmer ID: {visit.service_request?.farmer_id}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  visit.service_request?.urgency_level === 'high' ? 'bg-red-100 text-red-800' :
                  visit.service_request?.urgency_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {visit.service_request?.urgency_level || 'low'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  Visit Time: {new Date(visit.visit_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Service Request:</span> {visit.service_request?.description}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {visit.notes}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Prescriptions:</span> {visit.prescriptions}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Recommendations:</span> {visit.recommendations}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> {visit.service_request?.status}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteVisit(visit.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVisits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No visit records found matching your criteria</p>
          </div>
        )}

        {/* Add Visit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add Visit Record</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleAddVisit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Request *
                    </label>
                    <select
                      value={newVisit.vet_service_request_id}
                      onChange={(e) => {
                        const request = serviceRequests.find(r => r.id === parseInt(e.target.value));
                        setNewVisit({
                          ...newVisit,
                          vet_service_request_id: e.target.value,
                          pig_id: request?.pig_id || ''
                        });
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a service request</option>
                      {serviceRequests.map(request => (
                        <option key={request.id} value={request.id}>
                          {request.purpose} - {request.pig?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pig *
                    </label>
                    <select
                      value={newVisit.pig_id}
                      onChange={(e) => setNewVisit({...newVisit, pig_id: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a pig</option>
                      {pigs.map(pig => (
                        <option key={pig.id} value={pig.id}>
                          {pig.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visit Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={newVisit.visit_time}
                      onChange={(e) => setNewVisit({...newVisit, visit_time: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={newVisit.notes}
                      onChange={(e) => setNewVisit({...newVisit, notes: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prescriptions
                    </label>
                    <textarea
                      value={newVisit.prescriptions}
                      onChange={(e) => setNewVisit({...newVisit, prescriptions: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recommendations
                    </label>
                    <textarea
                      value={newVisit.recommendations}
                      onChange={(e) => setNewVisit({...newVisit, recommendations: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Record
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setError(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </VetLayout>
  );
};

export default VetVisitNotes; 