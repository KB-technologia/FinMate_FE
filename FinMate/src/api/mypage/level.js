import axios from "axios";
import { useAuthStore } from "@/stores/auth/auth.js";

export const API_BASE = import.meta.env.VITE_BASE_API_URL + "/api/level";

export const getUserData = async () => {
  const authStore = useAuthStore();
  const res = await axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  return res.data;
};

export const updateUserData = async (payload) => {
  const authStore = useAuthStore();
  return axios.post(API_BASE, payload, {
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
};
