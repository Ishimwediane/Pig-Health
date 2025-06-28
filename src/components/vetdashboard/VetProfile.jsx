import React, { useState, useEffect } from 'react';
import VetLayout from './VetLayout';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import axios from 'axios';

const VetProfile = () => {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    email_verified_at: null,
    role: '',
    profile_image: null,
    location: null,
    created_at: '',
    updated_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile response:', response.data); // Debug log
      
      if (response.data.success && response.data.data) {
        setProfile(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile. Please try again later.');
      setLoading(false);
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Veterinarian Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    {profile.profile_image ? (
                      <img
                        src={profile.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.name}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
                  />
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
                  />
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
                  />
                  <FaIdCard className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.location || 'Not specified'}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Account Information */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Created
                    </label>
                    <p className="text-gray-600">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-600">
                      {new Date(profile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Verification
                    </label>
                    <p className="text-gray-600">
                      {profile.email_verified_at ? 'Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VetLayout>
  );
};

export default VetProfile; 