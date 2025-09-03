/**
 * API Service
 * Centralized API configuration and service functions
 */

import axios from 'axios';
import store from '../redux/store';
import { refreshToken, logout } from '../redux/slices/userSlice';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://online-store-backend.onrender.com/api' : 'http://localhost:5000/api'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token to headers
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const { userInfo } = state.user;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we have a user in the store before attempting to refresh
      const state = store.getState();
      if (!state.user.userInfo || !state.user.userInfo.refreshToken) {
        // No user info or refresh token, just log out
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        await store.dispatch(refreshToken());
        const newState = store.getState();
        const { userInfo } = newState.user;

        // If token refresh was successful, retry the original request
        if (userInfo && userInfo.token) {
          originalRequest.headers.Authorization = `Bearer ${userInfo.token}`;
          return api(originalRequest);
        } else {
          // If we don't have a token after refresh attempt, log out
          store.dispatch(logout());
          return Promise.reject(new Error('Authentication failed'));
        }
      } catch (refreshError) {
        // If token refresh fails, log the user out
        console.error('Token refresh failed:', refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;