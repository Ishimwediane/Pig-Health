import React, { useState, useEffect } from 'react';
import VetLayout from './VetLayout';
import { 
  getVetServiceRequests, 
  acceptServiceRequest, 
  rejectServiceRequest, 
  completeServiceRequest 
} from '../../services/vetService';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaPiggyBank
} from 'react-icons/fa';

const VetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('requested_date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getVetServiceRequests();
      console.log('Service requests response:', response);
      
      if (Array.isArray(response)) {
        setRequests(response);
      } else if (response.success && Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        setRequests([]);
        setError('Invalid response format from server');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to fetch service requests. Please try again later.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      switch (action) {
        case 'accept':
          await acceptServiceRequest(requestId);
          break;
        case 'reject':
          await rejectServiceRequest(requestId, 'Rejected by veterinarian');
          break;
        case 'complete':
          await completeServiceRequest(requestId, { notes: 'Service completed' });
          break;
        default:
          throw new Error('Invalid action');
      }
      fetchRequests();
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      alert(`Failed to ${action} request`);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedRequests = requests
    .filter(request => {
      const matchesSearch = 
        request.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.pig?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aValue = a[sortBy]?.toLowerCase() || '';
      const bValue = b[sortBy]?.toLowerCase() || '';
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Service Requests</h1>
          <p className="text-gray-600">Manage veterinary service requests from farmers</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('purpose')}
                  >
                    <div className="flex items-center gap-2">
                      Service Type
                      <FaSort className={`text-gray-400 ${sortBy === 'purpose' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('farmer')}
                  >
                    <div className="flex items-center gap-2">
                      Farmer
                      <FaSort className={`text-gray-400 ${sortBy === 'farmer' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('pig')}
                  >
                    <div className="flex items-center gap-2">
                      Pig
                      <FaSort className={`text-gray-400 ${sortBy === 'pig' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('scheduled_time')}
                  >
                    <div className="flex items-center gap-2">
                      Requested Date
                      <FaSort className={`text-gray-400 ${sortBy === 'scheduled_time' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <FaSort className={`text-gray-400 ${sortBy === 'status' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          request.urgency_level === 'emergency' ? 'bg-red-100' :
                          request.urgency_level === 'high' ? 'bg-red-100' :
                          request.urgency_level === 'medium' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <FaExclamationTriangle className={`${
                            request.urgency_level === 'emergency' ? 'text-red-600' :
                            request.urgency_level === 'high' ? 'text-red-600' :
                            request.urgency_level === 'medium' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.purpose}</div>
                          <div className="text-sm text-gray-500">{request.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{request.farmer?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaPiggyBank className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{request.pig?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(request.scheduled_time).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleRequestAction(request.id, 'accept')}
                              className="text-green-600 hover:text-green-900"
                              title="Accept Request"
                            >
                              <FaCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRequestAction(request.id, 'reject')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Request"
                            >
                              <FaTimes className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {request.status === 'accepted' && (
                          <button
                            onClick={() => handleRequestAction(request.id, 'complete')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <FaCheck className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAndSortedRequests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No service requests found matching your criteria</p>
          </div>
        )}
      </div>
    </VetLayout>
  );
};

export default VetRequests; 