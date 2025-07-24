import axiosClient from "../config/axios";
import type { ThuocFormType, ThuocType } from "../types/thuoc";
import type { APIResponse } from "../types/utils";

export const fetchThuocs = async ():Promise<ThuocType[]> => {
    try {
        const res = await axiosClient.get<APIResponse<ThuocType[]>>("medicine/");
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thuốc:", error);
        throw error;
    }
};

export const createThuoc = async (form: ThuocFormType): Promise<ThuocType> => {
    try {
        const res = await axiosClient.post<APIResponse<ThuocType>>("medicine/", form);
        // console.log("Response trả về:", res.data);
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.data!;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

export const updateThuoc = async (
    MaThuoc: string,
    form: ThuocFormType
): Promise<ThuocType> => {
    try {
        const res = await axiosClient.put<APIResponse<ThuocType>>(`medicine/${MaThuoc}/`, form);
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.data!;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};


export const deleteThuoc = async (MaThuoc: string):Promise<string> => {
    try {
        const res = await axiosClient.delete<string>(`medicine/${MaThuoc}/`);
        // console.log("Response trả về: ", res);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
}