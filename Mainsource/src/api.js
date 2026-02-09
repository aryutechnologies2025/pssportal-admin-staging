import axios from "axios";
import { API_URL } from "./Config";

const Api = axios.create({
  baseURL:API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔐 Add token to every request
Api.interceptors.request.use(
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
Api.interceptors.response.use(
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

export default Api;

