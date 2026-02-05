import axios from "axios";
import { API_URL } from "./Config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // REQUIRED for Laravel session
  headers: {
    Authorization: "Basic " + btoa("admin:12345") // static.auth
  }
});

// ✅ AUTO session expire handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;