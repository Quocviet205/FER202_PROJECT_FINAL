import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function RevenueManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu thống kê:", err);
    }
  };

  const totalOrdersCount = orders.length;
  
  // Đơn bị hủy
  const cancelledOrders = orders.filter(o => {
    const s = o.status || '';
    return s === 'Đã hủy' || s === 'Cancelled';
  });

  // Số đơn ĐÃ HOÀN THÀNH (Completed)
  const completedOrders = orders.filter(o => {
    const s = o.status || '';
    return s === 'Đã hoàn thành' || s === 'Completed';
  });

  // Tổng doanh thu từ các đơn đã hoàn thành
  const totalRevenue = completedOrders.reduce((sum, o) => {
    const val = o.total !== undefined ? o.total : (o.subtotal || 0);
    return sum + Number(val);
  }, 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Thống kê Doanh thu & Đơn hàng</h2>

      {/* Các thẻ thống kê tổng quan (Cards) */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-start border-primary border-4 py-3">
            <div className="card-body">
              <h6 className="text-muted text-uppercase fw-bold mb-1">Tổng số đơn bán được</h6>
              <h3 className="text-primary fw-bold mb-0">{completedOrders.length} đơn</h3>
              <small className="text-muted">Đã hoàn thành thành công</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-start border-danger border-4 py-3">
            <div className="card-body">
              <h6 className="text-muted text-uppercase fw-bold mb-1">Số đơn bị hủy</h6>
              <h3 className="text-danger fw-bold mb-0">{cancelledOrders.length} đơn</h3>
              <small className="text-muted">Đã hủy thành công</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-start border-success border-4 py-3">
            <div className="card-body">
              <h6 className="text-muted text-uppercase fw-bold mb-1">Doanh thu</h6>
              <h3 className="text-success fw-bold mb-0">{totalRevenue.toLocaleString()} đ</h3>
              <small className="text-muted">Từ các đơn đã hoàn thành</small>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng chi tiết doanh thu các đơn hàng đã hoàn thành */}
      <h5 className="mb-3">Chi tiết đơn hàng đã hoàn thành</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Địa chỉ nhận</th>
              <th>Thời gian đặt</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">Chưa có đơn hàng nào hoàn thành.</td>
              </tr>
            ) : (
              completedOrders.map(order => {
                const totalVal = order.total !== undefined ? order.total : (order.subtotal || 0);
                const customerName = order.customerName || order.fullName || 'Khách hàng';
                const displayAddress = order.address || 'Không có địa chỉ';
                const currentStatus = order.status || 'Đã hoàn thành';

                return (
                  <tr key={order.id || order.orderCode}>
                    <td>#{order.id || order.orderCode}</td>
                    <td className="fw-bold">{customerName}</td>
                    <td>{displayAddress}</td>
                    <td className="small text-muted">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                    </td>
                    <td>
                      <span className="badge bg-success">{currentStatus}</span>
                    </td>
                    <td className="fw-bold text-danger">{Number(totalVal).toLocaleString()} đ</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}