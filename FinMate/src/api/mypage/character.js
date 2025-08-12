import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth.js';

const API_BASE = import.meta.env.VITE_BASE_API_URL + '/api/character';

export const getCharacter = async () => {
  const authStore = useAuthStore();
  const { data } = await axios.get(API_BASE, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  return data;
};

export const updateCharacter = async (data) => {
  const authStore = useAuthStore();
  return axios.post(API_BASE, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};
