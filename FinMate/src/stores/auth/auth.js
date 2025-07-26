import { defineStore } from 'pinia';
import { Login } from '@/api/auth/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    isFirst: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setIsFirst(isFirst) {
      this.isFirst = isFirst;
    },

    logout() {
      this.token = null;
      this.isFirst = null;
      localStorage.removeItem('token');
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
        console.error('로그인 중 오류 발생:', error);
        return false;
      }
    },
  },
});
