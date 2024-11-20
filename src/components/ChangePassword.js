// src/components/ChangePassword.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './ChangePassword.css';

function ChangePassword() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <div className="password-field">
        <label>Current Password</label>
        <input
          type="password"
          name="currentPassword"
          placeholder="Enter current password"
          value={passwordData.currentPassword}
          onChange={handleChange}
        />
      </div>
      <div className="password-field">
        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={passwordData.newPassword}
          onChange={handleChange}
        />
      </div>
      <div className="password-field">
        <label>Confirm New Password</label>
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm new password"
          value={passwordData.confirmNewPassword}
          onChange={handleChange}
        />
      </div>
      <button className="update-password-button" onClick={handlePasswordUpdate}>Update Password</button>
    </div>
  );
}

export default ChangePassword;
