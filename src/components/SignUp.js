// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedIn: '',
    bio: '',
    location: '',
    preferredTopics: [],
    consentForPublic: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'preferredTopics') {
      setFormData({
        ...formData,
        preferredTopics: checked
          ? [...formData.preferredTopics, value]
          : formData.preferredTopics.filter((topic) => topic !== value),
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Sign-up failed. Please try again.');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
          </div>
          <div className="input-row">
            <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          </div>
          <div className="input-row">
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
          </div>
          <input type="text" name="linkedIn" placeholder="LinkedIn Profile (Optional)" onChange={handleChange} />
          <textarea name="bio" placeholder="Short Bio (Optional)" onChange={handleChange}></textarea>
          <input type="text" name="location" placeholder="Location (City, Country)" onChange={handleChange} />

          <label>Preferred Debate Topics:</label>
          <div className="checkbox-container">
            {['Technology', 'Politics', 'Environment', 'Education', 'Health', 'Sports'].map((topic) => (
              <label key={topic} className="checkbox-item">
                <input
                  type="checkbox"
                  name="preferredTopics"
                  value={topic}
                  onChange={handleChange}
                />
                {topic}
              </label>
            ))}
          </div>

          <div className="consent-checkbox">
            <input type="checkbox" name="consentForPublic" onChange={handleChange} />
            <label>I agree to have my debates posted publicly.</label>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
