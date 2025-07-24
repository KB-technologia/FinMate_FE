import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const Login = async (id, pw) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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
