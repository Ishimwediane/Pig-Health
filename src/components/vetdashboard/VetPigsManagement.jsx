import React, { useState, useEffect } from 'react';
import {
  getVetPigsUnderCare,
  getVetHistory,
  getVaccinationRecords,
  updatePigHealthStatus,
  removePigFromCare
} from '../../services/vetService';
import VetLayout from './VetLayout';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaEye, 
  FaFileMedical, 
  FaSyringe,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaPiggyBank,
  FaCalendarAlt
} from 'react-icons/fa';

const VetPigsManagement = () => {
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPig, setSelectedPig] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    health_status: ''
  });

  useEffect(() => {
    fetchPigsUnderCare();
  }, []);

  const fetchPigsUnderCare = async () => {
    try {
      setLoading(true);
      const response = await getVetPigsUnderCare();
      console.log('Response from getVetPigsUnderCare:', response);
      
      if (response.status === 'success' && response.data && Array.isArray(response.data.pigs)) {
        setPigs(response.data.pigs);
      } else {
        setError('Failed to load pigs data: Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching pigs:', err);
      setError(err.message || 'Failed to load pigs data');
    } finally {
      setLoading(false);
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

  const filteredAndSortedPigs = pigs
    .filter(pig => {
      const matchesSearch = 
        pig.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pig.breed?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pig.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || pig.health_status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aValue = a[sortBy]?.toLowerCase() || '';
      const bValue = b[sortBy]?.toLowerCase() || '';
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const handleAddPig = () => {
    setSelectedPig(null);
    setFormData({
      name: '',
      breed: '',
      age: '',
      weight: '',
      health_status: ''
    });
    setIsModalVisible(true);
  };

  const handleEditPig = (pig) => {
    setSelectedPig(pig);
    setFormData({
      name: pig.name,
      breed: pig.breed?.name || '',
      age: pig.age,
      weight: pig.weight,
      health_status: pig.health_status
    });
    setIsModalVisible(true);
  };

  const handleDeletePig = async (pigId) => {
    if (window.confirm('Are you sure you want to remove this pig from your care?')) {
      try {
        await removePigFromCare(pigId);
        alert('Pig removed from care successfully');
        fetchPigsUnderCare();
      } catch (err) {
        alert('Failed to remove pig from care');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPig) {
        await updatePigHealthStatus(selectedPig.id, formData.health_status);
        alert('Pig health status updated successfully');
      }
      setIsModalVisible(false);
      fetchPigsUnderCare();
    } catch (err) {
      console.error('Form submission failed:', err);
      alert('Failed to update pig health status');
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pigs Under Care</h1>
          <p className="text-gray-600">Manage and monitor pigs that you have accepted for care</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pigs..."
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
                <option value="healthy">Healthy</option>
                <option value="sick">Sick</option>
                <option value="recovering">Recovering</option>
                <option value="under_observation">Under Observation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pigs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <FaSort className={`text-gray-400 ${sortBy === 'name' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('breed')}
                  >
                    <div className="flex items-center gap-2">
                      Breed
                      <FaSort className={`text-gray-400 ${sortBy === 'breed' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('farmer_name')}
                  >
                    <div className="flex items-center gap-2">
                      Farmer
                      <FaSort className={`text-gray-400 ${sortBy === 'farmer_name' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('age')}
                  >
                    <div className="flex items-center gap-2">
                      Age
                      <FaSort className={`text-gray-400 ${sortBy === 'age' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('weight')}
                  >
                    <div className="flex items-center gap-2">
                      Weight
                      <FaSort className={`text-gray-400 ${sortBy === 'weight' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('health_status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <FaSort className={`text-gray-400 ${sortBy === 'health_status' ? 'text-blue-500' : ''}`} />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPigs.map((pig) => (
                  <tr key={pig.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaPiggyBank className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{pig.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{pig.breed?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-500">{pig.farmer_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{pig.age} months</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{pig.weight} kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pig.health_status === 'healthy' ? 'bg-green-100 text-green-800' :
                        pig.health_status === 'sick' ? 'bg-red-100 text-red-800' :
                        pig.health_status === 'recovering' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {pig.health_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditPig(pig)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Update Health Status"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeletePig(pig.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Remove from Care"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAndSortedPigs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No pigs found under your care</p>
          </div>
        )}

        {/* Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                Update Pig Health Status
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Breed</label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.breed}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Health Status</label>
                    <select
                      name="health_status"
                      value={formData.health_status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="healthy">Healthy</option>
                      <option value="sick">Sick</option>
                      <option value="recovering">Recovering</option>
                      <option value="under_observation">Under Observation</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalVisible(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Status
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

export default VetPigsManagement; 