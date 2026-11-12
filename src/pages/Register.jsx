import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // 1. Kiểm tra xem username đã tồn tại chưa
      const checkUser = await axiosClient.get(`/users?username=${form.username}`);
      if (checkUser.data.length > 0) {
        setError('Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!');
        return;
      }

      // 2. Tạo tài khoản mới với role mặc định là "user"
      const newUser = {
        ...form,
        role: 'user',
      };

      await axiosClient.post('/users', newUser);
      setSuccess('Đăng ký thành công! Đang chuyển hướng về trang đăng nhập...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError('Lỗi kết nối server, vui lòng thử lại!');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow border-0 p-4">
        <h3 className="text-center text-danger mb-4">Đăng ký tài khoản</h3>
        {error && <div className="alert alert-danger p-2 small">{error}</div>}
        {success && <div className="alert alert-success p-2 small">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ và tên</label>
            <input 
              type="text" 
              className="form-control" 
              value={form.fullName} 
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
              placeholder="Nguyễn Văn B"
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tên đăng nhập</label>
            <input 
              type="text" 
              className="form-control" 
              value={form.username} 
              onChange={(e) => setForm({ ...form, username: e.target.value })} 
              placeholder="username của bạn"
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-control" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              placeholder="mật khẩu"
              required 
            />
          </div>
          <button type="submit" className="btn btn-danger w-100 fw-bold mb-3">Đăng ký</button>
        </form>

        <div className="text-center small">
          Đã có tài khoản? <Link to="/login" className="text-danger text-decoration-none fw-bold">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
}