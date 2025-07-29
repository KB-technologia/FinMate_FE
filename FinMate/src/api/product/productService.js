import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL + '/product';

export const productService = {
  getAllProducts() {
    console.log('전체 상품 API 호출:', `${API_BASE_URL}`);
    return axios.get(`${API_BASE_URL}`);
  },

  getFilteredProducts(filterParams) {
    // console.log('필터링 API 호출 파라미터:', filterParams);

    const params = new URLSearchParams();

    if (filterParams.query?.trim()) {
      params.append('query', filterParams.query.trim());
    }

    if (filterParams.productType) {
      params.append('productType', filterParams.productType);
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

    if (filterParams.sortOrder) {
      params.append('sortOrder', filterParams.sortOrder);
    }

    const url = `${API_BASE_URL}/filter?${params.toString()}`;
    // console.log('최종 필터링 API URL:', url);

    return axios.get(url);
  },
};
