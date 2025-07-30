import axios from 'axios';

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

const BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const signup = async (formData) => {
  const res = await axios.post(`${BASE_URL}/member/join`, formData);
  return res.data;
};

export const sendEmailAuth = (email) => {
  return axios.post(`${BASE_URL}/member/emailauthentication`, { email });
};

export const verifyEmailAuth = (code, uuid) => {
  return axios.post(`${BASE_URL}/member/emailauthentication/verify`, {
    authCode: code,
    requestId: uuid.toString(),
  });
};
