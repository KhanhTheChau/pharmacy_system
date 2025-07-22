import React, { useEffect, useState } from "react";
import type { HoaDonType } from "../../types/hoaDon";
import { getInvoicesByDate } from "../../services/thongKeApi";
import CheckHoaDon from "./CheckHoaDon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCircleInfo, faTimes } from "@fortawesome/free-solid-svg-icons";

const formatDate = (d: Date) => d.toISOString().split("T")[0];

const InvoiceStatisticsByDate: React.FC = () => {
  const [date, setDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<HoaDonType | null>(
    null
  );
  const [data, setData] = useState<{
    chiTiet: HoaDonType[];
    soHoaDon: number;
    soKhachHang: number;
    soThuocBanRa: number;
    tongTienThu: number;
  } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setSelectedInvoice(null);
    try {
      const result = await getInvoicesByDate(date);
      setData(result);
      //   console.log(result)
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  return (
    <div className="bg-white p-6 rounded-md shadow border border-[#ccc] space-y-4">
      <h3 className="text-lg font-semibold mb-2">
        <FontAwesomeIcon icon={faChartLine} className="mr-2 w-5 h-5" />
        Thống kê hôm nay
      </h3>
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Chọn ngày:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      {data ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="bg-blue-100 p-3 rounded shadow">
              <div className="text-gray-600">Số hóa đơn</div>
              <div className="text-xl font-bold">
                {loading ? "..." : data.soHoaDon}
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded shadow">
              <div className="text-gray-600">Khách hàng</div>
              <div className="text-xl font-bold">
                {loading ? "..." : data.soKhachHang}
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded shadow">
              <div className="text-gray-600">Thuốc bán ra</div>
              <div className="text-xl font-bold">
                {loading ? "..." : data.soThuocBanRa}
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded shadow">
              <div className="text-gray-600">Tổng tiền</div>
              <div className="text-xl font-bold">
                {loading ? "..." : data.tongTienThu.toLocaleString() + " đ"}
              </div>
            </div>
          </div>

          <div
            className={`grid gap-4 ${
              selectedInvoice ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-8">
                  Đang tải dữ liệu...
                </p>
              ) : (
                <table className="w-full border rounded text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="p-2 border">STT</th>
                      <th className="p-2 border">Ngày lập</th>
                      <th className="p-2 border">Khách hàng</th>
                      <th className="p-2 border">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.chiTiet.map((hd, index) => (
                      <tr
                        key={hd.MaHoaDon}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedInvoice(hd)}
                      >
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">
                          {new Date(hd.NgayLap).toLocaleString("vi-VN")}
                        </td>
                        <td className="p-2 border">
                          {hd.KhachHang?.TenKhachHang || "-"}
                        </td>
                        <td className="p-2 border">
                          {hd.TongTien.toLocaleString()} đ
                        </td>
                      </tr>
                    ))}
                    {data?.chiTiet.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-500"
                        >
                          Không có hóa đơn trong ngày.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {selectedInvoice && (
              <div className="border border-gray-400 rounded-md p-4 bg-gray-50 min-h-[300px]">
                {loading ? (
                  <p className="text-center text-gray-400 italic py-10">
                    Đang tải chi tiết...
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center">
                        <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
                        Chi tiết hóa đơn
                      </h2>

                      <button
                        onClick={() => setSelectedInvoice(null)}
                        className="text-xl text-gray-600 hover:text-red-600 transition-colors"
                        title="Đóng"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Khách hàng:</strong>{" "}
                        {selectedInvoice.KhachHang?.TenKhachHang}
                      </p>
                      <p>
                        <strong>Ngày lập:</strong>{" "}
                        {new Date(selectedInvoice.NgayLap).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {selectedInvoice.TongTien.toLocaleString()} đ
                      </p>
                    </div>

                    <div className="overflow-x-auto mt-4">
                      <div className="max-h-[400px] overflow-y-auto">
                        <table className="min-w-full text-sm border border-gray-500 border-collapse table-fixed">
                          <thead className="bg-gray-100 ">
                            <tr className="border border-gray-500">
                              <th className="border border-gray-500 px-3 py-2 text-left font-semibold">
                                Tên thuốc
                              </th>
                              <th className="border border-gray-500 px-3 py-2 text-center">
                                Số lượng
                              </th>
                              <th className="border border-gray-500 px-3 py-2 text-right">
                                Đơn giá
                              </th>
                              <th className="border border-gray-500 px-3 py-2 text-right">
                                Thành tiền
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(selectedInvoice.ChiTiet ?? []).map((ct) => (
                              <tr
                                key={ct.MaChiTietHD}
                                className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <td className="border border-gray-500 px-3 py-2">
                                  {ct.Thuoc?.TenThuoc}
                                </td>
                                <td className="border border-gray-500 px-3 py-2 text-center">
                                  {ct.SoLuongBan}
                                </td>
                                <td className="border border-gray-500 px-3 py-2 text-right">
                                  {ct.GiaBan.toLocaleString()} đ
                                </td>
                                <td className="border border-gray-500 px-3 py-2 text-right">
                                  {(ct.SoLuongBan * ct.GiaBan).toLocaleString()}{" "}
                                  đ
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      {selectedInvoice?.ChiTiet && (
                        <CheckHoaDon chiTietList={selectedInvoice.ChiTiet} />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Không có thuốc nào được bán.</p>
      )}
    </div>
  );
};

export default InvoiceStatisticsByDate;
