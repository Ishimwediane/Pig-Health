import React, { useState, useEffect } from 'react';
import { getPigBreeds, createPigBreed, updatePigBreed, deletePigBreed } from '../../services/adminService';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const AdminBreeds = () => {
  console.log('AdminBreeds component rendering');
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBreed, setEditingBreed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    console.log('AdminBreeds useEffect running');
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      console.log('Fetching breeds...');
      setLoading(true);
      setError(null);
      const response = await getPigBreeds();
      console.log('Breeds response:', response);
      
      // Handle different response formats
      let breedsData = [];
      if (Array.isArray(response)) {
        breedsData = response;
      } else if (response && Array.isArray(response.data)) {
        breedsData = response.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        breedsData = response.data.data;
      } else {
        console.error('Invalid breeds data format:', response);
        setError('Failed to load breeds: Invalid data format');
      }
      
      setBreeds(breedsData);
    } catch (err) {
      console.error('Error fetching breeds:', err);
      setError(err.message || 'Failed to load breeds');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      // Log the form data before submission
      console.log('Form data before submission:', formData);

      // Validate required fields
      if (!formData.name || !formData.description) {
        setError('Please fill in all required fields');
        return;
      }

      const breedData = {
        name: formData.name,
        description: formData.description,
        image: formData.image || null
      };

      console.log('Submitting breed data:', breedData);

      if (editingBreed) {
        await updatePigBreed(editingBreed.id, breedData);
      } else {
        await createPigBreed(breedData);
      }
      
      setShowModal(false);
      setEditingBreed(null);
      setFormData({
        name: '',
        description: '',
        image: ''
      });
      fetchBreeds();
    } catch (err) {
      console.error('Error saving breed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save breed');
    }
  };

  const handleEdit = (breed) => {
    setEditingBreed(breed);
    setFormData({
      name: breed.name,
      description: breed.description,
      image: breed.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (breedId) => {
    if (window.confirm('Are you sure you want to delete this breed?')) {
      try {
        await deletePigBreed(breedId);
        fetchBreeds();
      } catch (err) {
        console.error('Error deleting breed:', err);
        setError('Failed to delete breed');
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pig Breeds Management</h1>
          <p className="text-gray-600">Manage pig breeds and their characteristics</p>
        </div>
        <button
          onClick={() => {
            setEditingBreed(null);
            setFormData({
              name: '',
              description: '',
              image: ''
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Breed
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search breeds..."
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

      {/* Breeds Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBreeds && filteredBreeds.length > 0 ? (
              filteredBreeds.map((breed) => (
                <tr key={breed.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{breed.name}</td>
                  <td className="px-6 py-4">{breed.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {breed.image ? (
                      <img src={breed.image} alt={breed.name} className="h-10 w-10 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(breed)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(breed.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No breeds found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Breed Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingBreed ? 'Edit Breed' : 'Add New Breed'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    rows="3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter image URL (optional)"
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
                    {editingBreed ? 'Update' : 'Create'}
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

export default AdminBreeds; 