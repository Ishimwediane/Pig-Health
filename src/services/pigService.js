import axios from 'axios';

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

export const pigService = {
  // Pig Management
  getAllPigs: async () => {
    const response = await API.get('/pigs');
    return response.data;
  },

  getPigById: async (id) => {
    const response = await API.get(`/pigs/${id}`);
    return response.data;
  },

  createPig: async (pigData) => {
    const response = await API.post('/pigs', pigData);
    return response.data;
  },

  deletePig: async (id) => {
    const response = await API.delete(`/pigs/${id}`);
    return response.data;
  },

  // Health Records
  getHealthRecords: async (pigId) => {
    const response = await API.get(`/health/pig/${pigId}`);
    return response.data;
  },

  createHealthRecord: async (healthData) => {
    const response = await API.post('/health', healthData);
    return response.data;
  },

  // Pig Breeds
  getPigBreeds: async () => {
    const response = await API.get('/pig-breeds');
    return response.data;
  }
}; 