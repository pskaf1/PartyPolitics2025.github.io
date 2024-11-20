import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DebateTopics from './components/DebateTopics';
import DebateRoom from './components/DebateRoom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import Footer from './components/Footer';
import ChangePassword from './components/ChangePassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/debate-topics" element={<DebateTopics />} />
        <Route path="/debate-room" element={<DebateRoom />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
      <Footer />
      {/* Adjusted ToastContainer with margin-top to appear below the navbar */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        style={{ marginTop: '60px' }} // Adjust margin as needed
      />
    </div>
  );
}

export default App;
