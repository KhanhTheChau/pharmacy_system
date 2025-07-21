import React, { forwardRef } from "react";

type InvoiceItem = {
  tenSanPham: string;
  donViTinh: string;
  soLuong: number;
  donGia: number;
};

export type HoaDonPrintProps = {
  khachHang: string;
  diaChi: string;
  items: InvoiceItem[];
  ngayLap: Date;
  sdt: string;
};

// component in ra, dùng forwardRef để ReactToPrint hoạt động
const HoaDonPrint = forwardRef<HTMLDivElement, HoaDonPrintProps>(
  ({ khachHang, diaChi, items, ngayLap, sdt }, ref) => {
    const tongTien = items.reduce(
      (sum, item) => sum + item.soLuong * item.donGia,
      0
    );

    return (
      <div ref={ref} className="p-6 font-[serif] text-[14px]">
        <h2 className="text-center text-xl font-bold text-black mb-1 uppercase">
          Pharmacy System
        </h2>
        <p className="text-center text-sm">
          ĐC: Đại học Cần Thơ <br />
          Tel: 08xx.xxx.xxx
        </p>
        <h3 className="text-center text-lg font-bold mt-4 mb-4 text-black uppercase">
          HÓA ĐƠN BÁN HÀNG
        </h3>

        <div>
          <p>
            <strong>Tên khách hàng:</strong> {khachHang}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {diaChi}
          </p>
           <p>
            <strong>Số điện thoại:</strong> {sdt}
          </p>
        </div>

        <table className="table-auto w-full border border-black text-sm border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-1 text-center">TT</th>
              <th className="border border-black px-2 py-1 text-left">
                Tên sản phẩm
              </th>
              <th className="border border-black px-2 py-1 text-center">ĐVT</th>
              <th className="border border-black px-2 py-1 text-center">SL</th>
              <th className="border border-black px-2 py-1 text-right">
                Đơn giá
              </th>
              <th className="border border-black px-2 py-1 text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border border-black px-2 py-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-black px-2 py-1">
                  {item.tenSanPham}
                </td>
                <td className="border border-black px-2 py-1 text-center">
                  {item.donViTinh}
                </td>
                <td className="border border-black px-2 py-1 text-center">
                  {item.soLuong}
                </td>
                <td className="border border-black px-2 py-1 text-right">
                  {item.donGia.toLocaleString()}
                </td>
                <td className="border border-black px-2 py-1 text-right">
                  {(item.soLuong * item.donGia).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr>
              <td
                colSpan={5}
                className="border border-black px-2 py-1 text-right font-bold"
              >
                TỔNG CỘNG
              </td>
              <td className="border border-black px-2 py-1 text-right font-bold">
                {tongTien.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 italic">
          Cộng thành tiền (viết bằng chữ): ………………………………………
        </p>

        <div className="mt-6 w-full flex justify-between text-sm">
          <div className="w-1/3 text-center">
            <br />
            <p className="font-medium">KHÁCH HÀNG</p>
          </div>
          <div className="w-1/3 text-center">
            <p>
              Ngày {ngayLap.getDate()} tháng {ngayLap.getMonth() + 1} năm{" "}
              {ngayLap.getFullYear()}
            </p>
            <p className="font-medium">NGƯỜI VIẾT HÓA ĐƠN</p>
          </div>
        </div>
      </div>
    );
  }
);

export default HoaDonPrint;
