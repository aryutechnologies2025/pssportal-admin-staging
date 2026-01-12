import axios from "axios";
import { API_URL } from "./Config";

const USERNAME = "admin";      // <-- manual username
const PASSWORD = "12345";      // <-- manual password

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: USERNAME,
    password: PASSWORD,
  },
});

export default axiosInstance;
