import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    consentForPublic: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Password validation logic
  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    symbol: /[!@#$%^&*]/.test(formData.password),
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword((prev) => !prev);
    if (field === 'confirmPassword') setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consentForPublic) {
      toast.error("You must agree to have your debates posted publicly to sign up.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const submissionData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      consentForPublic: formData.consentForPublic,
    };

    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        toast.success('Account created successfully! Please verify your email.');
        navigate('/login');
      } else {
        toast.error(result.message || 'Sign-up failed. Please try again.');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3001/auth/google'; // Redirect to Google authentication
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

          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />

          <div className="password-container">
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => togglePasswordVisibility('password')}
                className="eye-icon"
              />
            </div>

            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="eye-icon"
              />
            </div>
          </div>

          <div className="consent-checkbox">
            <input
              type="checkbox"
              name="consentForPublic"
              checked={formData.consentForPublic}
              onChange={handleChange}
            />
            <label>I agree to have my debates posted publicly.</label>
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <div className="divider"><span>or</span></div>

        <button onClick={handleGoogleSignIn} className="google-signin-button">
          <FontAwesomeIcon icon={faGoogle} className="google-icon" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default SignUp;
