import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth.js';

const API_BASE = import.meta.env.VITE_BASE_API_URL + '/api/level';

export const getUserData = async () => {
  const authStore = useAuthStore();
  return axios.get(API_BASE, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};

export const updateUserData = async () => {
  const authStore = useAuthStore();
  return axios.post(API_BASE, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};
