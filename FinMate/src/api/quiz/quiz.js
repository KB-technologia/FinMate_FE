import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toError = (error, fallback) =>
  new Error(error?.response?.data?.message ?? error?.message ?? fallback);

export const postAssessment = async (choices) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const { data } = await axios.post(
      `${BASE_API_URL}/api/assessment`,
      { choices },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return data;
  } catch (error) {
    throw toError(error, "테스트 제출에 실패했습니다.");
  }
};
