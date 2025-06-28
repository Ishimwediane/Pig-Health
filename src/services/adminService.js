import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  }
});

// Add request interceptor to handle authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Response interceptor - Error: 401 Unauthorized');
      console.error('Response data:', error.response?.data);
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Individual named exports
export const getUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await API.post('/admin/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await API.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

// Pig Breeds Management
export const getPigBreeds = async () => {
  const response = await API.get('/admin/pig-breeds');
  return response.data;
};

export const createPigBreed = async (breedData) => {
  const response = await API.post('/admin/pig-breeds', breedData);
  return response.data;
};

export const updatePigBreed = async (id, breedData) => {
  const response = await API.put(`/admin/pig-breeds/${id}`, breedData);
  return response.data;
};

export const deletePigBreed = async (id) => {
  const response = await API.delete(`/admin/pig-breeds/${id}`);
  return response.data;
};

// Veterinarians Management
export const getVeterinarians = async () => {
  const response = await API.get('/admin/veterinarians');
  return response.data;
};

export const createVeterinarian = async (vetData) => {
  const response = await API.post('/admin/veterinarians', vetData);
  return response.data;
};

export const updateVeterinarian = async (id, vetData) => {
  const response = await API.put(`/admin/veterinarians/${id}`, vetData);
  return response.data;
};

export const deleteVeterinarian = async (id) => {
  const response = await API.delete(`/admin/veterinarians/${id}`);
  return response.data;
};

// Devices Management
export const getDevices = async () => {
  try {
    const response = await API.get('/admin/devices');
    console.log('Devices API response:', response); // Debug log
    if (!response.data) {
      throw new Error('No data received from devices endpoint');
    }
    return response.data.data || response.data; // Handle both response formats
  } catch (error) {
    console.error('Error fetching devices:', error.response?.data || error.message);
    throw error;
  }
};

export const createDevice = async (deviceData) => {
  const response = await API.post('/admin/devices', deviceData);
  return response.data;
};

export const deleteDevice = async (id) => {
  const response = await API.delete(`/admin/devices/${id}`);
  return response.data;
};

// Vet Service Requests Management
export const getVetServiceRequests = async () => {
  try {
    const token = localStorage.getItem("authToken");
    console.log('Current auth token:', token ? 'Token exists' : 'No token found');
    
    const response = await API.get('/admin/vet-service-requests');
    console.log('Service requests response:', response);
    
    // Check if response has the expected structure
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // If response doesn't match expected structure, return empty array
    console.warn('Unexpected response format:', response.data);
    return [];
  } catch (error) {
    console.error("Failed to fetch service requests:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.config?.headers
    });
    // Return empty array instead of throwing to prevent UI breakage
    return [];
  }
};

export const updateVetServiceRequest = async (id, statusData) => {
  const response = await API.patch(`/admin/vet-service-requests/${id}`, statusData);
  return response.data;
};

export const updateVetServiceRequestStatus = async (id, statusData) => {
  const response = await API.patch(`/admin/vet-service-requests/${id}/status`, statusData);
  return response.data;
};

export const deleteVetServiceRequest = async (id) => {
  const response = await API.delete(`/admin/vet-service-requests/${id}`);
  return response.data;
};

// Vaccinations Management
export const getVaccinations = async () => {
  const response = await API.get('/admin/vaccinations');
  return response.data;
};

export const createVaccination = async (vaccinationData) => {
  const response = await API.post('/admin/vaccinations', vaccinationData);
  return response.data;
};

export const updateVaccination = async (id, vaccinationData) => {
  const response = await API.put(`/admin/vaccinations/${id}`, vaccinationData);
  return response.data;
};

export const deleteVaccination = async (id) => {
  const response = await API.delete(`/admin/vaccinations/${id}`);
  return response.data;
};

// Vet Visit Records Management
export const getVetVisitRecords = async () => {
  const response = await API.get('/admin/vet-visit-records');
  return response.data;
};

export const createVetVisitRecord = async (recordData) => {
  const response = await API.post('/admin/vet-visit-records', recordData);
  return response.data;
};

export const updateVetVisitRecord = async (id, recordData) => {
  const response = await API.put(`/admin/vet-visit-records/${id}`, recordData);
  return response.data;
};

export const deleteVetVisitRecord = async (id) => {
  const response = await API.delete(`/admin/vet-visit-records/${id}`);
  return response.data;
};

// Community Posts Management
export const getPosts = async () => {
  const response = await API.get('/admin/posts');
  return response.data;
};

export const deletePost = async (id) => {
  const response = await API.delete(`/admin/posts/${id}`);
  return response.data;
};

// Reports Management
export const getReports = async () => {
  const response = await API.get('/admin/reports');
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await API.delete(`/admin/reports/${id}`);
  return response.data;
};

// Service object that includes all functions
export const adminService = {
  // Users Management
  getUsers,
  createUser,
  updateUser,
  deleteUser,

  // Pig Breeds Management
  getPigBreeds,
  createPigBreed,
  updatePigBreed,
  deletePigBreed,

  // Veterinarians Management
  getVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,

  // Devices Management
  getDevices,
  createDevice,
  deleteDevice,

  // Vet Service Requests Management
  getVetServiceRequests,
  updateVetServiceRequest,
  updateVetServiceRequestStatus,
  deleteVetServiceRequest,

  // Vaccinations Management
  getVaccinations,
  createVaccination,
  updateVaccination,
  deleteVaccination,

  // Vet Visit Records Management
  getVetVisitRecords,
  createVetVisitRecord,
  updateVetVisitRecord,
  deleteVetVisitRecord,

  // Community Posts Management
  getPosts,
  deletePost,

  // Reports Management
  getReports,
  deleteReport
}; 