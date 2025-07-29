import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const Login = async (id, pw) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: id,
      password: pw,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    } else {
      throw error;
    }
  }
};

const BASE_URL = 'http://localhost:8080'; // 또는 실제 서버 주소

export const signup = async (formData) => {
  const res = await axios.post(`${BASE_URL}/api/member/join`, formData);
  return res.data;
};

export const sendEmailAuth = (email) => {
  return axios.post(`${BASE_URL}/api/member/emailauthentication`, { email });
};

export const verifyEmailAuth = (code, uuid) => {
  return axios.post(`${BASE_URL}/api/member/emailauthentication/verify`, {
    authCode: code,
    requestId: uuid.toString(),
  });
};
