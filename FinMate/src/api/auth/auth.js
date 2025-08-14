import axios from 'axios';
import { useSignupStore } from '@/stores/signup/signupStore';

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const Login = async (id, pw) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
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

export const signup = async () => {
  const store = useSignupStore();

  const formData = {
    provider: store.provider || 'KAKAO',
    name: store.name,
    accountId: store.accountId,
    email: store.email,
    password: store.password,
    passwordConfirm: store.passwordConfirm,
    birth: store.birth,
    gender: store.gender,
    isMarried: store.isMarried,
    hasJob: store.hasJob,
    usesPublicTransport: store.usesPublicTransport,
    doesExercise: store.doesExercise,
    travelsFrequently: store.travelsFrequently,
    hasChildren: store.hasChildren,
    hasHouse: store.hasHouse,
    employedAtSme: store.employedAtSme,
    usesMicroloan: store.usesMicroloan,
  };

  return axios.post(`${BASE_URL}/api/member/join`, formData);
};

export const sendEmailAuth = (email) => {
  return axios.post(`${BASE_URL}/api/email/authentication`, { email });
};

export const sendEmailAuthForSingUp = (email) => {
  return axios.post(`${BASE_URL}/api/email/authentication/signup`, { email });
};

export const verifyEmailAuth = (code, uuid) => {
  return axios.post(`${BASE_URL}/api/email/authentication/verify`, {
    authCode: code,
    requestId: uuid.toString(),
  });
};

export async function findAccountIdByUuid(uuid) {
  const res = await axios.post(`${BASE_URL}/api/member/find-accountid`, {
    uuid,
  });
  return res.data; // { name: "오유찬", accountId: "dbcks0861" }
}

export const verifyUser = async (uuid, accountId) => {
  return await axios.post(`${BASE_URL}/api/member/change-password/verify`, {
    uuid,
    accountId,
  });
};

export const resetPasswordByUuid = async (uuid, accountId, newPassword) => {
  return await axios.post(`${BASE_URL}/api/member/change-password`, {
    uuid,
    accountId,
    newPassword,
  });
};

export const checkAccountId = async (accountId) => {
  return await axios.get(`${BASE_URL}/api/member/check-id`, {
    params: { accountId },
  });
};

export const withdraw = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return Promise.reject(new Error('인증 토큰이 없습니다.'));
  }

  try {
    const response = await axios.delete(`${BASE_URL}/api/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
