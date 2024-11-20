// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const { user, fetchProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    linkedIn: '',
    bio: '',
    location: '',
    preferredTopics: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        linkedIn: user.linkedIn || '',
        bio: user.bio || '',
        location: user.location || '',
        preferredTopics: user.preferredTopics || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'preferredTopics') {
      setFormData({
        ...formData,
        preferredTopics: checked
          ? [...formData.preferredTopics, value]
          : formData.preferredTopics.filter((topic) => topic !== value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        linkedIn: formData.linkedIn,
        bio: formData.bio,
        location: formData.location,
        preferredTopics: formData.preferredTopics,
      };
  
      const response = await fetch('http://localhost:3001/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        toast.success("Profile updated successfully!");
        await fetchProfile();
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const getInitials = () => {
    const initials = (formData.firstName?.charAt(0) || '') + (formData.lastName?.charAt(0) || '');
    return initials.toUpperCase();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-initials-container">
          <div className="profile-initials">{getInitials()}</div>
        </div>
        <h2>User Profile</h2>
      </div>

      <div className="profile-form">
        {/* Profile Info */}
        <div className="profile-info">
          <label>First Name:</label>
          {isEditing ? (
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          ) : (
            <p>{formData.firstName}</p>
          )}
        </div>

        <div className="profile-info">
          <label>Last Name:</label>
          {isEditing ? (
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          ) : (
            <p>{formData.lastName}</p>
          )}
        </div>

        <div className="profile-info">
          <label>Username:</label>
          {isEditing ? (
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          ) : (
            <p>{formData.username}</p>
          )}
        </div>

        <div className="profile-info">
          <label>Email:</label>
          <p>{formData.email}</p>
        </div>

        <div className="profile-info full-width">
          <label>LinkedIn:</label>
          {isEditing ? (
            <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleChange} />
          ) : (
            <p>{formData.linkedIn}</p>
          )}
        </div>

        <div className="profile-info full-width">
          <label>Bio:</label>
          {isEditing ? (
            <textarea name="bio" value={formData.bio} onChange={handleChange} />
          ) : (
            <p>{formData.bio}</p>
          )}
        </div>

        <div className="profile-info full-width">
          <label>Location:</label>
          {isEditing ? (
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
          ) : (
            <p>{formData.location}</p>
          )}
        </div>

        <div className="profile-info full-width">
          <label>Preferred Debate Topics:</label>
          <div className="checkbox-container">
            {['Technology', 'Politics', 'Environment', 'Education', 'Health', 'Sports'].map((topic) => (
              <label key={topic} className="checkbox-item">
                <input
                  type="checkbox"
                  name="preferredTopics"
                  value={topic}
                  checked={formData.preferredTopics.includes(topic)}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {topic}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="edit-button" onClick={handleSave}>Save Changes</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
        {/* Link to Change Password Page */}
        <Link to="/change-password" className="change-password-link">
          Change Password
        </Link>
      </div>
    </div>
  );
}

export default Profile;
