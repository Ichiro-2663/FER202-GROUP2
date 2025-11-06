import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const err = {};
    if (!formData.email) err.email = 'Email bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = 'Email không hợp lệ';
    if (!formData.password) err.password = 'Mật khẩu bắt buộc';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:9999/users?email=${formData.email}`);
      const user = res.data[0];

      if (!user) {
        setErrors({ general: 'Email không tồn tại' });
        setLoading(false);
        return;
      }

      if (!['active', 'approved'].includes(user.status)) {
        setErrors({ general: 'Tài khoản chưa được kích hoạt' });
        setLoading(false);
        return;
      }

      const match = await bcrypt.compare(formData.password, user.passwordHash);
      if (!match) {
        setErrors({ general: 'Mật khẩu sai' });
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }));

      navigate('/auth');
    } catch (err) {
      setErrors({ general: 'Lỗi kết nối server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Đăng nhập</h2>
      {errors.general && <p className="error text-center">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <p className="text-center">
        Chưa có tài khoản? <Link to="/auth/register" className="link">Đăng ký</Link>
      </p>
    </div>
  );
};

export default LoginPage;