import React, { useEffect, useState } from "react";
import DataTable, { type Column } from "../../components/layout/DataTable";
import { fetchHoaDons } from "../../services/hoaDonApi";
import type { HoaDonType } from "../../types/hoaDon";
import type { KhachHangType } from "../../types/khachHang";
import { formatCurrency } from "../../types/utils";

const HoaDon: React.FC = () => {
  const [hoaDons, setHoaDons] = useState<HoaDonType[]>([]);
  const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDonType | null>(null);
  const [showKhachHangModal, setShowKhachHangModal] = useState(false);
  const [khachHang, setKhachHang] = useState<KhachHangType | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

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
            setShowKhachHangModal(true);
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
    // {
    //     key: "ChiTiet",
    //     label: "Chi tiết",
    //     render: (_, record) => (
    //         <button
    //             onClick={() => handleRowClick(record)}
    //             className="text-sm text-blue-500 hover:underline"
    //         >
    //             Xem chi tiết
    //         </button>
    //     ),
    // },
  ];

//   const handleExportJson = () => {
//     exportToJson<HoaDonType>(hoaDons, "hoa_don");
//   };

//   const buttonClass =
//     "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";


  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Danh sách hóa đơn ở giữa */}
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

      {/* Chi tiết hóa đơn ở bên phải */}
      <div className="col-span-1 p-4 shadow rounded border border-[#ccc] overflow-y-auto max-h-[95vh]">
        <h3 className="text-lg font-semibold mb-4">Chi tiết hóa đơn</h3>
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

        {/* <div className="p-4 shadow rounded border border-[#ccc]">
          <h3 className="font-semibold mb-4">Xuất file</h3>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label>Xuất file Excel:</label>
            <button onClick={handleExportExcel} className={buttonClass}>
              Export to excel
            </button>

            <label>Xuất file Json:</label>
            <button onClick={handleExportJson} className={buttonClass}>
              Export to json
            </button>
          </div>
        </div> */}
      </div>

      {/* Modal Thông tin khách hàng */}
    </div>
  );
};

export default HoaDon;
