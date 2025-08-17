import { defineStore } from 'pinia';
import { Login } from '@/api/auth/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    isFirst: null,
    username: null,
    provide: null,
    days: null,
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

    setProvider(provider) {
      this.provide = provider;
    },

    setDays(days) {
      this.days = days;
    },

    setUserName(username) {
      this.username = username;
    },

    logout() {
      this.token = null;
      this.isFirst = null;
      this.provider = null;
      this.days = null;
      this.username = null;
      localStorage.removeItem('token');
      window.location.reload();
    },

    async login(id, pw) {
      try {
        const res = await Login(id, pw);
        if (res.status === 200) {
          this.setToken(res.data.token);
          this.setIsFirst(!res.data.rewardClaimed);
          this.setUserName(res.data.user.name);
          localStorage.setItem('username', res.data.user.name);
          this.setDays(res.data.consecutiveDays);
          this.setProvider('LOCAL');
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
