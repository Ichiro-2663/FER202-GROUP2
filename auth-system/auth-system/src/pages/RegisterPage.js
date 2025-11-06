import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: 'customer'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const err = {};
    if (!formData.name) err.name = 'Họ tên bắt buộc';
    if (!formData.email) err.email = 'Email bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = 'Email không hợp lệ';
    if (!formData.password) err.password = 'Mật khẩu bắt buộc';
    else if (formData.password.length < 8) err.password = 'Mật khẩu ít nhất 8 ký tự';
    else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) err.password = 'Cần 1 chữ hoa và 1 số';
    if (!formData.phone) err.phone = 'SĐT bắt buộc';
    else if (!/^\+84\d{9,10}$/.test(formData.phone)) err.phone = 'SĐT phải bắt đầu +84';
    if (!formData.address) err.address = 'Địa chỉ bắt buộc';
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
      const emailCheck = await axios.get(`http://localhost:9999/users?email=${formData.email}`);
      if (emailCheck.data.length > 0) {
        setErrors({ email: 'Email đã được sử dụng' });
        setLoading(false);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(formData.password, salt);

      const newUser = {
        id: `u_${formData.role}_${Date.now()}`,
        email: formData.email,
        passwordHash,
        name: formData.name,
        role: formData.role,
        status: formData.role === 'seller' ? 'pending' : 'active',
        createdAt: new Date().toISOString(),
        profile: {
          phone: formData.phone,
          address: formData.address,
          ...(formData.role === 'seller' && {
            shopName: '',
            bio: '',
            sellerSettings: { autoApproveOrders: false, lowStockThreshold: 5 }
          })
        }
      };

      await axios.post('http://localhost:9999/users', newUser);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/auth/login');
    } catch (err) {
      setErrors({ general: 'Lỗi kết nối server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h2>Đăng ký tài khoản</h2>
      {errors.general && <p className="error text-center">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Họ tên</label>
            <input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>SĐT (+84...)</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Mật khẩu</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Vai trò</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Khách hàng</option>
              <option value="seller">Người bán</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      <p className="text-center">
        Đã có tài khoản? <Link to="/auth/login" className="link">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default RegisterPage;