import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import Home from './pages/Home/Home';
import NotFound from "./pages/NotFound/NotFound";
import MainLayout from "./components/layout/MainLayout";
import KhachHang from "./pages/KhachHang/KhachHang";
import DangNhap from "./pages/DangNhap/DangNhap";
import HangSX from "./pages/HangSX/HangSX";
import LoaiThuoc from "./pages/LoaiThuoc/LoaiThuoc";
import NhaCungCap from "./pages/NhaCC/NhaCC";
import HoaDon from "./pages/HoaDon/HoaDon";

import "./icon";
import Thuoc from "./pages/Thuoc/Thuoc";
import ThongKe from "./pages/ThongKe/ThongKe";
import DangKy from "./pages/DangNhap/DangKy";
import PrivateRoute from "./routes/PrivateRoute";
import { ToastContainer } from "react-toastify";
import TheoDoi from "./pages/TheoDoi/TheoDoi";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/thong-ke" replace />}
          />

          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              {/* <Route path="/admin" element={<Home />} /> */}
              <Route path="/admin/khach-hang" element={<KhachHang />} />
              <Route path="/admin/thuoc" element={<Thuoc />} />
              <Route path="/admin/hangsx" element={<HangSX />} />
              <Route path="/admin/loai-thuoc" element={<LoaiThuoc />} />
              <Route path="/admin/nha-cung-cap" element={<NhaCungCap />} />
              <Route path="/admin/thong-ke" element={<ThongKe />} />
              <Route path="/admin/hoa-don" element={<HoaDon />}></Route>
              <Route path="/admin/theo-doi" element={<TheoDoi />}></Route>
            </Route>
          </Route>

          <Route path="/admin/dang-nhap" element={<DangNhap />} />
          <Route path="/admin/dang-ky" element={<DangKy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

       <ToastContainer />
    </>
  );
}

export default App;
