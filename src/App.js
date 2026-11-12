import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer'; // 1. Import Footer
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/user/Home';
import Cart from './pages/user/Cart';
import OrderHistory from './pages/user/OrderHistory';
import Login from './pages/Login';

import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import Register from './pages/Register';
import RevenueManagement from './pages/admin/RevenueManagement';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 2. Bọc toàn bộ trong flex column min-vh-100 */}
        <div className="d-flex flex-column min-vh-100">
          <Header />
          
          <div className="flex-fill">
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/products" element={
                <ProtectedRoute adminOnly={true}>
                  <ProductManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute adminOnly={true}>
                  <OrderManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/revenue" element={
                <ProtectedRoute adminOnly={true}>
                  <RevenueManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}