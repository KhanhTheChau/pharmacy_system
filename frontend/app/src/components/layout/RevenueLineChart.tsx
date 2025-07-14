import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

type Mode = 'year' | 'month' | 'week';
type ChartType = 'line' | 'bar' | 'area';
type DisplayType = 'revenue' | 'invoices' | 'both';

interface RevenueItem {
  label: string;                                                                                                          
  total: number; // Doanh thu
  invoices?: number; // Số hóa đơn (nếu cần)
}

// GET /api/v1/revenue/year?year=2025 -> Trả về 12 tháng gồm doanh thu và số hóa đơn mỗi tháng
const mockMonthData: Record<number, RevenueItem[]> = {
  2025: [
    { label: '01/2025', total: 23484738, invoices: 13 },
    { label: '02/2025', total: 20726451, invoices: 25 },
    { label: '03/2025', total: 25819429, invoices: 15 },
    { label: '04/2025', total: 25819429, invoices: 15 },
    { label: '05/2025', total: 219429, invoices: 15 },
    { label: '06/2025', total: 12219429, invoices: 15 },
    { label: '07/2025', total: 25819429, invoices: 15 },
    { label: '08/2025', total: 12339429, invoices: 15 },
    { label: '09/2025', total: 25819429, invoices: 15 },
    { label: '10/2025', total: 25819429, invoices: 15 },
    { label: '11/2025', total: 15819429, invoices: 15 },
    { label: '12/2025', total: 25819429, invoices: 15 },
  ],
  2024: [
    { label: '01/2024', total: 16365456, invoices: 25 },
    { label: '02/2024', total: 15689433, invoices: 14 },
    { label: '03/2024', total: 16695637, invoices: 11 },
    { label: '04/2025', total: 6456878, invoices: 15 },
    { label: '05/2025', total: 219429, invoices: 15 },
    { label: '06/2025', total: 1111, invoices: 15 },
    { label: '07/2025', total: 25819429, invoices: 15 },
    { label: '08/2025', total: 22212, invoices: 15 },
    { label: '09/2025', total: 321233, invoices: 15 },
    { label: '10/2025', total: 1243243, invoices: 15 },
    { label: '11/2025', total: 123123123, invoices: 15 },
    { label: '12/2025', total: 123123, invoices: 15 },
  ]
};

// GET /api/v1/revenue/month?year=2025&month=6
const mockDayData: Record<number, Record<number, RevenueItem[]>> = {
  2025: {
    12: Array.from({ length: 30 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(500000 + Math.random() * 2000000), // 0.5 - 2.5 triệu/ngày
      invoices: Math.floor(Math.random()*10)
    })),
    11: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    10: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    9: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    8: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    7: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    6: Array.from({ length: 30 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(500000 + Math.random() * 2000000),
       invoices: Math.floor(Math.random()*10) // 0.5 - 2.5 triệu/ngày
    })),
    5: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    4: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    3: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    2: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
    1: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(700000 + Math.random() * 1500000),
       invoices: Math.floor(Math.random()*10)
    })),
  },
  2024: {
    12: Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}`,
      total: Math.floor(600000 + Math.random() * 1800000),
       invoices: Math.floor(Math.random()*10)
    })),
  }
};

// GET /api/v1/revenue/week?start=2025-06-01
const mockWeekData: Record<string, RevenueItem[]> = {
  '2025-06-01': [
    { label: 'Thứ 2', total: 4200000, invoices: 22 },
    { label: 'Thứ 3', total: 4800000, invoices: 12  },
    { label: 'Thứ 4', total: 5100000, invoices: 32  },
    { label: 'Thứ 5', total: 4700000, invoices: 12  },
    { label: 'Thứ 6', total: 4600000, invoices: 321  },
    { label: 'Thứ 7', total: 4500000, invoices: 12  },
    { label: 'Chủ nhật', total: 4300000, invoices: 12  },
  ],
  '2025-06-08': [
    { label: 'Thứ 2', total: 4000000, invoices: 123  },
    { label: 'Thứ 3', total: 4200000, invoices: 12  },
    { label: 'Thứ 4', total: 4400000, invoices: 12  },
    { label: 'Thứ 5', total: 4600000, invoices: 32  },
    { label: 'Thứ 6', total: 4800000, invoices: 12  },
    { label: 'Thứ 7', total: 5000000, invoices: 12  },
    { label: 'Chủ nhật', total: 5200000, invoices: 32  },
  ]
};

const yss = [2024, 2025]

export default function RevenueChart() {
  const [mode, setMode] = useState<Mode>('year');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [displayType, setDisplayType] = useState<DisplayType>('revenue');
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(6);
  const [startDate, setStartDate] = useState('2025-06-01');

  const years = yss; // api
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  let data: RevenueItem[] = [];

  if (mode === 'year') data = mockMonthData[year] ?? [];
  else if (mode === 'month') data = mockDayData[year]?.[month] ?? [];
  else if (mode === 'week') data = mockWeekData[startDate] ?? [];

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
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="label" />
            
            {/* Trục Y trái: Doanh thu */}
            <YAxis
                yAxisId="left"
                tickFormatter={(v) => `${v / 1_000_000} triệu`}
            />
            
            {/* Trục Y phải: Số hóa đơn */}
            <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(v) => `${v} HĐ`}
            />

            <Tooltip
                formatter={(value: number, name: string) => {
                if (name === 'total') return [`${value.toLocaleString()} đ`, 'Doanh thu'];
                if (name === 'invoices') return [`${value} hóa đơn`, 'Số HĐ'];
                return value;
                }}
            />

            {/* Cột Doanh thu (trục trái) */}
            <Bar
                yAxisId="left"
                dataKey="total"
                fill="#8884d8"
                name="Doanh thu"
            />

            {/* Cột Số HĐ (trục phải) */}
            <Bar
                yAxisId="right"
                dataKey="invoices"
                fill="#82ca9d"
                name="Số HĐ"
            />
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
              {months.map((m) => <option key={m} value={m}>{`Tháng ${m}`}</option>)}
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