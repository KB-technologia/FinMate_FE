import axios from 'axios';

const API_BASE = '/api/member/portfolio';

export const getPortfolio = (userId) => {
  return axios.get(`${API_BASE}?userId=${userId}`);
};

export const createPortfolio = (data) => {
  return axios.post(API_BASE, data);
};

export const updatePortfolio = (data) => {
  return axios.patch(API_BASE, data);
};

export const deletePortfolio = (userId) => {
  return axios.delete(`${API_BASE}?userId=${userId}`);
};
