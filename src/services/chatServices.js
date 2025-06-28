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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Community post services
export const getAllPosts = async () => {
  try {
    const response = await API.get('/posts');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error.response?.data || error.message);
    throw error;
  }
};

export const createPost = async (content) => {
  try {
    const response = await API.post('/posts', { content });
    return response.data;
  } catch (error) {
    console.error("Failed to create post:", error.response?.data || error.message);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await API.post(`/posts/like/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to like post:", error.response?.data || error.message);
    throw error;
  }
};

export const commentOnPost = async (postId, comment) => {
  try {
    const response = await API.post(`/posts/comment/${postId}`, { comment });
    return response.data;
  } catch (error) {
    console.error("Failed to comment on post:", error.response?.data || error.message);
    throw error;
  }
};

export const reportPost = async (postId, comment, abuseType) => {
  try {
    const response = await API.post(`/posts/report/${postId}`, { 
      comment,
      abuse_type: abuseType 
    });
    return response.data;
  } catch (error) {
    console.error("Failed to report post:", error.response?.data || error.message);
    throw error;
  }
};

/// 🐖 VET-FARMER CHAT & SERVICES

export const getVet = async (userId) => {
  const response = await API.get(`/farmer/${userId}/vet`);
  return response.data;
};

export const getVisits = async (userId) => {
  const response = await API.get(`/farmer/${userId}/visits`);
  return response.data;
};

export const getMessages = async () => {
  const response = await API.get('/messages');
  return response.data;
};

export const sendMessage = async (content) => {
  const response = await API.post('/messages', { content });
  return response.data;
};

export const likeMessage = async (messageId) => {
  const response = await API.post(`/messages/${messageId}/like`);
  return response.data;
};

export const commentMessage = async (messageId, content) => {
  const response = await API.post(`/messages/${messageId}/comment`, { content });
  return response.data;
};

export const reportMessage = async (messageId) => {
  const response = await API.post(`/messages/${messageId}/report`);
  return response.data;
};

export const requestAssistance = async (message) => {
  const response = await API.post('/assistance-request', { message });
  return response.data;
};


const getFarmerRequests = () => axios.get('/api/vet-requests/my', headers);
export default {
  getVet,
  getVisits,
  getMessages,
  sendMessage,
  likeMessage,
  commentMessage,
  reportMessage,
  requestAssistance,
  getAllPosts,
  createPost,
  likePost,
  commentOnPost,
  reportPost,
  getFarmerRequests
};


//vet-farmer
export const getChatMessages = async (requestId) => {
  const res = await API.get(`/chat/${requestId}`);
  return res.data.messages || []; 
};


export const sendMessageToVet = async (requestId, formData) => {
  formData.append('vet_services_request_id', requestId);
  return await API.post('/chat/send', formData);
};
