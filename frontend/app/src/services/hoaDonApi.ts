import axiosClient from "../config/axios";
import type { ChiTietHoaDonType, HoaDonFormType, HoaDonType } from "../types/hoaDon";
import type { APIResponse } from "../types/utils";

// Lấy danh sách hóa đơn
export const fetchHoaDons = async (): Promise<HoaDonType[]> => {
    try {
        const res = await axiosClient.get<APIResponse<HoaDonType[]>>("invoice/");
        if (!res.data.success) throw new Error(res.data.message);
        console.log("res: ", res)
        return res.data.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
        throw error;
    }
};

// Tạo hóa đơn mới
export const createHoaDon = async (form: HoaDonFormType): Promise<HoaDonType> => {
    try {
        const res = await axiosClient.post<APIResponse<HoaDonType>>("invoice/", {
            data: form,
        });
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.data!;
    } catch (error) {
        console.error("Lỗi khi tạo hóa đơn:", error);
        throw error;
    }
};

// Cập nhật hóa đơn
export const updateHoaDon = async (
    MaHoaDon: string,
    form: HoaDonFormType
): Promise<HoaDonType> => {
    try {
        const res = await axiosClient.put<APIResponse<HoaDonType>>(`invoice/${MaHoaDon}/`, {
            data: form,
        });
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.data!;
    } catch (error) {
        console.error("Lỗi khi cập nhật hóa đơn:", error);
        throw error;
    }
};

// Xóa hóa đơn
export const deleteHoaDon = async (MaHoaDon: string): Promise<string> => {
    try {
        const res = await axiosClient.delete<APIResponse<null>>(`invoice/${MaHoaDon}/`);
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.message;
    } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
        throw error;
    }
};

export const fetchInvoiceDetail = async (id: string): Promise<ChiTietHoaDonType | null> => {
  try {
    const res = await axiosClient.get<APIResponse<ChiTietHoaDonType>>(`/invoice/detail/${id}`);
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data ?? null;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết hóa đơn với id ${id}:`, error);
    throw error;
  }
};

export const getCanhBaoByChiTietId = async (maChiTietHD: string) => {
  const response = await axiosClient.get(`/services/canh-bao/${maChiTietHD}`);
  return response.data?.data || [];
};