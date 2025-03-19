import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch session user on app load
  const fetchSessionUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/current-user', { withCredentials: true });
      setUser(response.data || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionUser();
  }, []);

  // ✅ Login function (missing before!)
  const login = async (email, password, redirectPath = "/debate-topics") => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password }, { withCredentials: true });

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setUser(response.data.user);
        navigate(redirectPath); // Redirect after login
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return false;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchSessionUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
