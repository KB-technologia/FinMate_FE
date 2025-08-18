import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toError = (error, fallback) =>
  new Error(error?.response?.data?.message ?? error?.message ?? fallback);

export const getPortfolio = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/portfolio`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response;
  } catch (error) {
    throw toError(error, "포트폴리오 조회에 실패했습니다.");
  }
};

export const getMemberStat = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/my-page/stat`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response;
  } catch (error) {
    throw toError(error, "회원 통계 조회에 실패했습니다.");
  }
};

export const getAllRecommendations = async () => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/product/recommendation`,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return response;
  } catch (error) {
    throw toError(error, "추천 상품 조회에 실패했습니다.");
  }
};

export const getRandomRecommendation = async () => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/product/recommendation/random`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw toError(error, "랜덤 추천 상품 조회에 실패했습니다.");
  }
};

export const postAttendance = async (payload = {}) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/attendance`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return response.status;
  } catch (error) {
    throw toError(error, "출석 등록에 실패했습니다.");
  }
};

export const getMemberLevel = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/level`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response;
  } catch (error) {
    throw toError(error, "회원 레벨 조회에 실패했습니다.");
  }
};
