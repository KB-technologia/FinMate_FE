import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const getMyReviews = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_API_URL}/api/my-page/review`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('리뷰 조회 실패:', error);
    throw error;
  }
};

export const getMyProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_API_URL}/api/my-page/my-products`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('보유한 상품 조회 실패:', error);
    throw error;
  }
};

export const deleteMyReview = async (productId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(
    `${BASE_API_URL}/api/product/${productId}/review`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return response.data;
};
