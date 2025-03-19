import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ChooseUsername.css';

function ChooseUsername() {
  const { fetchSessionUser } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckUsername = async () => {
    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:3001/auth/check-username/${username}`);
      setError(''); // Clear error if username is available
    } catch (error) {
      setError(error.response?.data?.message || "Error checking username.");
    }
  };

  const handleSetUsername = async () => {
    if (error || username.length < 3) return; // Don't proceed if there's an error
    setLoading(true);

    try {
      await axios.post('http://localhost:3001/auth/set-username', { username }, { withCredentials: true });
      await fetchSessionUser(); // Refresh user session
      navigate('/auth-success'); // Redirect to success page
    } catch (error) {
      setError(error.response?.data?.message || "Failed to set username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="choose-username-container">
      <h2>Choose a Username</h2>
      <p className="description">Pick a unique username to complete your profile.</p>
      
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleCheckUsername}
        className={`input-field ${error ? 'error' : ''}`}
      />
      {error && <p className="error-text">{error}</p>}

      <button onClick={handleSetUsername} disabled={!!error || loading} className="submit-button">
        {loading ? "Saving..." : "Confirm Username"}
      </button>
    </div>
  );
}

export default ChooseUsername;
