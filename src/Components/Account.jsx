import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, deleteToken } from '../Helper/Tokens';
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from './contextAuth';
const Account = () => {
  const [userInfo, setUserInfo] = useState({ fullName: '', email: '' });
  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken('access');
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({
        fullName: decoded.sub,
        email: decoded.email,
      });
    } else {
      navigate('/login'); 
    }
  }, [navigate]);
const { handleLogout } = useAuthContext(); 

  return (
    <div className="container mx-auto p-20 sm:p-10" style={{padding:"150px"}}>
      <h1 className="text-3xl font-semibold mb-4">Account Settings</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-medium text-blue-500">Full Name: <span className="text-black">{userInfo.fullName}</span></h2>
      </div>

      <div className="mb-4">
      <h2 className="text-lg font-medium text-blue-500 ">Email: <span className="text-black">{userInfo.email}</span></h2>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 "
      >
        Logout
      </button>
    </div>
  );
};

export default Account;