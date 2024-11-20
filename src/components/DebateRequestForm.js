import React, { useState } from 'react';

const DebateRequestForm = ({ topic, userId }) => {
  const [side, setSide] = useState(''); // Track the user's selected side
  const [consent, setConsent] = useState(false); // Track if the user consents to YouTube
  const [error, setError] = useState(null); // Track form errors
  const [success, setSuccess] = useState(null); // Track success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!side) {
      setError('Please select a side for the debate.');
      return;
    }
    if (!consent) {
      setError('You must consent to the debate being posted on YouTube.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/debate-request/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId, // This should come from the logged-in user
          topicId: topic.id, // The topic the user is requesting for
          side: side, // Which side the user selected
          consented: consent, // If they gave YouTube consent
        }),
      });

      if (response.ok) {
        setSuccess('Request submitted successfully!');
        setError(null);
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('Error submitting request.');
    }
  };

  return (
    <div className="debate-request-form">
      <h2>Request to Debate: {topic.title}</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select your side:</label>
          <select value={side} onChange={(e) => setSide(e.target.value)}>
            <option value="">Select Side</option>
            <option value="for">For</option>
            <option value="against">Against</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent(!consent)}
            />
            I consent to having this debate posted on YouTube
          </label>
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default DebateRequestForm;
