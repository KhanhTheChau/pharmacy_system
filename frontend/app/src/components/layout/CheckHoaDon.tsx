import React, { useEffect, useState } from "react";
import type { ChiTietHoaDonType } from "../../types/hoaDon";
import { getCanhBaoByChiTietId } from "../../services/hoaDonApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

type CanhBaoButtonProps = {
  chiTietList: ChiTietHoaDonType[];
};

const CheckHoaDon: React.FC<CanhBaoButtonProps> = ({ chiTietList }) => {
  const [canhBaoList, setCanhBaoList] = useState<
    { tenThuoc: string; message: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonClass =
    "bg-[#12B0C2] text-white px-4 py-2 rounded hover:bg-[#0E8DA1] transition";

  useEffect(() => {
    setCanhBaoList([]);
    setError(null);
  }, [chiTietList]);

  const handleCheckCanhBao = async () => {
    setLoading(true);
    setError(null);
    const warnings: { tenThuoc: string; message: string }[] = [];

    try {
      for (const ct of chiTietList) {
        const data = await getCanhBaoByChiTietId(ct.MaChiTietHD);
        const tenThuoc = ct.Thuoc?.TenThuoc ?? "Không rõ";

        data.forEach((msg: string) => {
          warnings.push({ tenThuoc, message: msg });
        });
      }

      setCanhBaoList(warnings);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi kiểm tra cảnh báo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-2">
      <button
        onClick={handleCheckCanhBao}
        className={buttonClass}
        disabled={loading}
      >
        {loading ? "Đang kiểm tra..." : "Kiểm tra hóa đơn"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {canhBaoList.length > 0 && (
        <div className="mt-4 ">
          <h2 className="text-lg font-bold">
            {" "}
            <FontAwesomeIcon icon={faCircleCheck} className="mr-2 w-5 h-5" />
            Kết quả kiểm tra
          </h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Tên thuốc</th>
                <th className="border px-2 py-1 text-left">Cảnh báo</th>
              </tr>
            </thead>
            <tbody>
              {canhBaoList.map((item, index) => (
                <tr
                  key={index}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className="border px-2 py-1">{item.tenThuoc}</td>
                  <td className="border px-2 py-1">{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckHoaDon;
