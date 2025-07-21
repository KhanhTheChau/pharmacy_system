import { useEffect, useState } from "react";
import type { DrugStatusData } from "../../types/thongKe";
import { fetchDrugStatusStatistics } from "../../services/thongKeApi";
import {
  faCircleCheck,
  faCircleXmark,
  faCalendarMinus,
  faCalendar,
  faHourglass,
  faCircleInfo,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type StatusKey = keyof DrugStatusData;

const statusList: {
  key: StatusKey;
  label: string;
  color: string;
  icon: IconDefinition;
}[] = [
  {
    key: "inStock",
    label: "Còn hàng",
    color: "bg-green-100",
    icon: faCircleCheck,
  },
  {
    key: "outOfStock",
    label: "Hết hàng",
    color: "bg-red-100",
    icon: faCircleXmark,
  },
  {
    key: "expired",
    label: "Hết hạn",
    color: "bg-gray-100",
    icon: faHourglass,
  },
  {
    key: "expiring7",
    label: "Sắp hết hạn (7 ngày)",
    color: "bg-yellow-100",
    icon: faCalendarMinus,
  },
  {
    key: "expiring30",
    label: "Sắp hết hạn (30 ngày)",
    color: "bg-orange-100",
    icon: faCalendar,
  },
];

const DrugStatusCard = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusKey | null>(null);
  const [data, setData] = useState<DrugStatusData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDrugStatus = async () => {
      setLoading(true);
      try {
        const res = await fetchDrugStatusStatistics();
        setData(res);
      } catch (error) {
        console.error("Lỗi khi tải tình trạng thuốc:", error);
      } finally {
        setLoading(false);
      }
    };

    getDrugStatus();
  }, []);

  return (
    <div className="bg-white border border-[#ccc] rounded-md p-4 shadow">
      <h2 className="text-xl font-semibold mb-4">
        <FontAwesomeIcon icon={faCircleInfo} className="mr-2 w-5 h-5" />
        Tình trạng thuốc
      </h2>

      {loading && <p>Đang tải dữ liệu...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {statusList.map((s) => (
              <div
                key={s.key}
                className={`p-4 rounded-lg cursor-pointer hover:shadow-md ${s.color}`}
                onClick={() =>
                  setSelectedStatus((prev) => (prev === s.key ? null : s.key))
                }
              >
                <FontAwesomeIcon
                  icon={s.icon}
                  className="text-gray-700 mb-1 w-5 h-5"
                />
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xl font-bold text-gray-700">
                  {data[s.key].length}
                </p>
              </div>
            ))}
          </div>

          {selectedStatus && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Danh sách thuốc:{" "}
                {statusList.find((s) => s.key === selectedStatus)?.label}
              </h3>

              {data[selectedStatus].length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="min-w-full text-sm border rounded-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">Tên thuốc</th>
                        <th className="p-2 border">Số lượng tồn</th>
                        <th className="p-2 border">Hạn sử dụng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data[selectedStatus].map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2 border">{item.tenThuoc}</td>
                          <td className="p-2 border text-center">
                            {item.soLuongTon}
                          </td>
                          <td className="p-2 border text-center">
                            {item.hanSuDung}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Không có thuốc nào thuộc nhóm này.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DrugStatusCard;
