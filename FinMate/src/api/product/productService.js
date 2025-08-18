import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL + "/api/product";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toError = (error, fallback) =>
  new Error(error?.response?.data?.message ?? error?.message ?? fallback);

export const productService = {
  getAllProducts() {
    return axios.get(`${API_BASE_URL}`, { headers: getAuthHeaders() });
  },

  getFilteredProducts(filterParams) {
    const params = new URLSearchParams();

    if (filterParams.query?.trim()) {
      params.append("query", filterParams.query.trim());
    }
    if (filterParams.productType?.length > 0) {
      filterParams.productType.forEach((type) =>
        params.append("productType", type)
      );
    }
    if (filterParams.bankName?.length > 0) {
      filterParams.bankName.forEach((bank) => params.append("bankName", bank));
    }
    if (filterParams.fundType?.length > 0) {
      filterParams.fundType.forEach((type) => params.append("fundType", type));
    }
    if (filterParams.sortType) {
      params.append("sortType", filterParams.sortType);
    }

    const url = `${API_BASE_URL}/filter?${params.toString()}`;
    return axios.get(url, { headers: getAuthHeaders() });
  },

  compareProducts(id1, id2) {
    return axios.get(`${API_BASE_URL}/compare?id1=${id1}&id2=${id2}`, {
      headers: getAuthHeaders(),
    });
  },

  getProductDetails(productId) {
    return axios.get(`${API_BASE_URL}/${productId}`, {
      headers: getAuthHeaders(),
    });
  },

  getProductReviews(productId) {
    return axios.get(`${API_BASE_URL}/${productId}/review`, {
      headers: getAuthHeaders(),
    });
  },

  async submitReview(productId, reviewData) {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject(new Error("로그인이 필요합니다."));
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/${productId}/review`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );
      return res.data;
    } catch (error) {
      throw toError(error, "리뷰 등록에 실패했습니다.");
    }
  },

  async getFavoriteProducts() {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject(new Error("로그인이 필요합니다."));
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/favorite`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      throw toError(error, "즐겨찾기 목록 조회에 실패했습니다.");
    }
  },

  async addToFavorite(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject(new Error("로그인이 필요합니다."));
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/favorite/${productId}`,
        {},
        { headers: getAuthHeaders() }
      );
      return response;
    } catch (error) {
      throw toError(error, "즐겨찾기 등록에 실패했습니다.");
    }
  },

  async removeFavorite(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject(new Error("로그인이 필요합니다."));
    }
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/favorite/${productId}`,
        { headers: getAuthHeaders() }
      );
      return response;
    } catch (error) {
      throw toError(error, "즐겨찾기 삭제에 실패했습니다.");
    }
  },
};
