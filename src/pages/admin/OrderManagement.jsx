import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả');

  // State quản lý Toast thông báo góc màn hình
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/orders');
      // Sắp xếp đơn hàng theo mã đơn (id) tăng dần (#1, #2, #3, ...)
      const sortedOrders = res.data.sort((a, b) => {
        const idA = Number(a.id || a.orderCode || 0);
        const idB = Number(b.id || b.orderCode || 0);
        return idA - idB;
      });
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Lỗi tải danh sách đơn hàng:", err);
    }
  };

  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.patch(`/orders/${orderId}`, {
        status: newStatus
      });
      showNotification(`Đã cập nhật trạng thái đơn hàng #${orderId} thành "${newStatus}"!`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': 
      case 'Chờ xử lý': 
        return <span className="badge bg-warning text-dark">Đang chờ xử lý</span>;
      case 'Preparing': 
      case 'Đang chuẩn bị':
        return <span className="badge bg-info text-dark">Đang chuẩn bị</span>;
      case 'Delivering': 
      case 'Đang giao': 
        return <span className="badge bg-primary">Đang giao hàng</span>;
      case 'Completed': 
      case 'Đã hoàn thành': 
        return <span className="badge bg-success">Đã hoàn thành</span>;
      case 'Cancelled': 
      case 'Đã hủy': 
        return <span className="badge bg-danger">Đã hủy</span>;
      default: return <span className="badge bg-secondary">{status || 'Chờ xử lý'}</span>;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Vừa xong';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const status = order.status || 'Chờ xử lý';
    if (activeTab === 'Tất cả') return true;
    if (activeTab === 'Chờ xử lý') return status === 'Chờ xử lý' || status === 'Pending';
    if (activeTab === 'Đang chuẩn bị') return status === 'Đang chuẩn bị' || status === 'Preparing';
    if (activeTab === 'Đang giao') return status === 'Đang giao' || status === 'Delivering';
    if (activeTab === 'Đã hoàn thành') return status === 'Đã hoàn thành' || status === 'Completed';
    if (activeTab === 'Đã hủy') return status === 'Đã hủy' || status === 'Cancelled';
    return true;
  });

  return (
    <div className="container mt-4 position-relative">
      <h2>Quản lý Đơn hàng</h2>

      {/* --- CÁC TAB LỌC TRẠNG THÁI ĐƠN HÀNG --- */}
      <ul className="nav nav-pills my-3 gap-2">
        {['Tất cả', 'Chờ xử lý', 'Đang chuẩn bị', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button 
              className={`nav-link fw-bold ${activeTab === tab ? 'active bg-danger text-white' : 'bg-light text-dark'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({tab === 'Tất cả' ? orders.length : orders.filter(o => {
                const s = o.status || 'Chờ xử lý';
                if (tab === 'Chờ xử lý') return s === 'Chờ xử lý' || s === 'Pending';
                if (tab === 'Đang chuẩn bị') return s === 'Đang chuẩn bị' || s === 'Preparing';
                if (tab === 'Đang giao') return s === 'Đang giao' || s === 'Delivering';
                if (tab === 'Đã hoàn thành') return s === 'Đã hoàn thành' || s === 'Completed';
                if (tab === 'Đã hủy') return s === 'Đã hủy' || s === 'Cancelled';
                return false;
              }).length})
            </button>
          </li>
        ))}
      </ul>

      {filteredOrders.length === 0 ? (
        <p className="text-muted mt-3">Không có đơn hàng nào trong trạng thái này.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Địa chỉ nhận</th>
                <th>Thời gian đặt</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const itemsList = order.items || [];
                const totalVal = order.total !== undefined ? order.total : (order.subtotal || 0);
                const customerName = order.customerName || order.fullName || 'Khách hàng';
                const displayAddress = order.address || 'Không có địa chỉ';
                const displayPhone = order.phone || '';
                const currentStatus = order.status || 'Chờ xử lý';
                
                const isLocked = 
                  currentStatus === 'Đã hủy' || 
                  currentStatus === 'Cancelled' || 
                  currentStatus === 'Đã hoàn thành' || 
                  currentStatus === 'Completed';

                return (
                  <tr key={order.id || order.orderCode}>
                    <td>#{order.id || order.orderCode}</td>
                    <td className="fw-bold">
                      {customerName}
                      {displayPhone && <div className="small text-muted">{displayPhone}</div>}
                    </td>
                    <td>
                      {itemsList.map((item, idx) => (
                        <div key={idx} className="small">
                          {item.product_name || item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="fw-bold text-danger">
                      {Number(totalVal).toLocaleString()} đ
                    </td>
                    <td>{displayAddress}</td>
                    <td className="small text-muted text-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td>{getStatusBadge(currentStatus)}</td>
                    <td>
                      {isLocked ? (
                        <span className="text-muted small fst-italic">Không thể thay đổi ({currentStatus})</span>
                      ) : (
                        <select 
                          className="form-select form-select-sm" 
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{ minWidth: '150px' }}
                        >
                          <option value="Chờ xử lý">Chờ xử lý</option>
                          <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã hoàn thành">Đã hoàn thành</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TOAST THÔNG BÁO GÓC DƯỚI BÊN PHẢI --- */}
      <div 
        className={`toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-4 shadow ${showToast ? 'show' : 'hide'}`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{ zIndex: 1050, minWidth: '250px' }}
      >
        <div className="d-flex">
          <div className="toast-body fw-bold">
            ✅ {toastMessage}
          </div>
        </div>
      </div>
    </div>
  );
}
