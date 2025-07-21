import axiosClient from "../config/axios"; // dùng chung axiosClient nếu có
import type { APIResponse } from "../types/utils";

export type CanhBaoItem = {
  MaHoaDon: string;
  MaChiTietHD: string;
  KhachHang: string;
  CanhBao: string[];
};

// Gọi API lấy toàn bộ danh sách cảnh báo
export const fetchAllCanhBao = async (): Promise<CanhBaoItem[]> => {
  try {
    const res = await axiosClient.get<APIResponse<CanhBaoItem[]>>("/services/canh-bao/all/");
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cảnh báo:", error);
    throw error;
  }
};
