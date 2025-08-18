import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyReviews = async () => {
  const { data } = await axios.get(`${BASE_API_URL}/api/my-page/review`, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const getMyProducts = async () => {
  const { data } = await axios.get(`${BASE_API_URL}/api/my-page/my-products`, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const deleteMyReview = async (productId) => {
  const { data } = await axios.delete(
    `${BASE_API_URL}/api/product/${productId}/review`,
    { headers: getAuthHeaders(), withCredentials: true }
  );
  return data;
};
