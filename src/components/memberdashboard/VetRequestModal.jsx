import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getFarmerPigs } from '../../services/vetService';

const VetRequestModal = ({ vet, onClose, onSubmit }) => {
  const [pigs, setPigs] = useState([]);
  const [formData, setFormData] = useState({
    farmer_id: '',
    pig_id: '',
    purpose: '',
    scheduled_time: '',
    urgency_level: 'medium',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPig, setSelectedPig] = useState(null);

  useEffect(() => {
    loadPigs();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        farmer_id: user.id
      }));
    }
  }, []);

  const loadPigs = async () => {
    try {
      setIsLoading(true);
      const pigsData = await getFarmerPigs();
      console.log('Loaded pigs:', pigsData);
      setPigs(pigsData.pigs || []);
    } catch (error) {
      setError('Failed to load pigs. Please try again.');
      console.error('Error loading pigs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'pig_id') {
      const pig = pigs.find(p => p.id === parseInt(value));
      setSelectedPig(pig);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Get farmer ID from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      setError('User data not found');
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(userData);
    const farmer_id = parseInt(user.id);

    // Validate required fields
    if (!farmer_id) {
      setError('Farmer ID is required');
      setIsLoading(false);
      return;
    }

    if (!formData.pig_id) {
      setError('Please select a pig');
      setIsLoading(false);
      return;
    }

    if (!formData.purpose) {
      setError('Please enter the purpose of visit');
      setIsLoading(false);
      return;
    }

    if (!formData.scheduled_time) {
      setError('Please select a date and time');
      setIsLoading(false);
      return;
    }

    if (!formData.description) {
      setError('Please provide details about the issue');
      setIsLoading(false);
      return;
    }

    try {
      // Format the data for submission with all required fields
      const requestData = {
        farmer_id: farmer_id,
        vet_id: parseInt(vet.id),
        pig_id: parseInt(formData.pig_id),
        purpose: formData.purpose.trim(),
        scheduled_time: new Date(formData.scheduled_time).toISOString(),
        urgency_level: formData.urgency_level.toLowerCase(),
        description: formData.description.trim(),
        status: 'pending'
      };

      // Create a new FormData object to ensure all fields are sent
      const requestFormData = new FormData();
      Object.keys(requestData).forEach(key => {
        requestFormData.append(key, requestData[key]);
      });

      console.log('VetRequestModal - Submitting request with data:', requestData);
      await onSubmit(requestData);
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error submitting request:', error);
      setError(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Request Veterinary Service</h2>
            <p className="text-sm text-gray-600">Dr. {vet.user?.name || vet.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farmer ID
              </label>
              <input
                type="text"
                name="farmer_id"
                value={formData.farmer_id}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-50"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Pig
              </label>
              <select
                name="pig_id"
                value={formData.pig_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              >
                <option value="">Select a pig</option>
                {pigs.map(pig => (
                  <option key={pig.id} value={pig.id}>
                    {pig.name} - {pig.breed?.name || 'Unknown breed'} ({pig.age} months)
                  </option>
                ))}
              </select>
            </div>

            {selectedPig && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Selected Pig Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedPig.name}</p>
                  <p><span className="font-medium">Breed:</span> {selectedPig.breed?.name || 'Unknown'}</p>
                  <p><span className="font-medium">Age:</span> {selectedPig.age} months</p>
                  <p><span className="font-medium">Weight:</span> {selectedPig.weight} kg</p>
                  <p><span className="font-medium">Health Status:</span> {selectedPig.health_status || 'Unknown'}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Visit
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Regular checkup, Emergency, etc."
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date & Time
              </label>
              <input
                type="datetime-local"
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                name="urgency_level"
                value={formData.urgency_level}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              >
                <option value="low">Low - Routine Check</option>
                <option value="medium">Medium - Non-Emergency</option>
                <option value="high">High - Urgent</option>
                <option value="emergency">Emergency - Immediate Attention</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Please provide details about the issue or reason for the visit..."
                required
                disabled={isLoading}
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetRequestModal; 