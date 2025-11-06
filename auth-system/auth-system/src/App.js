import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={!user ? <LoginPage /> : <Navigate to="/auth" />} />
        <Route path="/auth/register" element={!user ? <RegisterPage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={user ? <HomePage /> : <Navigate to="/auth/login" />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
}

export default App;