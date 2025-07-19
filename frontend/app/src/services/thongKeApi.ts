import axiosClient from "../config/axios";
import type { EntityCount } from "../types/thongKe";
import type { APIResponse } from "../types/utils";

export const fetchAvailableYears = async (): Promise<number[]> => {
  try {
    const res = await axiosClient.get<APIResponse<number[]>>("/statistics/available-years");
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách năm thống kê:", error);
    throw error;
  }
};

export const fetchEntityCount = async (): Promise<EntityCount> => {
  const res = await axiosClient.get<APIResponse<EntityCount>>("/statistics/entity-count");
  if (!res.data.success) throw new Error(res.data.message);

  // fallback nếu res.data.data là undefined
  return res.data.data ?? {
    drugs: 0,
    manufacturers: 0,
    categories: 0,
    suppliers: 0,
    customers: 0,
    invoices: 0,
    invoiceDetails: 0,
  };
};
