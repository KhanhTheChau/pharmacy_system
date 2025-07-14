import axiosClient from "../config/axios";
import type { NhaCungCapType, NhaCungCapFormType } from "../types/nhaCungCap";
import type { APIResponse } from "../types/utils";

export const fetchAvailableYears = async ():Promise<NhaCungCapType[]> => {
    try {
        const res = await axiosClient.get<APIResponse<NhaCungCapType[]>>("supplier/");
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
        throw error;
    }
};

export const createNhaCungCap = async (
    form: NhaCungCapFormType
  ): Promise<NhaCungCapType> => {
    try {
      const res = await axiosClient.post<APIResponse<NhaCungCapType>>("supplier/", {
        data: form,
      });
      if (!res.data.success) throw new Error(res.data.message);
      return res.data.data!;
    } catch (error) {
      console.error("Lỗi khi tạo nhà cung cung cấp:", error);
      throw error;
    }
  };
  
  export const updateNhaCungCap = async (
    MaNCC: string,
    form: NhaCungCapFormType
  ): Promise<NhaCungCapType> => {
    try {
      const res = await axiosClient.put<APIResponse<NhaCungCapType>>(
        `supplier/${MaNCC}/`,
        { data: form }
      );
      if (!res.data.success) throw new Error(res.data.message);
      return res.data.data!;
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà cung cung cấp:", error);
      throw error;
    }
  };
  
  export const deleteNhaCungCap = async (MaNCC: string): Promise<string> => {
    try {
      const res = await axiosClient.delete<APIResponse<null>>(
        `supplier/${MaNCC}/`
      );
      if (!res.data.success) throw new Error(res.data.message);
      return res.data.message;
    } catch (error) {
      console.error("Lỗi khi xóa nhà cung cung cấp:", error);
      throw error;
    }
  };
  