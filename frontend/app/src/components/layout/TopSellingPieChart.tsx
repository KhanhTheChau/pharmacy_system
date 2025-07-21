import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { fetchAvailableYears, fetchTopSellingDrugs } from "../../services/thongKeApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28EFF", "#FF6666", "#66CCCC", "#FF66CC",
];

type DrugItem = {
  tenThuoc: string;
  soLuong: number;
  tongTien: number;
  thang?: number;
  nam?: number;
};

const TopSellingPieChart = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mode, setMode] = useState<"soLuong" | "tongTien">("soLuong");
  const [data, setData] = useState<DrugItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState<number[]>([]);

    useEffect(() => {
        fetchAvailableYears()
          .then(setYears)
          .catch((err) => console.error('Lỗi khi lấy danh sách năm:', err));
      }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchTopSellingDrugs({
          month: selectedMonth ?? undefined,
          year: selectedYear ?? undefined,
        });
        setData(result);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thuốc bán chạy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const sortedData = [...data].sort((a, b) => b[mode] - a[mode]);
  const top5 = sortedData.slice(0, 5);
  const others = sortedData.slice(5);
  const othersValue = others.reduce((sum, item) => sum + item[mode], 0);
  const total = top5.reduce((sum, item) => sum + item[mode], 0) + othersValue;

  const pieData = [
    ...top5.map((item) => ({
      name: item.tenThuoc,
      value: item[mode],
      percent: ((item[mode] / total) * 100).toFixed(1),
    })),
    ...(othersValue > 0
      ? [{
          name: "Khác",
          value: othersValue,
          percent: ((othersValue / total) * 100).toFixed(1),
        }]
      : []),
  ];

  return (
    <div className="w-full bg-white border border-[#ccc] rounded-md p-4 shadow">
      <div className="flex justify-between items-center flex-wrap mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          <FontAwesomeIcon icon={faChartPie} className="mr-2 w-5 h-5" />
          Thống kê thuốc đã bán theo {mode === "soLuong" ? "số lượng" : "tổng tiền"}
        </h2>
        <div className="flex gap-2 items-center">
          <select
            value={selectedMonth ?? ""}
            onChange={(e) =>
              setSelectedMonth(e.target.value ? Number(e.target.value) : null)
            }
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Tất cả tháng</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
          <select
            value={selectedYear ?? ""}
            onChange={(e) =>
              setSelectedYear(e.target.value ? Number(e.target.value) : null)
            }
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Tất cả năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "soLuong" | "tongTien")}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="soLuong">Theo số lượng</option>
            <option value="tongTien">Theo tổng tiền</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name }) => {
                    const item = pieData.find((d) => d.name === name);
                    return `${name} (${item?.percent || "0"}%)`;
                  }}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    mode === "soLuong"
                      ? `${value} lượt`
                      : `${value.toLocaleString()} ₫`,
                    name,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2 max-h-96 overflow-y-auto">
            <table className="min-w-full text-sm border rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 border">Tên thuốc</th>
                  <th className="text-center p-2 border">
                    {mode === "soLuong" ? "Số lượng" : "Tổng tiền (₫)"}
                  </th>
                  <th className="text-center p-2 border">Tỷ lệ (%)</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, idx) => {
                  const value = item[mode];
                  const percent = ((value / total) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border">{item.tenThuoc}</td>
                      <td className="text-center p-2 border">
                        {mode === "soLuong"
                          ? value
                          : value.toLocaleString()}
                      </td>
                      <td className="text-center p-2 border">{percent}%</td>
                    </tr>
                  );
                })}

                {sortedData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center p-2 text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSellingPieChart;
