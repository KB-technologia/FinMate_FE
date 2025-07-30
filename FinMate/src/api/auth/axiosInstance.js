// 모든 API 요청에 accessToken 자동 포함시키는 Axios 인스턴스
// 반드시 import "@/api/auth/axiosInstance"를 사용해주세요
import axios from "axios";

import { getAccessToken } from "@/api/auth/authUtils";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("인증 오류: 로그인 필요");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
