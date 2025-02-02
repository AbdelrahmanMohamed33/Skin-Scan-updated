import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Domain from "../Constans/Domain";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateAndLogin = async () => {
    setErrors({});
    let validationErrors = {};

    // Validation
    if (!email) validationErrors.email = 'Email is required';
    if (!password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${Domain.apiUrl}/api/Auth/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('access_token', data.data.access);
        localStorage.setItem('refresh_token', data.data.refresh);

        console.log('Login successful:', data.message || 'Welcome!');
        navigate('/'); // Redirect to home or another page after successful login
      } else {
        setErrors({ api: data.message || 'Login failed, please try again.' });
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ api: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">Login</h1>
        <form onSubmit={e => { e.preventDefault(); validateAndLogin(); }}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className={`input w-full p-2 border rounded-md focus:outline-none focus:ring ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className={`input w-full p-2 border rounded-md focus:outline-none focus:ring ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          {errors.api && <p className="text-red-500 text-sm mb-4">{errors.api}</p>}
          <button
            type="submit"
            className={`w-full bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;