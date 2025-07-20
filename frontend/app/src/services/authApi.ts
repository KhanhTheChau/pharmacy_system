import type { AxiosError } from "axios";
import axiosClient from "../config/axios";
import type { APIResponse } from "../types/utils";

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  email: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export const login = async (
  form: { username: string; password: string }
): Promise<TokenResponse | null> => {
  try {
    const res = await axiosClient.post<TokenResponse>("account/login/", form);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Lỗi đăng nhập:", err);
    return null;
  }
};

export const register = async (
  form: RegisterForm
): Promise<APIResponse<null>> => {
  try {
    const res = await axiosClient.post<APIResponse<null>>(
      "account/register/",
      form
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/admin/dang-nhap";
};


// Refresh access token
export const refreshToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  try {
    const res = await axiosClient.post<APIResponse<TokenResponse>>("account/refresh/", {
      refresh,
    });

    if (res.data.success && res.data.data?.access) {
      localStorage.setItem("access_token", res.data.data.access);
      return res.data.data.access;
    }
  } catch (error) {
    console.error("Lỗi refresh token:", error);
  }

  return null;
};
