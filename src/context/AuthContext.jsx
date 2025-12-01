import { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS, setAuthToken, removeAuthToken, getAuthToken } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getAuthToken();
    const storedUser = localStorage.getItem('adminUser');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting login with:', { username });
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error response:', errorData);
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login successful, response data:', data);

      // Extract token from response - the token is likely in data.data
      const token = data.token || data.accessToken || data.access_token || 
                   data.data?.token || data.data?.accessToken || data.data?.access_token;
      const userData = data.user || data.admin || data.data?.user || data.data?.admin || { 
        id: data.data?.id || data.id,
        name: data.data?.name || data.name || 'Admin User',
        username: username,
        role: 'Administrator'
      };

      if (!token) {
        console.error('No token found in response:', data);
        throw new Error('No authentication token received');
      }

      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setUser(userData);

      console.log('Login completed successfully, token stored');
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
