import React, { useState, useEffect } from 'react';
import { getVeterinarians, updateVeterinarian, deleteVeterinarian } from '../../services/vetService';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AdminVet = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVet, setEditingVet] = useState(null);
  const [formData, setFormData] = useState({
    license_number: '',
    specialization: '',
    photo: ''
  });

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVeterinarians();
      console.log('Veterinarians response:', response);
      setVeterinarians(response);
    } catch (err) {
      console.error('Error fetching veterinarians:', err);
      setError(err.message || 'Failed to load veterinarians');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVets = veterinarians.filter(vet =>
    vet.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vet.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vet.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vet.specialization && vet.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      setError(null);

      if (!formData.license_number) {
        setError('License number is required');
        return;
      }

      await updateVeterinarian(editingVet.id, formData);
      
      setShowModal(false);
      setEditingVet(null);
      setFormData({
        license_number: '',
        specialization: '',
        photo: ''
      });
      fetchVeterinarians();
    } catch (err) {
      console.error('Error updating veterinarian:', err);
      setError(err.message || 'Failed to update veterinarian');
    }
  };

  const handleEdit = (vet) => {
    setEditingVet(vet);
    setFormData({
      license_number: vet.license_number,
      specialization: vet.specialization || '',
      photo: vet.photo || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (vetId) => {
    if (window.confirm('Are you sure you want to delete this veterinarian?')) {
      try {
        await deleteVeterinarian(vetId);
        fetchVeterinarians();
      } catch (err) {
        console.error('Error deleting veterinarian:', err);
        setError('Failed to delete veterinarian');
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Veterinarian Management</h1>
          <p className="text-gray-600">Manage veterinarian profiles and information</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search veterinarians..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Veterinarians Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVets && filteredVets.length > 0 ? (
              filteredVets.map((vet) => (
                <tr key={vet.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{vet.user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vet.user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vet.license_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{vet.specialization || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(vet)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(vet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No veterinarians found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Veterinarian Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Veterinarian Details
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">License Number</label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Photo URL</label>
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVet; 