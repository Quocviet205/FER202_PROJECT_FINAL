import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../context/AuthContext';

export default function Cart() {
  const [cart, setCart] = useState([]);
  
  // State quản lý thông tin giao hàng chi tiết
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  
  // State quản lý phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('Thanh toán khi nhận hàng (COD)');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State quản lý Modal thông báo đặt hàng thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    
    if (user && user.fullName) {
      setReceiverName(user.fullName);
    }
  }, [user]);

  const saveAndSyncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (id, delta) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);

    saveAndSyncCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    saveAndSyncCart(updated);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotalAmount = totalAmount + 15000; // Tổng tiền + phí ship

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Giỏ hàng đang trống!');

    const fullAddress = `${detailAddress}, ${district}, ${province}`;

    const orderData = {
      userId: user ? user.id : 2,
      customerName: receiverName,
      phone: phone,
      address: fullAddress,
      items: cart,
      subtotal: totalAmount,
      shippingFee: 15000,
      total: finalTotalAmount,
      paymentMethod: paymentMethod,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString()
    };

    try {
      await axiosClient.post('/orders', orderData);
      saveAndSyncCart([]);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert('Lỗi đặt hàng, vui lòng thử lại!');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/orders');
  };

  return (
    <div className="container mt-4 position-relative">
      <h2>Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <p className="text-muted mt-3">Chưa có món nào trong giỏ hàng.</p>
      ) : (
        <div className="row mt-3">
          <div className="col-md-7">
            <ul className="list-group mb-3">
              {cart.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} width="50" height="50" style={{ objectFit: 'cover', borderRadius: '4px' }} />}
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">{Number(item.price).toLocaleString()} đ</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => removeItem(item.id)}>Xóa</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* --- HIỂN THỊ CHI TIẾT TỔNG TIỀN (ĐÃ GỒM PHÍ SHIP) --- */}
            <div className="card p-3 bg-light border-0">
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng tiền món:</span>
                <span className="fw-bold">{totalAmount.toLocaleString()} đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span className="fw-bold">15.000 đ</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5 text-dark">Tổng thanh toán:</span>
                <span className="fw-bold fs-4 text-danger">{finalTotalAmount.toLocaleString()} đ</span>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card p-3 shadow-sm">
              <h5 className="card-title mb-3">Thông tin giao hàng</h5>
              <form onSubmit={handleCheckout}>
                <div className="mb-3">
                  <label className="form-label">Họ tên người nhận</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={receiverName} 
                    onChange={(e) => setReceiverName(e.target.value)} 
                    placeholder="Nhập họ tên người nhận..." 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Nhập số điện thoại..." 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tỉnh / Thành phố</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={province} 
                    onChange={(e) => setProvince(e.target.value)} 
                    placeholder="Ví dụ: Hà Nội, TP.HCM..." 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Quận / Huyện / Xã</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)} 
                    placeholder="Ví dụ: Huyện Thạch Thất, Xã Bình Yên..." 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Thôn / Số nhà / Tên đường</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={detailAddress} 
                    onChange={(e) => setDetailAddress(e.target.value)} 
                    placeholder="Ví dụ: Thôn 1, số nhà 15..." 
                    required 
                  />
                </div>

                {/* --- PHƯƠNG THỨC THANH TOÁN --- */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Phương thức thanh toán</label>
                  <div className="form-check mb-2">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="paymentMethod" 
                      id="cod" 
                      value="Thanh toán khi nhận hàng (COD)" 
                      checked={paymentMethod === 'Thanh toán khi nhận hàng (COD)'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                    <label className="form-check-label" htmlFor="cod">
                      💵 Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>

                  <div className="form-check mb-2">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="paymentMethod" 
                      id="banking" 
                      value="Chuyển khoản ngân hàng" 
                      checked={paymentMethod === 'Chuyển khoản ngân hàng'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                    <label className="form-check-label" htmlFor="banking">
                      🏦 Chuyển khoản ngân hàng (QR Code)
                    </label>
                  </div>

                  {/* Hiển thị QR Code Ngân hàng khi chọn */}
                  {paymentMethod === 'Chuyển khoản ngân hàng' && (
                    <div className="text-center p-3 mb-3 bg-light border rounded">
                      <p className="small fw-bold mb-1 text-primary">Quét mã QR để chuyển khoản</p>
                      <img 
                        src={`https://img.vietqr.io/image/VCB-0971234567-compact2.png?amount=${finalTotalAmount}&addInfo=Thanh%20toan%20don%20hang%20ShopeeFood`} 
                        alt="QR Code Ngân hàng" 
                        style={{ width: '180px', height: '180px', objectFit: 'contain' }} 
                      />
                      <div className="small text-muted mt-1">
                        Ngân hàng: <strong>Vietcombank</strong><br/>
                        STK: <strong>0971234567</strong><br/>
                        Số tiền: <strong className="text-danger">{finalTotalAmount.toLocaleString()} đ</strong>
                      </div>
                    </div>
                  )}

                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="paymentMethod" 
                      id="momo" 
                      value="Ví MoMo" 
                      checked={paymentMethod === 'Ví MoMo'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                    <label className="form-check-label" htmlFor="momo">
                      📱 Ví điện tử MoMo
                    </label>
                  </div>

                  {/* Hiển thị QR Code MoMo khi chọn */}
                  {paymentMethod === 'Ví MoMo' && (
                    <div className="text-center p-3 mb-3 bg-light border rounded">
                      <p className="small fw-bold mb-1 text-danger">Quét mã QR ví MoMo</p>
                      <img 
                        src="https://api.vietqr.io/image/970422-0971234567-q9283fa.jpg?accountName=NGUYEN%20QUOC%20VIET" 
                        alt="QR Code MoMo" 
                        style={{ width: '160px', height: '160px', objectFit: 'contain', background: '#fff' }} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/160?text=MOMO+QR+CODE';
                        }}
                      />
                      <div className="small text-muted mt-1">
                        SĐT MoMo: <strong>0971234567</strong><br/>
                        Chủ ví: <strong>Nguyễn Quốc Việt</strong><br/>
                        Số tiền: <strong className="text-danger">{finalTotalAmount.toLocaleString()} đ</strong>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-danger w-100 fw-bold">Xác nhận Đặt hàng</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL THÔNG BÁO ĐẶT HÀNG THÀNH CÔNG --- */}
      {showSuccessModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Đặt hàng thành công</h5>
              </div>
              <div className="modal-body text-center py-4">
                <h4 className="text-success mb-2">🎉 Đã đặt hàng thành công!</h4>
                <p className="fs-5 text-muted mb-0">Xin cảm ơn Quý khách!</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-success px-5 fw-bold" onClick={handleCloseModal}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}