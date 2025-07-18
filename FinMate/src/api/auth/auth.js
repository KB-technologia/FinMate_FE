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
