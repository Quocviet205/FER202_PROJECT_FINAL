import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    if (user && user.role !== 'admin') {
      const userId = user.id;
      axiosClient.get(`/orders?userId=${userId}`)
        .then(res => {
          setOrderCount(res.data.length);
        })
        .catch(err => console.error('Lỗi tải đơn hàng:', err));
    }

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper style để nhận biết tab đang active (đậm hơn, có gạch chân trắng hoặc nền mờ)
  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    borderBottom: isActive ? '2px solid white' : 'none',
    paddingBottom: '2px',
    color: '#ffffff'
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 text-white" to="/">
          🍔 ShopeeFood FE
        </NavLink>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto align-items-center gap-2">
            <li className="nav-item">
              <NavLink className="nav-link text-white" style={navLinkStyle} to="/" end>
                Trang chủ
              </NavLink>
            </li>
            {user && user.role !== 'admin' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white position-relative" style={navLinkStyle} to="/cart">
                    Giỏ hàng
                    {cartCount > 0 && (
                      <span className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.65rem' }}>
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white position-relative" style={navLinkStyle} to="/orders">
                    Đơn hàng của tôi
                    {orderCount > 0 && (
                      <span className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-light text-danger" style={{ fontSize: '0.65rem' }}>
                        {orderCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" style={navLinkStyle} to="/admin/products">
                    Quản lý món
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white" style={navLinkStyle} to="/admin/orders">
                    Quản lý đơn hàng
                  </NavLink>
                </li>
                {/* --- THÊM MỤC DOANH THU CHO ADMIN TẠI ĐÂY --- */}
                <li className="nav-item">
                  <NavLink className="nav-link text-white" style={navLinkStyle} to="/admin/revenue">
                    Doanh thu
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-white">Xin chào, <strong>{user.fullName}</strong> ({user.role})</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Đăng xuất</button>
              </>
            ) : (
              <NavLink className="btn btn-light text-danger fw-bold" to="/login">Đăng nhập</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}