import api from './api';

export const authService = {
  async register(
    name: string,
    email: string,
    password?: string,
    loginType?: string
  ) {
    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        loginType,
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration Error IN Service:', error);
      throw error;
    }
  },
  
  async login(email: string, password: string, loginType?: string) {
    const response = await api.post('/api/auth/login', {
      email,
      password,
      loginType,
    });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('token');
  },
  
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get Profile Error:', error);
      throw error;
    }
  },
};