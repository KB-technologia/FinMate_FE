import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/auth';
export const Login = async (id, pw) => {
  const idex = 'test';
  const pwex = 'test';
  if (id === idex && pw === pwex) {
    return {
      status: 200,
      data: {
        token: 'mockToken',
        message: '로그인 성공',
        isfirst: true,
      },
    };
  }
  return {
    status: 401,
    data: {
      message: '로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.',
    },
  };
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
