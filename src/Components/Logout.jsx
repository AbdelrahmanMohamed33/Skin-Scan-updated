import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../Helper/Tokens';

const Logout = () => {
  const navigate = useNavigate();

  deleteToken('access');
  deleteToken('refresh');

  navigate('/home'); 

  return null; // No need to render anything here
};

export default Logout;