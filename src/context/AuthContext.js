// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    }
  }, [token]);

  const login = async (email, password, redirectPath = '/') => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchProfile();
      navigate(redirectPath);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/profile');
      setUser(response.data); // Ensure this sets user correctly
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
