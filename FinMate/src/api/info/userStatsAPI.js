import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMemberCharacter = () => {
  return axios.get(`${BASE_API_URL}/api/character`, {
    headers: getAuthHeaders(),
  });
};
