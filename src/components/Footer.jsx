import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top border-secondary">
      <div className="container">
        {/* Các cột điều hướng chính */}
        <div className="row g-4 mb-4">
          {/* Cột 1: Danh Mục Món Ăn */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-uppercase text-white">Danh Mục Món Ăn</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2">
              <li><a href="/" className="text-decoration-none text-light opacity-75 hover-opacity-100">Ưu Đãi</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">ĐỒNG GIÁ SIÊU HỜI</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Món Mới</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Combo 1 Người</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Combo Nhóm</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Gà Rán - Gà Quay</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Burger - Cơm - Mì Ý</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Thức Ăn Nhẹ</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Thức Uống & Tráng Miệng</a></li>
            </ul>
          </div>

          {/* Cột 2: Về KFC / ShopeeFood */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-uppercase text-white">Về ShopeeFood</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2">
              <li><a href="/" className="text-decoration-none text-light opacity-75">Câu chuyện của chúng tôi</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Tin khuyến mãi</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Tin tức</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Tuyển dụng</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Đặt tiệc sinh nhật</a></li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 text-uppercase text-white">Liên hệ</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2">
              <li><a href="/" className="text-decoration-none text-light opacity-75">Theo dõi đơn hàng</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Hệ thống nhà hàng</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Liên hệ góp ý</a></li>
            </ul>
          </div>

          {/* Cột 4: Chính sách */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase text-white">Chính sách</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2">
              <li><a href="/" className="text-decoration-none text-light opacity-75">Chính sách hoạt động</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Chính sách và quy định</a></li>
              <li><a href="/" className="text-decoration-none text-light opacity-75">Chính sách bảo mật thông tin</a></li>
            </ul>
          </div>

          {/* Cột 5: Download App & Social */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase text-white">Download App</h6>
            <div className="d-flex flex-column gap-2 mb-3">
              <div className="bg-secondary bg-opacity-25 border border-secondary rounded px-3 py-2 d-inline-block" style={{ width: '150px', cursor: 'pointer' }}>
                <div className="small text-muted" style={{ fontSize: '0.65rem' }}>Download on the</div>
                <div className="fw-bold small">App Store</div>
              </div>
              <div className="bg-secondary bg-opacity-25 border border-secondary rounded px-3 py-2 d-inline-block" style={{ width: '150px', cursor: 'pointer' }}>
                <div className="small text-muted" style={{ fontSize: '0.65rem' }}>GET IT ON</div>
                <div className="fw-bold small">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dòng copyright và mạng xã hội */}
        <hr className="border-secondary my-4" />
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-3">
          <p className="small text-muted mb-0">Copyright &copy; 2026 ShopeeFood FE &amp; KFC Vietnam Style</p>
          <div className="d-flex gap-3">
            <a href="/" className="text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', textDecoration: 'none' }}>f</a>
            <a href="/" className="text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', textDecoration: 'none' }}>ig</a>
            <a href="/" className="text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', textDecoration: 'none' }}>yt</a>
            <a href="/" className="text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', textDecoration: 'none' }}>tw</a>
          </div>
        </div>

        {/* Thông tin công ty & Chứng nhận Bộ Công Thương */}
        <hr className="border-secondary my-3" />
        <div className="row align-items-center py-2">
          <div className="col-md-9">
            <h6 className="fw-bold text-white mb-2">CÔNG TY LIÊN DOANH TNHH KFC VIỆT NAM</h6>
            <p className="small text-muted mb-1">Số 292 Bà Triệu, P. Lê Đại Hành, Q. Hai Bà Trưng, TP. Hà Nội.</p>
            <p className="small text-muted mb-1">Điện thoại: (028) 38489828 &bull; Email: lienhe@kfcvietnam.com.vn</p>
            <p className="small text-muted mb-0">Mã số thuế: 0100773885 &bull; Ngày cấp: 29/10/1998 - Nơi cấp: Cục Thuế Thành Phố Hà Nội</p>
          </div>
          <div className="col-md-3 text-md-end mt-3 mt-md-0">
            <div className="d-inline-block bg-primary text-white fw-bold px-3 py-2 rounded small shadow-sm" style={{ letterSpacing: '0.5px' }}>
              🛡️ ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}