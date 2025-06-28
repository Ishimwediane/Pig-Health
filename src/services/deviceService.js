import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  }
});

// Add request interceptor to include auth token
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

// Get all devices
export const getAllDevices = async () => {
  try {
    const response = await API.get('/devices');
    console.log('Devices response:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

// Get device assignments
export const getDeviceAssignments = async () => {
  try {
    const response = await API.get('/devices/assignments');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching device assignments:', error);
    return [];
  }
};

// Get health records
export const getHealthRecords = async () => {
  try {
    const response = await API.get('/devices/health-records');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching health records:', error);
    return [];
  }
};

// Assign device to pig
export const assignDeviceToPig = async (deviceId, pigId) => {
  try {
    const response = await API.post('/devices/assign', {
      device_id: deviceId,
      pig_id: pigId
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning device:', error);
    throw error;
  }
};

// Remove device from pig
export const removeDeviceFromPig = async (deviceId) => {
  try {
    const response = await API.post(`/devices/${deviceId}/remove`);
    return response.data;
  } catch (error) {
    console.error('Error removing device:', error);
    throw error;
  }
};

// Get device data
export const getDeviceData = async (deviceId) => {
  try {
    const response = await API.get(`/devices/${deviceId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching device data:', error);
    throw error;
  }
};

// Update device health monitoring
export const updateHealthMonitoring = async (deviceId, data) => {
  try {
    const response = await API.post(`/devices/${deviceId}/health`, {
      temperature: data.temperature,
      heart_rate: data.heartRate,
      activity_level: data.activityLevel
    });
    return response.data;
  } catch (error) {
    console.error('Error updating health monitoring:', error);
    throw error;
  }
};

// Get device health history
export const getDeviceHealthHistory = async (deviceId) => {
  try {
    const response = await API.get(`/devices/${deviceId}/health-history`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching device health history:', error);
    return [];
  }
};

// Create new device (Admin only)
export const createDevice = async (deviceData) => {
  try {
    const response = await API.post('/devices', {
      device_id: deviceData.deviceId,
      name: deviceData.name,
      description: deviceData.description,
      status: deviceData.status || 'active'
    });
    return response.data;
  } catch (error) {
    console.error('Error creating device:', error);
    throw error;
  }
};

// Update device
export const updateDevice = async (deviceId, deviceData) => {
  try {
    const response = await API.put(`/devices/${deviceId}`, {
      name: deviceData.name,
      description: deviceData.description,
      status: deviceData.status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
};

// Delete device
export const deleteDevice = async (deviceId) => {
  try {
    const response = await API.delete(`/devices/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
}; 