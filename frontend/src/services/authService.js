/**
 * Authentication Service
 * Handles user authentication operations
 */

import api from './api';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/users/register', userData);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();