import axios from "axios";


const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  }
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request interceptor - Setting Authorization header:", config.headers.Authorization);
    } else {
      console.log("Request interceptor - No token found");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
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




export const createPig = async (pigData) => {
  try {
    const response = await API.post("/pigs", pigData);
    return response.data;
  } catch (error) {
    console.error("Pig creation failed:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchDashboardData = async (userId) => {
  try {
    // Check if we have a token
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found");
      throw new Error("No authentication token found");
    }

    if (!userId) {
      console.error("No user ID provided");
      throw new Error("No user ID provided");
    }

    console.log('Fetching dashboard data with token:', token.substring(0, 20) + '...');
    console.log('Current Authorization header:', API.defaults.headers.common['Authorization']);

    // Make API calls with proper error handling
    const [pigsRes, serviceRequestsRes] = await Promise.all([
      API.get("/pigs"),
      API.get("/vet-service-requests")
    ]);

    console.log('Pigs response:', pigsRes.data);
    console.log('Service requests response:', serviceRequestsRes.data);

    const pigs = pigsRes.data;
    const totalPigs = pigs.length;
    const sickPigs = pigs.filter((p) => p.health_status?.toLowerCase().includes("sick"));
    const healthAlerts = sickPigs.map((p) => ({
      pigName: p.name,
      issue: p.health_status,
    }));

    // Get health records for each pig to check vaccinations
    const healthPromises = pigs.map(pig => 
      API.get(`/health/pig/${pig.id}`).catch(() => ({ data: [] }))
    );
    const healthResults = await Promise.all(healthPromises);
    
    const vaccinationsDue = healthResults.reduce((count, result) => {
      const records = result.data || [];
      return count + records.filter(r => 
        r.type === 'vaccination' && 
        (!r.completed || new Date(r.due_date) < new Date())
      ).length;
    }, 0);

    const upcomingVisits = serviceRequestsRes.data.filter(
      (v) => new Date(v.date) > new Date() && v.status === 'scheduled'
    );

    return {
      totalPigs,
      sickPigs: sickPigs.length,
      healthAlerts,
      vaccinationsDue,
      upcomingVisits,
      pigs,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    }
    throw error;
  }
};

export const requestVetService = async (requestData) => {
  try {
    const response = await API.post("/assistance-request", requestData);
    return response.data;
  } catch (error) {
    console.error("Vet service request failed:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchBreeds = async () => {
  try {
    const response = await API.get('/pig-breeds');
    console.log('Breeds API response:', response); // Debug log
    if (!response.data) {
      throw new Error('No data received from breeds endpoint');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching breeds:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePigById = async (pigId) => {
  try {
    const response = await API.delete(`/pigs/${pigId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete pig:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllPigs = async () => {
  try {
    // Log the auth token being used
    const token = localStorage.getItem("authToken");
    console.log('Auth token being used:', token ? 'Present' : 'Missing');
    
    const response = await API.get("/pigs");
    console.log('Pigs API response:', response);
    
    // Ensure we have data and it's in the correct format
    if (!response.data) {
      console.warn('No data received from pigs endpoint');
      return [];
    }

    // If response.data is not an array, try to extract the array from it
    const pigsData = Array.isArray(response.data) ? response.data : 
                    (response.data.data ? response.data.data : []);
    
    console.log('Processed pigs data:', pigsData);
    return pigsData;
  } catch (error) {
    console.error("Failed to fetch pigs:", error.response?.data || error.message);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    }
    // Return empty array on error to prevent mapping issues
    return [];
  }
};
// In src/services/dashboardService.js

export const fetchHealthRecords = async (pigId) => {
  try {
    const response = await API.get(`/health/pig/${pigId}`);
    return response.data; // Assuming the response contains the health records
  } catch (error) {
    console.error("Failed to fetch health records:", error.response?.data || error.message);
    throw error;
  }
};

// In src/services/dashboardService.js

export const fetchVaccinationRecords = async (pigId) => {
  try {
    const response = await API.get(`/pig/${pigId}/vaccinations`);
    return response.data; // Assuming the response contains the vaccination records
  } catch (error) {
    console.error("Failed to fetch vaccination records:", error.response?.data || error.message);
    throw error;
  }
};

export const updateHealthRecord = async (recordId, data) => {
  try {
    const response = await API.put(`/health-records/${recordId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteHealthRecord = async (recordId) => {
  try {
    const response = await API.delete(`/health-records/${recordId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePig = async (pigId, pigData) => {
  try {
    const response = await API.put(`/pigs/${pigId}`, pigData);
    return response.data;
  } catch (error) {
    console.error('Error updating pig:', error);
    throw error;
  }
};

