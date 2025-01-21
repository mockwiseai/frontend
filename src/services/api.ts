import axios from 'axios';

const api = axios.create({
  // Remove the extra 'api' in the baseURL
  baseURL: 'http://localhost:8000', // Changed from 'http://localhost:8000/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Bearer token
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

// Add error interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      response: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
