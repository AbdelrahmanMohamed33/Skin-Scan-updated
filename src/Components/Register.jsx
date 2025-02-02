import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Domain from "../Constans/Domain"; // Adjust the import based on your project structure

const RegisterUser = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateAndRegister = async () => {
    const newErrors = {};
    
    // Validation
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!/^[^@]+@[^@]+\.[^@]+/.test(email)) newErrors.email = 'Please enter a valid email';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // API Call
    try {
      const response = await axios.post(`${Domain.apiUrl}/api/Auth/auth/register`, {
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Register successful:', response.data.message || 'Welcome!');
        navigate('/'); // Redirect to home or another page after successful registration
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-4xl font-semibold text-center text-blue-800 mb-8">Skin Scan</h1>
      <h2 className="text-2xl text-center mb-4">Create Your New Account</h2>

      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={e => { e.preventDefault(); validateAndRegister(); }}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="Full Name"
          />
          {errors.fullName && <p className="text-red-500 text-xs italic">{errors.fullName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Password"
          />
          {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>

      <p className="text-center">
        Already have an account? <Link to="/login" className="text-blue-500">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterUser;