// import axios from "axios";
// import { API_URL } from "./Config";

// const USERNAME = "admin";      // <-- manual username
// const PASSWORD = "12345";      // <-- manual password

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   auth: {
//     username: USERNAME,
//     password: PASSWORD,
//   },
// });

// export default axiosInstance;


import axios from "axios";
import { API_URL } from "./Config";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false, // ❌ Don't use credentials with tokens
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔐 Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Handle 401 - redirect to login if token expired
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_token_expires");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
