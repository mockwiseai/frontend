import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Bearer token
api.interceptors.request.use(
  (config) => {
    // Safe localStorage access for Next.js
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Improved error interceptor with token invalidation handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      response: error.response?.data,
    });

    // Handle 401 Unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        
        // Handle redirection (needs to be handled carefully in Next.js)
        // Only redirect if not already on login page to prevent redirect loops
        if (window.location.pathname !== '/auth/login') {
          // Get any redirect parameter
          const currentPath = window.location.pathname;
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;