import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const getPortfolio = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_API_URL}/api/portfolio`, {
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

export const getMemberStat = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_API_URL}/api/my-page/stat`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Member Stat 요청 실패:', error);
    if (error.response) {
      console.error('❗ 서버 응답 데이터:', error.response.data);
      console.error('❗ 서버 응답 상태코드:', error.response.status);
      console.error('❗ 서버 응답 헤더:', error.response.headers);
    }
    throw error;
  }
};

export const getAllRecommendations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_API_URL}/api/product/recommendation`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ 전체 추천상품 요청 실패:', error);
    if (error.response) {
      console.error('❗ 서버 응답 데이터:', error.response.data);
      console.error('❗ 서버 응답 상태코드:', error.response.status);
      console.error('❗ 서버 응답 헤더:', error.response.headers);
    }
    throw error;
  }
};

export const getRandomRecommendation = async () => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/product/recommendation/random`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ 랜덤 추천상품 요청 실패:', error);
    if (error.response) {
      console.error('❗ 서버 응답 데이터:', error.response.data);
      console.error('❗ 서버 응답 상태코드:', error.response.status);
      console.error('❗ 서버 응답 헤더:', error.response.headers);
    }
    throw error;
  }
};

export const postAttendance = async (payload = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_API_URL}/api/attendance`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.status;
  } catch (error) {
    console.error('❌ Attendance 등록 요청 실패:', error);
    if (error.response) {
      console.error('❗ 서버 응답 데이터:', error.response.data);
      console.error('❗ 서버 응답 상태코드:', error.response.status);
      console.error('❗ 서버 응답 헤더:', error.response.headers);
    }
    throw error;
  }
};

export const getMemberLevel = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_API_URL}/api/level`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('❌ Member Level 요청 실패:', error);
    if (error.response) {
      console.error('❗ 서버 응답 데이터:', error.response.data);
      console.error('❗ 서버 응답 상태코드:', error.response.status);
      console.error('❗ 서버 응답 헤더:', error.response.headers);
    }
    throw error;
  }
};
