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
