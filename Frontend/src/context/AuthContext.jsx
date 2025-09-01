import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // Import the API instance to fetch user data

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (token) {
        try {
          // Verify token and fetch user data from backend
          const response = await API.get('/auth/me'); // Assuming you have a /auth/me endpoint
          setIsAuthenticated(true);
          setUser(response.data.user); // Store user data
        } catch (error) {
          console.error("Failed to authenticate user:", error);
          logout(); // Clear invalid token and logout
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // Store user data on login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    document.cookie = 'token=; Max-Age=0; path=/'; // Clear the token cookie
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
