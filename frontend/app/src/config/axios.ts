import axios from "axios";
import { refreshToken } from "../services/authApi";
const API_URL = import.meta.env.VITE_API_URL

const axiosClient = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, 
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      }

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/admin/dang-nhap"; 
    }

    return Promise.reject(error);
  }
);
export default axiosClient;