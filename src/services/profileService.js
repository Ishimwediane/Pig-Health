import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to handle authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getProfile = async () => {
  try {
    const response = await API.get('/auth/profile');
    if (response.data.success) {
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
        profile_image: response.data.data.profile_image,
        location: response.data.data.location,
        email_verified_at: response.data.data.email_verified_at,
        created_at: response.data.data.created_at,
        updated_at: response.data.data.updated_at
      };
    }
    throw new Error(response.data.message || 'Failed to fetch profile');
  } catch (error) {
    console.error('Failed to fetch profile:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await API.put('/auth/profile', profileData);
    if (response.data.success) {
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        role: response.data.data.role,
        profile_image: response.data.data.profile_image,
        location: response.data.data.location,
        email_verified_at: response.data.data.email_verified_at,
        created_at: response.data.data.created_at,
        updated_at: response.data.data.updated_at
      };
    }
    throw new Error(response.data.message || 'Failed to update profile');
  } catch (error) {
    console.error('Failed to update profile:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateFarmInfo = async (farmData) => {
  try {
    const response = await API.put('/profile/farm', farmData);
    return response.data;
  } catch (error) {
    console.error("Failed to update farm info:", error.response?.data || error.message);
    throw error;
  }
}; 