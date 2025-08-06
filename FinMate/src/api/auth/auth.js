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
  return axios.post(`${BASE_URL}/api/member/emailauthentication`, { email });
};

export const verifyEmailAuth = (code, uuid) => {
  return axios.post(`${BASE_URL}/api/member/emailauthentication/verify`, {
    authCode: code,
    requestId: uuid.toString(),
  });
};

export async function findAccountIdByUuid(uuid) {
  const res = await axios.post(`${BASE_URL}/api/member/findaccountid`, {
    uuid,
  });
  return res.data; // { name: "오유찬", accountId: "dbcks0861" }
}

export const verifyUser = async (uuid, accountId) => {
  return await axios.post(`${BASE_URL}/api/member/changepassword/verify`, {
    uuid,
    accountId,
  });
};

export const changePassword = async (uuid, accountId, newPassword) => {
  return await axios.post(`${BASE_URL}/api/member/changepassword`, {
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
