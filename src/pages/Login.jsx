import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser.role === 'admin') {
                navigate('/admin/products');
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow border-0 p-4">
                <h3 className="text-center text-danger mb-4">Đăng nhập</h3>
                {error && <div className="alert alert-danger p-2 small">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tài khoản</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập số điện thoại"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-danger w-100 fw-bold">Đăng nhập</button>
                </form>
            </div>
            <div className="mt-3 text-center small">
                Chưa có tài khoản? <Link to="/register" className="text-danger text-decoration-none fw-bold">Đăng ký ngay</Link>
            </div>
        </div>

    );
}