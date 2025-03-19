import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function VerifyEmail() {
  const { token } = useParams(); // Get token from URL
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          setMessage('Verification successful! Redirecting to login...');
          setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } else {
          toast.error(data.error || 'Failed to verify email.');
          setMessage('Verification failed. Invalid or expired link.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('An error occurred during verification.');
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verification-container">
      <h2>Email Verification</h2>
      <p>{message || 'Verifying your email...'}</p>
    </div>
  );
}

export default VerifyEmail;
