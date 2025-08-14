import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyInfo = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/my-page`, {
      headers: authHeader(),
      withCredentials: true,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const updateUserInfo = async (payload) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/my-page`, payload, {
      headers: authHeader(),
      withCredentials: true,
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    } else {
      throw error;
    }
  }
};

export const sendEmailVerification = async (email) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/email/authentication`,
      { email },
      { headers: authHeader(), withCredentials: true }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const verifyEmailCode = async (requestId, authCode) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/email/authentication/verify`,
      { requestId, authCode: Number(authCode) },
      { headers: authHeader(), withCredentials: true }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};
