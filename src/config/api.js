// API Configuration
const isDevelopment = import.meta.env.MODE === 'development';

// Use proxy in development, direct URL in production
export const API_BASE_URL = isDevelopment ? '/api' : 'https://app.boldtribe.in/api';

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/admin/login`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  CATEGORY_BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
  
  ITEM_BY_ID: (id) => `${API_BASE_URL}/items/${id}`,
  // Add more endpoints here as needed
};

// API utility functions
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        removeAuthToken();
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};