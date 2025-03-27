import React from 'react';
import '../css/layout.css';
import logo from '../assets/logo.png';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();

  return (
    <div>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Libre+Franklin:ital,wght@0,100..900;1,100..900&family=Noto+Sans+HK:wght@100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
      </style>
      <div className="header position-zero">
        <div className="header-1">
          <a href="/giangvien/">
            <img className="logo" src={logo} alt="logo" />
          </a>
          <h2>Giảng viên</h2>
        </div>
        <div className="header-2">
          <a href="/giangvien/thongtin" className="header-link">
            <h3 style={{ color: location.pathname === '/giangvien/thongtin' ? 'white' : 'black' }}>Thông tin</h3>
          </a>
          <a href="/giangvien/lichgiangday" className="header-link">
            <h3 style={{ color: location.pathname === '/giangvien/lichgiangday' ? 'white' : 'black' }}>Lịch giảng dạy</h3>
          </a>
          <a href="/giangvien/datphong" className="header-link">
            <h3 style={{ color: location.pathname === '/giangvien/datphong' ? 'white' : 'black' }}>Mượn phòng</h3>
          </a>
          <a href="/giangvien/thongbao" className="header-link">
            <h3 style={{ color: location.pathname === '/giangvien/thongbao' ? 'white' : 'black' }}>Thông báo</h3>
          </a>
        </div>
        <div style={{ marginRight: "35px" }}>
          <button className="btn-dang-suat">
            Đăng xuất
          </button>
        </div>
      </div>
      <main>{children}</main>
      <footer style={{ backgroundColor: '#f1f1f1', padding: '10px', textAlign: 'center' }}>
        <p style={{ color: '#333', fontWeight: 'bold' }}>Thông tin tác giả: Nguyễn Sỹ Kim Bằng</p>
        <p style={{ color: '#666' }}>Được thiết kế vào năm 2025</p>
        <p style={{ color: '#666' }}>Thông tin liên lạc: 0867809347</p>
      </footer>
    </div>
  );
}

export default Layout;
