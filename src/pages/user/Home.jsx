import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State quản lý Modal chi tiết món ăn
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State quản lý Toast thông báo
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    axiosClient.get('/categories').then(res => setCategories(res.data));
    axiosClient.get('/products').then(res => setProducts(res.data));
  }, []);

  const filteredProducts = products.filter(product => {
    // --- LỌC BỎ CÁC MÓN ĐÃ HẾT HÀNG HOẶC NGỪNG BÁN ---
    const status = product.status || '';
    if (status === 'Hết hàng' || status === 'Ngừng bán' || product.isAvailable === false) {
      return false;
    }

    const matchesCategory = selectedCategory === 'all' || 
      product.category_id === Number(selectedCategory) || 
      product.category_id === selectedCategory;
      
    const productName = product.product_name || product.name || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productId = product.id || product.product_id;
    const existingIndex = cart.findIndex(item => item.id === productId);
    
    const cartItem = {
      id: productId,
      name: product.product_name || product.name,
      price: product.price,
      image: product.image_url || product.image,
      quantity: 1
    };

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));

    showNotification(`Đã thêm "${cartItem.name}" vào giỏ hàng!`);
  };

  return (
    <div className="container mt-4 position-relative">
      
      {/* --- BANNER QUẢNG CÁO TRANG CHỦ --- */}
      <div className="mb-4">
        <img 
          src="https://static.kfcvietnam.com.vn/images/content/home/carousel/lg/Party.webp?v=3QjlZL" 
          alt="Banner Khuyến Mãi" 
          className="w-100 rounded shadow-sm" 
          style={{ height: '350px', objectFit: 'cover' }}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <h2>Danh mục món ăn</h2>
        <div style={{ width: '300px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="🔍 Tìm kiếm món ăn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex gap-2 my-3 flex-wrap">
        <button 
          className={`btn ${selectedCategory === 'all' ? 'btn-danger' : 'btn-outline-secondary'}`} 
          onClick={() => setSelectedCategory('all')}
        >
          Tất cả
        </button>
        {categories.map(cat => {
          const catId = cat.id || cat.category_id;
          const catName = cat.category_name || cat.name;
          return (
            <button 
              key={catId} 
              className={`btn ${selectedCategory === catId ? 'btn-danger' : 'btn-outline-secondary'}`} 
              onClick={() => setSelectedCategory(catId)}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="alert alert-warning text-center mt-4">
          Không tìm thấy món ăn nào phù hợp với từ khóa "<strong>{searchTerm}</strong>"!
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => {
            const prodId = product.id || product.product_id;
            const prodName = product.product_name || product.name;
            const prodImage = product.image_url || product.image;

            return (
              <div className="col-md-4 mb-3" key={prodId}>
                <div 
                  className="card h-100 shadow-sm" 
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <img 
                    src={prodImage} 
                    className="card-img-top" 
                    alt={prodName} 
                    style={{ height: '180px', objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fs-6 text-dark fw-bold mb-1">{prodName}</h5>
                      <p className="text-danger fw-bold fs-5 mb-2">{Number(product.price).toLocaleString()} đ</p>
                    </div>
                    <button 
                      className="btn btn-outline-danger w-100 mt-2" 
                      onClick={(e) => addToCart(product, e)}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL HIỂN THỊ CHI TIẾT MÓN ĂN --- */}
      {selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Chi tiết món ăn</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body text-center">
                <img 
                  src={selectedProduct.image_url || selectedProduct.image} 
                  alt={selectedProduct.product_name || selectedProduct.name} 
                  className="img-fluid rounded mb-3 shadow-sm" 
                  style={{ maxHeight: '250px', objectFit: 'cover', width: '100%' }}
                />
                <h4 className="fw-bold text-dark">{selectedProduct.product_name || selectedProduct.name}</h4>
                <p className="text-danger fw-bold fs-4">{Number(selectedProduct.price).toLocaleString()} đ</p>
                <p className="text-muted text-start bg-light p-3 rounded">{selectedProduct.description || 'Chưa có mô tả chi tiết cho món ăn này.'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Đóng</button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast thông báo góc dưới bên phải */}
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