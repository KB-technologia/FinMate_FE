import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const getMyInfo = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("${API_BASE_URL}/api/member/me", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const updateUserInfo = async (payload) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/member/me`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

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

export const sendEmailVerification = async (email) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/member/emailauthentication`,
      { email }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const verifyEmailCode = async (requestId, authCode) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/member/emailauthentication/verify`,
      {
        requestId,
        authCode,
      }
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};
