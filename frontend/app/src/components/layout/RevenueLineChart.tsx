import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';
import type { ChartType, DisplayType, Mode, RevenueItem } from '../../types/thongKe';
import {
  fetchAvailableYears,
  fetchYearlyStatistics,
  fetchMonthlyStatistics,
  fetchWeeklyStatistics,
} from '../../services/thongKeApi';

export default function RevenueChart() {
  const [mode, setMode] = useState<Mode>('year');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [displayType, setDisplayType] = useState<DisplayType>('revenue');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState<string>('2025-06-01');
  const [years, setYears] = useState<number[]>([]);
  const [data, setData] = useState<RevenueItem[]>([]);

  useEffect(() => {
    fetchAvailableYears()
      .then(setYears)
      .catch((err) => console.error('Lỗi khi lấy danh sách năm:', err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mode === 'year') {
          const res = await fetchYearlyStatistics(year);
          setData(res);
        } else if (mode === 'month') {
          const res = await fetchMonthlyStatistics(year, month);
          setData(res);
        } else if (mode === 'week') {
          const res = await fetchWeeklyStatistics(startDate);
          setData(res);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', err);
        setData([]);
      }
    };
    fetchData();
  }, [mode, year, month, startDate]);

  const ChartComponent = () => {
    const commonProps = {
      data,
      children: (
        <>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="label" />
          <YAxis
            tickFormatter={(v) =>
              displayType === 'invoices' ? `${v} HĐ` : `${v / 1_000_000} triệu`
            }
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'total') return [`${value.toLocaleString()} đ`, 'Doanh thu'];
              if (name === 'invoices') return [`${value} hóa đơn`, 'Số HĐ'];
              return value;
            }}
          />
        </>
      ),
    };

    if (displayType === 'both') {
      return (
        <BarChart data={data}>
          {commonProps.children}
          <YAxis yAxisId="left" tickFormatter={(v) => `${v / 1_000_000} triệu`} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v} HĐ`} />
          <Tooltip formatter={(value: number, name: string) => {
            if (name === 'total') return [`${value.toLocaleString()} đ`, 'Doanh thu'];
            if (name === 'invoices') return [`${value} hóa đơn`, 'Số HĐ'];
            return value;
          }} />
          <Bar yAxisId="left" dataKey="total" fill="#8884d8" name="Doanh thu" />
          <Bar yAxisId="right" dataKey="invoices" fill="#82ca9d" name="Số HĐ" />
        </BarChart>
      );
    }

    const key = displayType === 'invoices' ? 'invoices' : 'total';
    const color = displayType === 'invoices' ? '#82ca9d' : '#8884d8';

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonProps.children}
            <Bar dataKey={key} fill={color} />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonProps.children}
            <Area type="monotone" dataKey={key} stroke={color} fill={color} />
          </AreaChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            {commonProps.children}
            <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} />
          </LineChart>
        );
    }
  };

  return (
    <div className="p-4 shadow rounded-xl bg-white">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-xl font-bold">
          Thống kê {displayType === 'revenue'
            ? 'doanh thu'
            : displayType === 'invoices'
            ? 'hóa đơn'
            : 'doanh thu & hóa đơn'} ({mode})
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="border rounded px-2 py-1 text-sm">
            <option value="year">Theo năm</option>
            <option value="month">Theo tháng</option>
            <option value="week">Theo tuần</option>
          </select>

          <select value={year} onChange={(e) => setYear(+e.target.value)} className="border rounded px-2 py-1 text-sm">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          {mode === 'month' && (
            <select value={month} onChange={(e) => setMonth(+e.target.value)} className="border rounded px-2 py-1 text-sm">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{`Tháng ${m}`}</option>)}
            </select>
          )}

          {mode === 'week' && (
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          )}

          {displayType !== 'both' && (
            <select value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)} className="border rounded px-2 py-1 text-sm">
              <option value="line">Biểu đồ đường</option>
              <option value="bar">Biểu đồ cột</option>
              <option value="area">Biểu đồ vùng</option>
            </select>
          )}

          <select
            value={displayType}
            onChange={(e) => setDisplayType(e.target.value as DisplayType)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="total">Chỉ doanh thu</option>
            <option value="invoices">Chỉ hóa đơn</option>
            <option value="both">Cả hai</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {ChartComponent()}
      </ResponsiveContainer>
    </div>
  );
}
