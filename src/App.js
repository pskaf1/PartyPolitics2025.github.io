import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DebateTopics from './components/DebateTopics';
import DebateRoom from './components/DebateRoom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import Footer from './components/Footer';
import ChangePassword from './components/ChangePassword';
import VerifyEmail from './components/VerifyEmail';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import DataDeletion from './components/DataDeletion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const socket = io('http://localhost:3001'); // Connect to the backend WebSocket server

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Wait for session check before deciding

  if (!user) {
    console.warn("🔴 No user found, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected with Socket ID: ${socket.id}`);
    });

    socket.on('error', (data) => {
      console.error('Error from server:', data.message);
    });

    return () => {
      socket.disconnect(); // Cleanup socket connection on unmount
    };
  }, []);

  return (
    <div className="app-container" style={{ backgroundColor: '#F3F7FC', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/debate-topics" element={<DebateTopics />} />
        <Route
          path="/debate-room/:roomId"
          element={
            <ProtectedRoute>
              <DebateRoom socket={socket} />
            </ProtectedRoute>
          }
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-success" element={<Navigate to="/debate-topics" replace />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ marginTop: '60px' }}
      />
    </div>
  );
}

export default App;
