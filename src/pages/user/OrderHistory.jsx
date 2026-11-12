import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  // State quản lý Modal xác nhận hủy đơn hàng
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // State quản lý Toast thông báo góc màn hình
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = () => {
    if (user) {
      axiosClient.get(`/orders?userId=${user.id}`).then(res => {
        setOrders(res.data);
      }).catch(err => {
        console.error("Lỗi lấy đơn hàng:", err);
      });
    }
  };

  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrderId) return;
    try {
      await axiosClient.patch(`/orders/${selectedOrderId}`, {
        status: 'Đã hủy'
      });
      
      setShowCancelModal(false);
      setSelectedOrderId(null);
      
      showNotification('Đã hủy đơn hàng thành công!');
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Không thể hủy đơn hàng, vui lòng thử lại!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': 
      case 'Chờ xử lý': 
        return <span className="badge bg-warning text-dark">Đang chờ xử lý</span>;
      case 'Preparing': return <span className="badge bg-info text-dark">Đang chuẩn bị</span>;
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

  // Hàm định dạng ngày giờ (dd/MM/yyyy HH:mm)
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

  return (
    <div className="container mt-4 position-relative">
      <h2>Lịch sử Đơn hàng</h2>
      {orders.length === 0 ? (
        <p className="text-muted mt-3">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Địa chỉ nhận</th>
                <th>Thời gian đặt</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const itemsList = order.items || [];
                const totalVal = order.total !== undefined ? order.total : (order.totalAmount || 0);
                const displayAddress = order.address || 'Không có địa chỉ';
                const displayPhone = order.phone || '';
                const currentStatus = order.status || 'Chờ xử lý';
                
                const canCancel = currentStatus === 'Chờ xử lý' || currentStatus === 'Pending';

                return (
                  <tr key={order.id || order.orderCode}>
                    <td>#{order.id || order.orderCode}</td>
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
                    <td>{displayAddress} {displayPhone && `(${displayPhone})`}</td>
                    <td className="small text-muted text-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td>{getStatusBadge(currentStatus)}</td>
                    <td>
                      {canCancel ? (
                        <button 
                          className="btn btn-sm btn-outline-danger fw-bold" 
                          onClick={() => openCancelModal(order.id)}
                        >
                          Hủy đơn
                        </button>
                      ) : (
                        <span className="text-muted small">Không thể hủy</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL XÁC NHẬN HỦY ĐƠN HÀNG Ở GIỮA MÀN HÌNH --- */}
      {showCancelModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Xác nhận hủy đơn hàng</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="fs-5 mb-0">Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowCancelModal(false)}>Không</button>
                <button type="button" className="btn btn-danger px-4" onClick={handleConfirmCancel}>Xác nhận hủy</button>
              </div>
            </div>
          </div>
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