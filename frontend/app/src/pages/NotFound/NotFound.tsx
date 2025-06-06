import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-black text-center">
      <h1 className="text-6xl font-bold text-[#12B0C2] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-black mb-4">Trang Không Tìm Thấy</h2>
      <p className="text-gray-600 mb-6">
        Đường dẫn bạn truy cập không tồn tại trong hệ thống quản lý nhà thuốc.
      </p>
      <Link
        to="/admin/khach-hang"
        className="bg-[#12B0C2] text-white px-6 py-2 rounded hover:bg-[#0e8a9b] transition"
      >
        Quay lại Trang Khách Hàng
      </Link>
    </div>
  );
};

export default NotFound;