import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const getPortfolio = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_API_URL}/api/member/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Portfolio 요청 실패:', error);
    if (error.response) {
      console.error('❗ 서버 응답 데이터:', error.response.data);
      console.error('❗ 서버 응답 상태코드:', error.response.status);
      console.error('❗ 서버 응답 헤더:', error.response.headers);
    }
    throw error;
  }
};
