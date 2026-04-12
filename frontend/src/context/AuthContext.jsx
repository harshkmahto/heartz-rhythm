// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe, logoutUser, logoutAllDevices } from '../utils/apiRequest';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on page load)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getMe();
      
      if (response && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      
      if (response) {
        setUser(null);
        setIsAuthenticated(false);
        console.log("Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const logoutFromAllDevices = async () => {
    try {
      const response = await logoutAllDevices();
      
      if (response) {
        setUser(null);
        setIsAuthenticated(false);
        console.log("Logged out from all devices successfully");
      }
    } catch (error) {
      console.error("Logout from all devices error:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    logout,
    logoutFromAllDevices,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};