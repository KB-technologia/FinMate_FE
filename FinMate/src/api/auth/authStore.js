// 로그인/로그아웃 상태 전역 관리 (pinia)
// 로그인하면 토큰 저장, 로그아웃하면 삭제
import { defineStore } from "pinia";
import { Login } from "@/api/auth/authAPI";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  isTokenExpired,
} from "@/api/auth/authUtils";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    isFirst: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
      setAccessToken(token);
    },

    setIsFirst(isFirst) {
      this.isFirst = isFirst;
    },

    logout() {
      this.token = null;
      this.isFirst = null;
      removeAccessToken();
    },

    async login(id, pw) {
      try {
        const res = await Login(id, pw);
        if (res.status === 200) {
          this.setToken(res.data.token);
          this.setIsFirst(true);
          console.log(res.data);

          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("로그인 중 오류 발생:", error);
        return false;
      }
    },
    // 유효하면 저장, 만료된 경우는 로그아웃 처리
    initialize() {
      const token = getAccessToken();
      if (token && !isTokenExpired(token)) {
        this.token = token;
        return true;
      } else {
        console.warn("토큰이 만료되어 로그아웃 처리됩니다.");
        this.logout();
        return false;
      }
    },
  },
});
