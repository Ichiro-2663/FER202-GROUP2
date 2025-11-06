import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  return (
    <div className="container">
      <h2>Chào mừng, {user?.name || 'User'}!</h2>
      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Vai trò:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{user?.role}</span></p>
      </div>
      <button onClick={handleLogout} className="btn" style={{ background: '#e74c3c' }}>
        Đăng xuất
      </button>
    </div>
  );
};

export default HomePage;