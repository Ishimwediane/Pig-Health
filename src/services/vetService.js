import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Response interceptor - Error: 401 Unauthorized');
      // Optional: redirect to login or clear token
    }
    return Promise.reject(error);
  }
);

// Dashboard APIs
export const getVetDashboardStats = async () => {
  try {
    const response = await API.get('/vet/dashboard/stats');
    console.log('Dashboard stats response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error.response?.data || error.message);
    throw error;
  }
};

export const getVetDashboardActivities = async () => {
  try {
    const res = await API.get('/vet/dashboard/activities');
    // The API returns activities in res.data.data format
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch dashboard activities:", error.response?.data || error.message);
    throw error;
  }
};

// Service Requests APIs
export const getVetServiceRequests = async () => {
  try {
    const res = await API.get('/vet/service-requests');
    console.log('Service requests response:', res.data); // Debug log
    
    // Handle different response formats
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (res.data && Array.isArray(res.data.requests)) {
      return res.data.requests;
    } else {
      console.error('Unexpected service requests format:', res.data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch service requests:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return []; // Return empty array instead of throwing to prevent UI breakage
  }
};

export const getAllVetServiceRequests = async () => {
  try {
    const res = await API.get('/vet/service-requests/vet');
    console.log('Service requests response:', res.data); // Debug log
    
    // Handle different response formats
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (res.data && Array.isArray(res.data.requests)) {
      return res.data.requests;
    } else {
      console.error('Unexpected response format:', res.data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch service requests:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return []; // Return empty array instead of throwing to prevent UI breakage
  }
};

export const getVetServiceRequestDetails = async (requestId) => {
  try {
    const res = await API.get(`/vet/service-requests/${requestId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch service request details:", error.response?.data || error.message);
    throw error;
  }
};

export const acceptServiceRequest = async (requestId) => {
  try {
    const res = await API.post(`/vet/service-requests/${requestId}/accept`);
    return res.data;
  } catch (error) {
    console.error("Failed to accept service request:", error.response?.data || error.message);
    throw error;
  }
};

export const rejectServiceRequest = async (requestId, reason) => {
  try {
    const res = await API.post(`/vet/service-requests/${requestId}/reject`, { reason });
    return res.data;
  } catch (error) {
    console.error("Failed to reject service request:", error.response?.data || error.message);
    throw error;
  }
};

export const completeServiceRequest = async (requestId, data) => {
  try {
    const res = await API.post(`/vet/service-requests/${requestId}/complete`, data);
    return res.data;
  } catch (error) {
    console.error("Failed to complete service request:", error.response?.data || error.message);
    throw error;
  }
};

// Chat APIs
export const getChatMessages = async (requestId) => {
  try {
    const res = await API.get(`/vet/service-requests/${requestId}/messages`);
    console.log('Chat messages response:', res.data); // Debug log
    
    // Handle different response formats
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (res.data && Array.isArray(res.data.messages)) {
      return res.data.messages;
    } else {
      console.error('Unexpected chat messages format:', res.data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch messages:", error.response?.data || error.message);
    return []; // Return empty array instead of throwing to prevent UI breakage
  }
};

export const sendChatMessage = async (requestId, message) => {
  try {
    const res = await API.post(`/vet/service-requests/${requestId}/messages`, { message });
    console.log('Send message response:', res.data); // Debug log
    return res.data.data || res.data;
  } catch (error) {
    console.error("Failed to send message:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadChatFile = async (requestId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await API.post(`/vet/service-requests/${requestId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload file response:', res.data); // Debug log
    return res.data.data || res.data;
  } catch (error) {
    console.error("Failed to upload file:", error.response?.data || error.message);
    throw error;
  }
};

export const downloadChatFile = async (fileId) => {
  try {
    const res = await API.get(`/vet-chat-files/${fileId}/download`, {
      responseType: 'blob'
    });
    return res.data;
  } catch (error) {
    console.error("Failed to download file:", error.response?.data || error.message);
    throw error;
  }
};

export const markMessagesAsRead = async (requestId) => {
  try {
    const res = await API.post(`/vet/service-requests/${requestId}/mark-read`);
    console.log('Mark messages as read response:', res.data); // Debug log
    return res.data;
  } catch (error) {
    console.error("Failed to mark messages as read:", error.response?.data || error.message);
    // Don't throw error here as it's not critical
    return null;
  }
};

// Get vet visit history
export const getVetHistory = async () => {
  try {
    const res = await API.get('/vet/visits');
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch vet history:", error.response?.data || error.message);
    throw error;
  }
};

// Get vaccination records
export const getVaccinationRecords = async () => {
  try {
    const res = await API.get('/vet/vaccinations');
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch vaccination records:", error.response?.data || error.message);
    throw error;
  }
};

// Get pigs under vet's care
export const getVetPigsUnderCare = async () => {
  try {
    // Get all service requests and filter for accepted ones
    const response = await API.get('/vet/service-requests');
    console.log('Service requests response:', response.data);
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }
    
    // Filter for accepted requests and extract unique pigs
    const acceptedRequests = response.data.data.filter(request => request.status === 'accepted');
    const uniquePigs = acceptedRequests.reduce((pigs, request) => {
      if (request.pig && !pigs.some(p => p.id === request.pig.id)) {
        pigs.push({
          id: request.pig.id,
          name: request.pig.name,
          breed: request.pig.breed || { name: 'Unknown' },
          farmer_name: request.farmer?.name || 'Unknown Farmer',
          age: request.pig.age,
          weight: request.pig.weight,
          health_status: request.pig.health_status || 'healthy',
          request_id: request.id
        });
      }
      return pigs;
    }, []);

    return {
      status: 'success',
      data: {
        pigs: uniquePigs
      }
    };
  } catch (error) {
    console.error('Error fetching pigs under care:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch pigs under care');
  }
};

// Update pig health status
export const updatePigHealthStatus = async (pigId, healthStatus) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.put('/vet/pigs/' + pigId + '/health-status', 
      { health_status: healthStatus },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating pig health status:', error);
    throw error;
  }
};

// Remove pig from vet's care
export const removePigFromCare = async (pigId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete('/vet/pigs/' + pigId + '/remove-from-care', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing pig from care:', error);
    throw error;
  }
};

// Get all available veterinarians
export const getVeterinarians = async () => {
  try {
    console.log('Fetching veterinarians...');
    const token = localStorage.getItem('authToken');
    console.log('Auth token:', token ? 'Present' : 'Missing');
    
    const response = await API.get('/vets');
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });

    // Check if response has the expected structure
    if (Array.isArray(response.data)) {
      console.log('Response is direct array:', response.data);
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      console.log('Response has data property:', response.data.data);
      return response.data.data;
    } else {
      console.error('Unexpected response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch veterinarians:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    return [];
  }
};

export const deleteVeterinarian = async (vetId) => {
  try {
    const res = await API.delete(`/admin/veterinarians/${vetId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete veterinarian:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVeterinarian = async (vetId, updateData) => {
  try {
    const res = await API.put(`/admin/veterinarians/${vetId}`, updateData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update veterinarian:", error.response?.data || error.message);
    throw error;
  }
};

// Get farmer's pigs
export const getFarmerPigs = async () => {
  try {
    console.log('Fetching farmer pigs...');
    const response = await API.get('/pigs');
    console.log('Pigs API Response:', response.data);
    
    if (Array.isArray(response.data)) {
      return { pigs: response.data };
    } else if (response.data && Array.isArray(response.data.data)) {
      return { pigs: response.data.data };
    } else {
      console.error('Unexpected pigs response format:', response.data);
      return { pigs: [] };
    }
  } catch (error) {
    console.error("Failed to fetch farmer's pigs:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return { pigs: [] };
  }
};

// Get vet requests for the logged-in farmer
export const getFarmerRequests = async () => {
  try {
    const response = await API.get('/vet-service-requests');
    console.log('Farmer requests response:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch farmer requests:", error.response?.data || error.message);
    throw error;
  }
};

// Get vet requests for the logged-in vet
export const getVetRequests = async () => {
  try {
    const res = await API.get('/vet/requests');
    return res.data.requests;
  } catch (error) {
    console.error("Failed to fetch vet requests:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new vet service request
export const createVetRequest = async (requestData) => {
  try {
    // Get the user data from localStorage
    const userData = localStorage.getItem('user');
    console.log('User data from localStorage:', userData);
    
    if (!userData) {
      throw new Error('User data not found');
    }
    
    const user = JSON.parse(userData);
    console.log('Parsed user data:', user);
    
    if (!user || !user.id) {
      throw new Error('Invalid user data: missing user ID');
    }

    const farmer_id = parseInt(user.id);
    console.log('Farmer ID:', farmer_id);

    // Ensure all required fields are present and properly formatted
    const formattedData = {
      farmer_id: farmer_id,
      vet_id: parseInt(requestData.vet_id),
      pig_id: parseInt(requestData.pig_id),
      purpose: requestData.purpose,
      scheduled_time: requestData.scheduled_time,
      urgency_level: requestData.urgency_level,
      description: requestData.description,
      status: 'pending'
    };

    console.log('Formatted request data:', formattedData);

    // Validate required fields
    const requiredFields = ['farmer_id', 'vet_id', 'pig_id', 'purpose', 'scheduled_time', 'urgency_level', 'description'];
    const missingFields = requiredFields.filter(field => !formattedData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Make sure all fields are properly formatted
    if (isNaN(formattedData.farmer_id)) {
      throw new Error('Invalid farmer_id: must be a number');
    }
    if (isNaN(formattedData.vet_id)) {
      throw new Error('Invalid vet_id: must be a number');
    }
    if (isNaN(formattedData.pig_id)) {
      throw new Error('Invalid pig_id: must be a number');
    }

    console.log('Submitting vet request with data:', formattedData);
    const response = await API.post('/vet-service-requests', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating vet request:', error.response?.data || error);
    
    // Handle validation errors
    if (error.response?.status === 422) {
      const errorData = error.response.data;
      if (errorData.data && typeof errorData.data === 'object') {
        // Format validation errors from data object
        const errorMessage = Object.entries(errorData.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        throw new Error(errorMessage);
      } else if (errorData.message) {
        // Use the error message directly if available
        throw new Error(errorData.message);
      }
    }
    
    // Handle other types of errors
    throw new Error(error.response?.data?.message || 'Failed to create vet request');
  }
};

// Update vet request status
export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await API.patch(`/vet-service-requests/${requestId}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.error("Failed to update request status:", error.response?.data || error.message);
    throw error;
  }
};

// Reschedule vet request
export const rescheduleRequest = async (requestId, newDateTime) => {
  try {
    const res = await API.patch(`/vet-service-requests/${requestId}/reschedule`, {
      scheduled_time: newDateTime
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to reschedule request:", error.response?.data || error.message);
    throw error;
  }
};

// Get request details
export const getRequestDetails = async (requestId) => {
  try {
    const res = await API.get(`/vet-service-requests/${requestId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch request details:", error.response?.data || error.message);
    throw error;
  }
};

// Vaccination APIs
export const getVaccinations = async (pigId) => {
  if (!pigId) {
    throw new Error('Pig ID is required');
  }
  try {
    const res = await API.get(`/vet/pigs/${pigId}/vaccinations`);
    // Ensure we return an array
    return Array.isArray(res.data) ? res.data : 
           Array.isArray(res.data.data) ? res.data.data : 
           Array.isArray(res.data.vaccinations) ? res.data.vaccinations : [];
  } catch (error) {
    console.error("Failed to fetch vaccinations:", error.response?.data || error.message);
    return []; // Return empty array on error
  }
};

export const getVaccinationDetails = async (vaccinationId) => {
  if (!vaccinationId) {
    throw new Error('Vaccination ID is required');
  }
  try {
    const res = await API.get(`/vet/vaccinations/${vaccinationId}`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch vaccination details:", error.response?.data || error.message);
    throw error;
  }
};

export const createVaccination = async (vaccinationData) => {
  if (!vaccinationData.pig_id) {
    throw new Error('Pig ID is required');
  }
  try {
    // Create FormData for file upload
    const formData = new FormData();
    Object.keys(vaccinationData).forEach(key => {
      if (key === 'document' && vaccinationData[key]) {
        formData.append('document', vaccinationData[key]);
      } else {
        formData.append(key, vaccinationData[key]);
      }
    });

    const res = await API.post(`/vet/pigs/${vaccinationData.pig_id}/vaccinations`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to create vaccination:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVaccination = async (vaccinationId, vaccinationData) => {
  if (!vaccinationId) {
    throw new Error('Vaccination ID is required');
  }
  try {
    // Create FormData for file upload
    const formData = new FormData();
    Object.keys(vaccinationData).forEach(key => {
      if (key === 'document' && vaccinationData[key]) {
        formData.append('document', vaccinationData[key]);
      } else {
        formData.append(key, vaccinationData[key]);
      }
    });

    const res = await API.put(`/vet/vaccinations/${vaccinationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to update vaccination:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteVaccination = async (vaccinationId) => {
  if (!vaccinationId) {
    throw new Error('Vaccination ID is required');
  }
  try {
    const res = await API.delete(`/vet/vaccinations/${vaccinationId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete vaccination:", error.response?.data || error.message);
    throw error;
  }
};

// Add this new function after getVaccinations
export const getAllVaccinations = async () => {
  try {
    const res = await API.get('/vet/vaccinations');
    console.log("Vaccinations data:", res.data.data.vaccinations); // Now this will show the array
    return res.data.data.vaccinations || [];
  } catch (error) {
    console.error("Failed to fetch all vaccinations:", error.response?.data || error.message);
    return [];
  }
};

export const createVisitRecord = async (visitData) => {
  try {
    const res = await API.post('/vet/visits', visitData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to create visit record:", error.response?.data || error.message);
    throw error;
  }
};

export const getVisitRecords = async () => {
  try {
    const res = await API.get('/vet/visits');
    return res.data.data || [];
  } catch (error) {
    console.error("Failed to fetch visit records:", error.response?.data || error.message);
    return []; // Return empty array on error to prevent UI breakage
  }
};

export const updateVisitRecord = async (recordId, updateData) => {
  try {
    const res = await API.put(`/vet/visits/${recordId}`, updateData);
    return res.data.data;
  } catch (error) {
    console.error("Failed to update visit record:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteVisitRecord = async (recordId) => {
  try {
    const res = await API.delete(`/vet/visits/${recordId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete visit record:", error.response?.data || error.message);
    throw error;
  }
};

export const getFarmerHistory = async (farmerId) => {
  try {
    const res = await API.get(`/vet/visits/farmer/${farmerId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch farmer's visit history:", error.response?.data || error.message);
    throw error;
  }
};

export const getUpcomingVisits = async () => {
  try {
    const res = await API.get('/vet/service-requests/upcoming');
    return res.data;
  } catch (error) {
    console.error("Failed to fetch upcoming visits:", error.response?.data || error.message);
    throw error;
  }
};

export const getVisitHistory = async () => {
  try {
    const res = await API.get('/vet/visits');
    return res.data;
  } catch (error) {
    console.error("Failed to fetch visit history:", error.response?.data || error.message);
    throw error;
  }
};

export const getAcceptedRequests = async () => {
  try {
    const res = await API.get('/vet/service-requests/accepted');
    return res.data;
  } catch (error) {
    console.error("Failed to fetch accepted requests:", error.response?.data || error.message);
    throw error;
  }
};

// Farmer Chat APIs
export const getFarmerChatMessages = async (requestId) => {
  try {
    const res = await API.get(`/vet-service-requests/service-requests/${requestId}/messages`);
    console.log('Farmer chat messages response:', res.data);
    
    if (res.data && res.data.success) {
      return res.data.data || [];
    } else {
      console.error('Unexpected farmer chat messages format:', res.data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch farmer messages:", error.response?.data || error.message);
    return [];
  }
};

export const sendFarmerChatMessage = async (requestId, message) => {
  try {
    const res = await API.post(`/vet-service-requests/service-requests/${requestId}/messages`, { message });
    console.log('Send farmer message response:', res.data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Failed to send farmer message:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadFarmerChatFile = async (requestId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await API.post(`/vet-service-requests/service-requests/${requestId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload farmer file response:', res.data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Failed to upload farmer file:", error.response?.data || error.message);
    throw error;
  }
};

export const downloadFarmerChatFile = async (fileId) => {
  try {
    const res = await API.get(`/vet-service-requests/files/${fileId}/download`, {
      responseType: 'blob'
    });
    return res.data;
  } catch (error) {
    console.error("Failed to download farmer file:", error.response?.data || error.message);
    throw error;
  }
};

export const vetService = {
  // Dashboard
  getDashboardStats: getVetDashboardStats,
  getDashboardActivities: getVetDashboardActivities,

  // Service Requests
  getServiceRequests: getVetServiceRequests,
  getVetRequests: getVetRequests,
  getAcceptedRequests: getAcceptedRequests,
  getUpcomingVisits: getUpcomingVisits,
  getVisitHistory: getVisitHistory,
  acceptServiceRequest: acceptServiceRequest,
  rejectServiceRequest: rejectServiceRequest,
  completeServiceRequest: completeServiceRequest,

  // Chat
  getChatMessages: getChatMessages,
  sendChatMessage: sendChatMessage,
  uploadChatFile: uploadChatFile,

  // Visit Records
  getVisitRecords: getVisitRecords,
  getVisitRecord: getVisitRecords,
  createVisitRecord: createVisitRecord,
  updateVisitRecord: updateVisitRecord,
  deleteVisitRecord: deleteVisitRecord,
  getFarmerHistory: getFarmerHistory,

  // Vaccinations
  getAllVaccinations: getAllVaccinations,
  getVaccination: getVaccinationDetails,
  updateVaccination: updateVaccination,
  deleteVaccination: deleteVaccination,

  // New functions
  getFarmerRequests: getFarmerRequests,
  createVetRequest: createVetRequest,
  updateRequestStatus: updateRequestStatus,
  rescheduleRequest: rescheduleRequest,
  getRequestDetails: getRequestDetails,
  getVeterinarians: getVeterinarians,
  deleteVeterinarian: deleteVeterinarian,
  updateVeterinarian: updateVeterinarian,
  getFarmerPigs: getFarmerPigs,

  // Farmer Chat
  getFarmerChatMessages,
  sendFarmerChatMessage,
  uploadFarmerChatFile,
  downloadFarmerChatFile
};


