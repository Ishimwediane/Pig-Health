import React, { useEffect, useState } from "react";
import { fetchBreeds, createPig } from "../../services/dashboardService";
import { FaTimes } from "react-icons/fa";

const AddPigModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    breed_id: "",
    health_status: "",
    weight: ""
  });

  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        setIsLoadingBreeds(true);
        setError("");
        const response = await fetchBreeds();
        console.log('Breeds data:', response); // Debug log
        if (Array.isArray(response)) {
          setBreeds(response);
        } else if (response && Array.isArray(response.data)) {
          setBreeds(response.data);
        } else {
          console.error('Invalid breeds data format:', response);
          setError("Failed to load pig breeds. Invalid data format.");
          setBreeds([]);
        }
      } catch (error) {
        console.error('Error loading breeds:', error);
        setError("Failed to load pig breeds. Please try again.");
        setBreeds([]);
      } finally {
        setIsLoadingBreeds(false);
      }
    };
    loadBreeds();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await createPig(form);
      onSubmit();
      onClose();
    } catch (error) {
      setError("Failed to create pig. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Add New Pig</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 overflow-y-auto flex-grow">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter pig's name"
              />
            </div>

            {/* Age Field */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age (years)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                required
                min="0"
                step="0.1"
                value={form.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter age"
              />
            </div>

            {/* Weight Field */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter weight"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Breed Selection */}
            <div>
              <label htmlFor="breed_id" className="block text-sm font-medium text-gray-700 mb-1">
                Breed
              </label>
              <select
                id="breed_id"
                name="breed_id"
                required
                value={form.breed_id}
                onChange={handleChange}
                disabled={isLoadingBreeds}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
              >
                <option value="">{isLoadingBreeds ? "Loading breeds..." : "Select Breed"}</option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Health Status */}
            <div>
              <label htmlFor="health_status" className="block text-sm font-medium text-gray-700 mb-1">
                Health Status
              </label>
              <select
                id="health_status"
                name="health_status"
                value={form.health_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Health Status</option>
                <option value="healthy">Healthy</option>
                <option value="sick">Sick</option>
                <option value="under_observation">Under Observation</option>
                <option value="recovering">Recovering</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingBreeds}
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? "Adding..." : "Add Pig"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPigModal;