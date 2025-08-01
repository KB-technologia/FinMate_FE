import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const getMemberCharacter = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_API_URL}/api/member/character`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('멤버 캐릭터 가져오기 실패:', error);
    throw error;
  }
};
