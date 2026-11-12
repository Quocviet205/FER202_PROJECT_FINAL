import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // State form thêm/sửa sản phẩm
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Đang bán'); // Thêm state trạng thái
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/products'),
        axiosClient.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setCategoryId(catRes.data[0].id || catRes.data[0].category_id);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu quản lý món:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      product_name: productName,
      name: productName,
      price: Number(price),
      category_id: categoryId,
      image_url: imageUrl,
      image: imageUrl,
      status: status, // Lưu trạng thái
      is_active: status === 'Đang bán'
    };

    try {
      if (editingId) {
        await axiosClient.put(`/products/${editingId}`, productData);
        alert('Cập nhật món ăn thành công!');
        setEditingId(null);
      } else {
        await axiosClient.post('/products', productData);
        alert('Thêm món ăn thành công!');
      }
      setProductName('');
      setPrice('');
      setImageUrl('');
      setStatus('Đang bán');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id || product.product_id);
    setProductName(product.product_name || product.name);
    setPrice(product.price);
    setCategoryId(product.category_id);
    setImageUrl(product.image_url || product.image);
    setStatus(product.status || (product.is_active ? 'Đang bán' : 'Hết hàng'));
  };

  // Hàm thay đổi nhanh trạng thái ngay trên bảng
  const handleToggleStatus = async (product) => {
    const currentStatus = product.status || (product.is_active ? 'Đang bán' : 'Hết hàng');
    const newStatus = currentStatus === 'Đang bán' ? 'Hết hàng' : 'Đang bán';
    const prodId = product.id || product.product_id;

    try {
      await axiosClient.patch(`/products/${prodId}`, {
        status: newStatus,
        is_active: newStatus === 'Đang bán'
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Không thể thay đổi trạng thái!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món này không?')) {
      try {
        await axiosClient.delete(`/products/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Xóa thất bại!');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Món ăn</h2>
      
      {/* Form thêm / sửa món ăn */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm bg-light">
        <h5>{editingId ? 'Cập nhật thông tin món' : 'Thêm món ăn mới'}</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tên món" 
              value={productName} 
              onChange={e => setProductName(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-2">
            <input 
              type="number" 
              className="form-control" 
              placeholder="Giá (VND)" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-2">
            <select 
              className="form-select" 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id || cat.category_id} value={cat.id || cat.category_id}>
                  {cat.category_name || cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select 
              className="form-select" 
              value={status} 
              onChange={e => setStatus(e.target.value)}
            >
              <option value="Đang bán">Đang bán</option>
              <option value="Hết hàng">Hết hàng</option>
            </select>
          </div>
          <div className="col-md-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="URL Hình ảnh" 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              required 
            />
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-success me-2">
            {editingId ? 'Lưu thay đổi' : 'Thêm món'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setEditingId(null);
                setProductName('');
                setPrice('');
                setImageUrl('');
                setStatus('Đang bán');
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Bảng danh sách sản phẩm */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Hình ảnh</th>
              <th>Tên món</th>
              <th>Giá</th>
              <th>Trạng thái (Click để đổi)</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const prodId = product.id || product.product_id;
              const prodName = product.product_name || product.name;
              const prodImg = product.image_url || product.image;
              const currentStatus = product.status || (product.is_active ? 'Đang bán' : 'Hết hàng');

              return (
                <tr key={prodId}>
                  <td>
                    <img src={prodImg} alt={prodName} width="50" height="50" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td className="fw-bold">{prodName}</td>
                  <td className="text-danger fw-bold">{Number(product.price).toLocaleString()} đ</td>
                  <td>
                    {/* Bấm vào huy hiệu trạng thái để chuyển đổi nhanh giữa Đang bán và Hết hàng */}
                    <span 
                      className={`badge ${currentStatus === 'Đang bán' ? 'bg-success' : 'bg-secondary'}`} 
                      style={{ cursor: 'pointer' }}
                      title="Bấm để đổi trạng thái"
                      onClick={() => handleToggleStatus(product)}
                    >
                      {currentStatus}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(product)}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prodId)}>Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
