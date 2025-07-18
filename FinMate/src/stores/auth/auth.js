import { defineStore } from 'pinia';
import { Login } from '@/api/auth/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    logout() {
      this.token = null;
      localStorage.removeItem('token');
    },

    async login(id, pw) {
      try {
        const res = await Login(id, pw);
        if (res.status === 200) {
          this.setToken(res.data.token);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        return false;
      }
    },
  },
});
