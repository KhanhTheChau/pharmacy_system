import React, { useEffect, useState } from "react";
import DataTable, { type Column } from "../../components/layout/DataTable";
import { fetchHoaDons } from "../../services/hoaDonApi";
import type { HoaDonType } from "../../types/hoaDon";
import type { KhachHangType } from "../../types/khachHang";
import { formatCurrency } from "../../types/utils";
import PrintButton from "../../components/layout/print/PrintButton";
import CheckHoaDon from "../../components/layout/CheckHoaDon";

const HoaDon: React.FC = () => {
  const [hoaDons, setHoaDons] = useState<HoaDonType[]>([]);
  const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDonType | null>(null);
  // const [showKhachHangModal, setShowKhachHangModal] = useState(false);
  const [khachHang, setKhachHang] = useState<KhachHangType | null>(null);
  // const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchHoaDons();
        setHoaDons(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      }
    };

    getData();
  }, []);

  const handleRowClick = (row: HoaDonType) => {
    setSelectedHoaDon(row);
  };

  const columns: Column<HoaDonType>[] = [
    {
      key: "KhachHang",
      label: "Tên KH",
      sortValue: (row) => row.KhachHang?.TenKhachHang ?? "",
      render: (_, record) => (
        <div
          onClick={() => {
            setKhachHang(record.KhachHang ?? null);
            // setShowKhachHangModal(true);
          }}
          className="text-black cursor-pointer relative group"
        >
          {record.KhachHang?.TenKhachHang ?? "N/A"}
          <div className="absolute z-10 hidden group-hover:block bg-white border shadow p-2 text-ml w-64 left-1/2 -translate-x-1/2 top-full mt-1">
            <p>
              <strong>SĐT:</strong> {record.KhachHang?.SoDienThoai}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {record.KhachHang?.DiaChi}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "NgayLap",
      label: "Ngày lập",
      sortValue: (row) => new Date(row.NgayLap).getTime(),
      render: (_, record) =>
        new Date(record.NgayLap).toLocaleDateString("vi-VN"),
    },
    {
      key: "TongTien",
      label: "Tổng tiền",
      sortValue: (row) => row.TongTien,
      render: (_, record) => formatCurrency(record.TongTien),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <DataTable<HoaDonType>
          data={hoaDons}
          columns={columns}
          title="Danh sách hóa đơn"
          onRowClick={handleRowClick}
          selectedRowId={selectedHoaDon?.MaHoaDon}
          rowKey="MaHoaDon"
        />
      </div>

      <div className="col-span-1 p-4 shadow rounded border border-[#ccc] overflow-y-auto max-h-[95vh]">
        <h3 className="text-lg font-bold">Chi tiết hóa đơn</h3>
        <hr />
        {selectedHoaDon && (
          <div className="mb-4 text-sm space-y-1 mt-2">
            <h3 className="text-lg font-medium">Thông tin khách hàng</h3>
            <p>
              <strong>Họ tên:</strong> {selectedHoaDon.KhachHang?.TenKhachHang}
            </p>
            <p>
              <strong>SĐT:</strong> {selectedHoaDon.KhachHang?.SoDienThoai}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedHoaDon.KhachHang?.DiaChi}
            </p>
          </div>
        )}

        {selectedHoaDon?.ChiTiet?.length ? (
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Tên thuốc</th>
                <th className="border px-2 py-1 text-right">Số lượng</th>
                <th className="border px-2 py-1 text-right">Giá bán</th>
              </tr>
            </thead>
            <tbody>
              {selectedHoaDon.ChiTiet.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">
                    {item.Thuoc?.TenThuoc ?? "N/A"}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {item.SoLuongBan}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    {formatCurrency(item.GiaBan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chọn hóa đơn để xem chi tiết.</p>
        )}

        {selectedHoaDon && (
          <div className="grid grid-cols-1 gap-1 mt-4">
            <div>
              <PrintButton
                khachHang={selectedHoaDon.KhachHang?.TenKhachHang || "N/A"}
                diaChi={selectedHoaDon.KhachHang?.DiaChi || "N/A"}
                sdt={selectedHoaDon.KhachHang?.SoDienThoai || "N/A"}
                items={
                  selectedHoaDon.ChiTiet?.map((item) => ({
                    tenSanPham: item.Thuoc?.TenThuoc || "N/A",
                    donViTinh: item.Thuoc?.Loai?.DonViTinh || "",
                    soLuong: item.SoLuongBan,
                    donGia: item.GiaBan,
                  })) || []
                }
                ngayLap={new Date(selectedHoaDon.NgayLap)}
              />
            </div>
            <div>
              {selectedHoaDon?.ChiTiet && (
                <CheckHoaDon chiTietList={selectedHoaDon.ChiTiet} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoaDon;
