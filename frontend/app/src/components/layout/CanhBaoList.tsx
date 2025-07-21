import React, { useEffect, useState } from "react";
import { fetchInvoiceDetail } from "../../services/hoaDonApi";
import type { ChiTietHoaDonType } from "../../types/hoaDon";
import { fetchAllCanhBao } from "../../services/theodoiApi";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faPills,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

type CanhBaoItem = {
  MaHoaDon: string;
  MaChiTietHD: string;
  KhachHang: string;
  CanhBao: string[];
};

const CanhBaoList: React.FC = () => {
  const [data, setData] = useState<CanhBaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CanhBaoItem | null>(null);

  const [invoiceDetail, setInvoiceDetail] = useState<ChiTietHoaDonType | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAllCanhBao()
      .then((res) => {
        setData(res);
        toast.error(`Phát hiện ${res.length} hóa đơn có bất thường`);
      })
      .catch((err) => {
        console.error("Lỗi khi tải cảnh báo:", err);
        toast.error("Không thể tải danh sách cảnh báo");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) {
      setLoadingDetail(true);
      setInvoiceDetail(null);

      fetchInvoiceDetail(selected.MaChiTietHD)
        .then((data) => setInvoiceDetail(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingDetail(false));
    }
  }, [selected]);

  if (loading) return <div className="p-4">Đang tải cảnh báo...</div>;

  return (
    <div
      className={`grid gap-4 transition-all ${
        selected ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {/* Danh sách cảnh báo */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto border border-[#ccc] rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="mr-2 w-5 h-5"
          />
          Hóa đơn bất thường
        </h2>
        {data.length === 0 ? (
          <div className="text-gray-500">Không có cảnh báo nào.</div>
        ) : (
          data.map((item, index) => (
            <div
              key={`${item.MaHoaDon}-${item.MaChiTietHD}-${index}`}
              className={`border rounded-md p-4 shadow-sm cursor-pointer transition ${
                selected?.MaChiTietHD === item.MaChiTietHD
                  ? "bg-red-200 border-red-500"
                  : "bg-red-50 border-red-300 hover:bg-red-100"
              }`}
              onClick={() => setSelected(item)}
            >
              <p>
                <strong>Mã hóa đơn:</strong> {item.MaHoaDon}
              </p>
              <p>
                <strong>Mã chi tiết hóa đơn:</strong> {item.MaChiTietHD}
              </p>
              <p>
                <strong>Khách Hàng:</strong> {item.KhachHang}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Chi tiết */}
      {selected && (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-2">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2 w-5 h-5" />
            Chi tiết cảnh báo
          </h3>
          <p>
            <strong>Mã Hóa Đơn:</strong> {selected.MaHoaDon}
          </p>
          <p>
            <strong>Mã Chi Tiết HĐ:</strong> {selected.MaChiTietHD}
          </p>
          <p>
            <strong>Khách Hàng:</strong> {selected.KhachHang}
          </p>
          <div className="mt-2">
            <strong>Cảnh Báo:</strong>
            <ul className="list-disc list-inside text-red-700 mt-1">
              {selected.CanhBao.map((cb, i) => (
                <li key={i}>{cb}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">
              <FontAwesomeIcon icon={faPills} className="mr-2 w-5 h-5" />
              Thông tin thuốc
            </h4>
            {loadingDetail ? (
              <p className="text-gray-500 italic">Đang tải chi tiết...</p>
            ) : invoiceDetail ? (
              <table className="text-sm w-full border border-gray-200 rounded-md overflow-hidden">
                <tbody>
                  <tr className="even:bg-gray-50">
                    <td className="p-2 font-medium border">Tên thuốc</td>
                    <td className="p-2 border">
                      {invoiceDetail.Thuoc?.TenThuoc || "không rõ"}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="p-2 font-medium border">Công dụng</td>
                    <td className="p-2 border">
                      {invoiceDetail.Thuoc?.CongDung || "không rõ"}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="p-2 font-medium border">Số lượng bán</td>
                    <td className="p-2 border">
                      {invoiceDetail.SoLuongBan}{" "}
                      {invoiceDetail.Thuoc?.Loai?.DonViTinh || ""}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="p-2 font-medium border">Giá bán</td>
                    <td className="p-2 border">{invoiceDetail.GiaBan} đ</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="p-2 font-medium border">Đơn giá niêm yết</td>
                    <td className="p-2 border">
                      {invoiceDetail.Thuoc?.DonGia || "?"} đ
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="p-2 font-medium border">Hãng sản xuất</td>
                    <td className="p-2 border">
                      {invoiceDetail.Thuoc?.HangSX?.TenHangSX || "?"} (
                      {invoiceDetail.Thuoc?.HangSX?.QuocGia || "?"})
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="p-2 font-medium border">Nhà cung cấp</td>
                    <td className="p-2 border">
                      {invoiceDetail.Thuoc?.NhaCungCap?.TenNCC || "?"}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 italic">Không có dữ liệu chi tiết.</p>
            )}
          </div>

          <button
            onClick={() => setSelected(null)}
            className="mt-6 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default CanhBaoList;
