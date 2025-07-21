"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPills,
  faIndustry,
  faBoxes,
  faTruck,
  faUser,
  faFileInvoice,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { Card } from "../ui/Card";
import type { EntityCount } from "../../types/thongKe";
import { fetchEntityCount } from "../../services/thongKeApi";

const iconMap = {
  drugs: <FontAwesomeIcon icon={faPills} className="text-purple-600" />,
  manufacturers: <FontAwesomeIcon icon={faIndustry} className="text-orange-600" />,
  categories: <FontAwesomeIcon icon={faBoxes} className="text-blue-600" />,
  suppliers: <FontAwesomeIcon icon={faTruck} className="text-green-600" />,
  customers: <FontAwesomeIcon icon={faUser} className="text-pink-600" />,
  invoices: <FontAwesomeIcon icon={faFileInvoice} className="text-teal-600" />,
  invoiceDetails: <FontAwesomeIcon icon={faList} className="text-gray-600" />,
};

const labels = {
  drugs: "Thuốc",
  manufacturers: "Hãng SX",
  categories: "Loại thuốc",
  suppliers: "Nhà cung cấp",
  customers: "Khách hàng",
  invoices: "Hóa đơn",
  invoiceDetails: "Chi tiết HĐ",
};

export default function EntityStats() {
  const [data, setData] = useState<EntityCount>({
    drugs: 0,
    manufacturers: 0,
    categories: 0,
    suppliers: 0,
    customers: 0,
    invoices: 0,
    invoiceDetails: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getEntityCount = async () => {
      setLoading(true);
      try {
        const data = await fetchEntityCount();
        setData(data);
      } catch (error) {
        console.error("Lỗi khi fetch entity count:", error);
      } finally {
        setLoading(false);
      }
    };

    getEntityCount();
  }, []);

  if (loading) return <div>Đang tải thống kê...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <Card key={key} className="flex items-center gap-3 border border-[#ccc] rounded-md p-4 shadow">
          <div className="text-2xl">{iconMap[key as keyof EntityCount]}</div>
          <div>
            <div className="text-sm text-muted-foreground">
              {labels[key as keyof EntityCount]}
            </div>
            <div className="text-lg font-bold">{value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
