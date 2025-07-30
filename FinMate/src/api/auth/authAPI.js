import axios from "@/api/auth/axiosInstance";

export const Login = async (id, pw) => {
  try {
    const res = await axios.post("/auth/login", {
      username: id,
      password: pw,
    });
    return { status: res.status, data: res.data };
  } catch (err) {
    if (err.response) {
      return {
        status: err.response.status,
        data: err.response.data,
      };
    }
    throw err;
  }
};
