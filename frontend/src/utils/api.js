import axios from 'axios';

// Detect if running on Vercel or other production environment
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';

// Use environment variable if set, otherwise use smart detection
const API_URL = import.meta.env.VITE_API_URL || 
  (isProduction ? '/api' : 'http://localhost:5000/api');

console.log('[API Config]', {
  PROD: import.meta.env.PROD,
  hostname: window.location.hostname,
  isProduction,
  API_URL
});

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

