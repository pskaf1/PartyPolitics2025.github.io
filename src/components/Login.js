import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

function Login() {
  const { login } = useAuth(); // Import the login function from AuthContext
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // State to manage login errors
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user was originally trying to access, or default to "/"
  const redirectPath = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state on new submit

    try {
      // Call the login function from AuthContext and pass the email, password, and redirect path
      const success = await login(formData.email, formData.password, redirectPath);

      if (success) {
        toast.success("Logged in successfully!");
        navigate(redirectPath); // Redirect after successful login
      } else {
        setError("Login failed. Please try again."); // Set error message if login fails
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Log In to Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="login-form-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="login-form-row">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
