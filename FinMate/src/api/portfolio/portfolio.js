import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth.js';

const API_BASE = import.meta.env.VITE_BASE_API_URL + '/api/member/portfolio';

export const getPortfolio = () => {
  const authStore = useAuthStore();
  return axios.get(API_BASE, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};

export const createPortfolio = (data) => {
  const authStore = useAuthStore();
  return axios.post(API_BASE, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};

export const updatePortfolio = (data) => {
  const authStore = useAuthStore();
  return axios.patch(API_BASE, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};

export const deletePortfolio = () => {
  const authStore = useAuthStore();
  return axios.delete(API_BASE, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
};

export const getHistoryPortfolio = (date) => {
  const authStore = useAuthStore();
  return axios.get(`${API_BASE}/history`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    params: {
      date: date,
    },
  });
};
