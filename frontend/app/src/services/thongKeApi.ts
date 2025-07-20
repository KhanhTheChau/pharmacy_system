import axiosClient from "../config/axios";
import type { DrugStatusData, EntityCount, RevenueItem, SoonExpiredDrug, TopSellingDrug, TopSellingParams } from "../types/thongKe";
import type { APIResponse } from "../types/utils";

// Lấy danh sách năm có dữ liệu
export const fetchAvailableYears = async (): Promise<number[]> => {
  try {
    const res = await axiosClient.get<APIResponse<number[]>>("/statistics/available-years");
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách năm thống kê:", error);
    throw error;
  }
};

// Lấy tổng số lượng các thực thể
export const fetchEntityCount = async (): Promise<EntityCount> => {
  try {
    const res = await axiosClient.get<APIResponse<EntityCount>>("/statistics/entity-count");
    if (!res.data.success) throw new Error(res.data.message);

    return (
      res.data.data ?? {
        drugs: 0,
        manufacturers: 0,
        categories: 0,
        suppliers: 0,
        customers: 0,
        invoices: 0,
        invoiceDetails: 0,
      }
    );
  } catch (error) {
    console.error("Lỗi khi lấy số lượng thực thể:", error);
    throw error;
  }
};

// Lấy thống kê theo năm
export const fetchYearlyStatistics = async (year: number): Promise<RevenueItem[]> => {
  try {
    const res = await axiosClient.get<APIResponse<RevenueItem[]>>(`/statistics/yearly?year=${year}`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? [];
  } catch (error) {
    console.error(`Lỗi khi lấy thống kê năm ${year}:`, error);
    throw error;
  }
};

// Lấy thống kê theo tháng
export const fetchMonthlyStatistics = async (
  year: number,
  month: number
): Promise<RevenueItem[]> => {
  try {
    const res = await axiosClient.get<APIResponse<RevenueItem[]>>(`/statistics/monthly?year=${year}&month=${month}`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? [];
  } catch (error) {
    console.error(`Lỗi khi lấy thống kê tháng ${month}/${year}:`, error);
    throw error;
  }
};

// Lấy thống kê theo tuần
export const fetchWeeklyStatistics = async (start: string): Promise<RevenueItem[]> => {
  try {
    const res = await axiosClient.get<APIResponse<RevenueItem[]>>(`/statistics/weekly?start=${start}`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? [];
  } catch (error) {
    console.error(`Lỗi khi lấy thống kê tuần bắt đầu từ ${start}:`, error);
    throw error;
  }
};

export const fetchTopSellingDrugs = async ({
  month,
  year,
}: {
  month?: number;
  year?: number;
}): Promise<{ tenThuoc: string; soLuong: number; tongTien: number }[]> => {
  try {
    const params: TopSellingParams = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const res = await axiosClient.get<APIResponse<TopSellingDrug[]>>("/statistics/top-selling-drugs", { params });

    if (!res.data.success) throw new Error(res.data.message);

    return res.data.data ?? [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thuốc bán chạy:", error);
    throw error;
  }
};

export const fetchSoonExpiringDrugs = async (
  mode: "week" | "month" | "custom" = "month",
  days?: number
): Promise<SoonExpiredDrug[]> => {
  try {
     const params: { mode: "week" | "month" | "custom"; days?: number } = { mode };
    if (mode === "custom" && days !== undefined) {
      params.days = days;
    }

    const res = await axiosClient.get<APIResponse<SoonExpiredDrug[]>>(
      "/statistics/soon-expiring",
      { params }
    );
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? [];
  } catch (error) {
    console.error("Lỗi khi lấy thuốc sắp hết hạn:", error);
    throw error;
  }
};

export const fetchDrugStatusStatistics = async (): Promise<DrugStatusData> => {
  try {
    const res = await axiosClient.get<APIResponse<DrugStatusData>>("/statistics/drug-status");
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? {
      inStock: [],
      outOfStock: [],
      expired: [],
      expiring7: [],
      expiring30: [],
    };
  } catch (error) {
    console.error("Lỗi khi lấy thống kê tình trạng thuốc:", error);
    throw error;
  }
};