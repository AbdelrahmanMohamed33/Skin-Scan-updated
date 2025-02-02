import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Adjust the import based on your project structure
import Domain from "../Constans/Domain";
const FeedbackPage = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitFeedback = async () => {
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('access_token'); // Retrieve token from local storage

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const body = {
      Subject: subject,
      FeedBackContent: feedback,
    };

    try {
      const response = await axios.post(`${Domain.apiUrl}/api/FeedBack/add`, body, { headers });

      if (response.status === 200) {
        setMessage('Feedback sent successfully!');
        // Clear fields
        setSubject('');
        setFeedback('');
      } else {
        setMessage('Failed to submit feedback: ' + response.data.User);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-24">
      <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">Feedback</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p className="font-bold mb-2">Please write your feedback</p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Subject"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <textarea
            placeholder="Feedback........"
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="6"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={submitFeedback}
          className={`w-full p-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {message && (
          <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-gray-600">
          If you have a technical question or are experiencing difficulty using the app, please let us know.
          You can now access your program via web browser here.
        </p>
      </div>
    </div>
  );
};

export default FeedbackPage;