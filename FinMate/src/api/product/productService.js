import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL + '/api/product';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const productService = {
  getAllProducts() {
    return axios.get(`${API_BASE_URL}`, {
      headers: getAuthHeaders(),
    });
  },

  getFilteredProducts(filterParams) {
    const params = new URLSearchParams();

    if (filterParams.query?.trim()) {
      params.append('query', filterParams.query.trim());
    }

    // 다중 상품 타입 지원
    if (filterParams.productType?.length > 0) {
      filterParams.productType.forEach((type) => {
        params.append('productType', type);
      });
    }

    if (filterParams.bankName?.length > 0) {
      filterParams.bankName.forEach((bank) => {
        params.append('bankName', bank);
      });
    }

    if (filterParams.fundType?.length > 0) {
      filterParams.fundType.forEach((type) => {
        params.append('fundType', type);
      });
    }

    if (filterParams.sortType) {
      params.append('sortType', filterParams.sortType);
    }

    const url = `${API_BASE_URL}/filter?${params.toString()}`;

    const token = localStorage.getItem('token');
    const config = {};

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    return axios.get(url, { headers: getAuthHeaders });
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
    const token = localStorage.getItem('token');

    if (!token) {
      return Promise.reject(new Error('로그인이 필요합니다.'));
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/${productId}/review`,
        reviewData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
      if (err.response) {
        // 서버가 에러코드와 메시지 보낸 경우
        console.log('status:', err.response.status); // ex) 404
        console.log('data:', err.response.data); // ex) { message: "해당 리소스를 찾을 수 없습니다." }
      } else {
        // 네트워크 에러 등 서버 응답 자체가 없는 경우
        console.log('error:', err.message);
      }
    }
  },

  // 즐겨찾기 목록 조회
  async getFavoriteProducts() {
    const token = localStorage.getItem('token');

    if (!token) {
      return Promise.reject(new Error('로그인이 필요합니다.'));
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log('저장된 토큰:', localStorage.getItem('token'));
      console.error('즐겨찾기 목록 조회 실패:', error);
      if (error.response) {
        console.log('status:', error.response.status);
        console.log('data:', error.response.data);
      } else {
        console.log('error:', error.message);
      }
      throw error;
    }
  },

  // 즐겨찾기 등록
  async addToFavorite(productId) {
    const token = localStorage.getItem('token');

    if (!token) {
      return Promise.reject(new Error('로그인이 필요합니다.'));
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/favorite/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('즐겨찾기 등록 실패:', error);
      if (error.response) {
        console.log('status:', error.response.status);
        console.log('data:', error.response.data);
      } else {
        console.log('error:', error.message);
      }
      throw error;
    }
  },

  // 즐겨찾기 삭제
  async removeFavorite(productId) {
    const token = localStorage.getItem('token');

    if (!token) {
      return Promise.reject(new Error('로그인이 필요합니다.'));
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/favorite/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('즐겨찾기 삭제 실패:', error);
      if (error.response) {
        console.log('status:', error.response.status);
        console.log('data:', error.response.data);
      } else {
        console.log('error:', error.message);
      }
      throw error;
    }
  },
};
