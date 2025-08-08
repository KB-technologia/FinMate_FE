import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth.js';
const API_BASE = import.meta.env.VITE_BASE_API_URL + '/api/quizsolved';

export const getQuizSolved = () => {
  const authStore = useAuthStore();
  return axios.get(API_BASE, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};

export const updateQuizSolved = () => {
  const authStore = useAuthStore();
  return axios.patch(
    API_BASE,
    {},
    {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    }
  );
};
