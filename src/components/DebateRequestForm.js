import React, { useState } from 'react';
import './DebateRequestForm.css'; // Assuming a CSS file exists for styling

const DebateRequestForm = ({ topic, userId }) => {
  const [side, setSide] = useState(''); // Track the user's selected side
  const [consent, setConsent] = useState(false); // Track if the user consents to YouTube
  const [error, setError] = useState(null); // Track form errors
  const [success, setSuccess] = useState(null); // Track success message
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!side) {
      setError('Please select a side for the debate.');
      return;
    }
    if (!consent) {
      setError('You must consent to the debate being posted on YouTube.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/debate-request/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          topicId: topic.id,
          side,
          consentForRecording: consent,
        }),
      });

      if (response.ok) {
        setSuccess('Your request was submitted successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit your request. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="debate-request-form">
      <h2>Request to Debate: {topic.title}</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select your side:</label>
          <select value={side} onChange={(e) => setSide(e.target.value)} disabled={loading}>
            <option value="">Select Side</option>
            <option value="for">For</option>
            <option value="against">Against</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent(!consent)}
              disabled={loading}
            />
            I consent to having this debate posted on YouTube.
          </label>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default DebateRequestForm;
