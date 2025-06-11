import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Видалити токен з localStorage
    navigate('/login'); // Перенаправити на сторінку входу
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;