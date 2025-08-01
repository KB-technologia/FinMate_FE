import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const postAssessment = async (choices) => {
  try {
    const token = localStorage.getItem('token');

    // ✅ 디버깅용 콘솔 출력
    console.log('[postAssessment] 요청 시작');
    console.log('[postAssessment] BASE_API_URL:', BASE_API_URL);
    console.log('[postAssessment] 전송할 choices:', choices);
    console.log('[postAssessment] 사용자의 토큰:', token);

    const response = await axios.post(
      `${BASE_API_URL}/api/assessment`,
      { choices },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[postAssessment] 응답:', response);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('❌ Assessment 요청 실패:', error);
    if (error.response) {
      console.error('❗ 서버 응답 데이터:', error.response.data);
      console.error('❗ 서버 응답 상태코드:', error.response.status);
      console.error('❗ 서버 응답 헤더:', error.response.headers);
    }
    throw error;
  }
};
