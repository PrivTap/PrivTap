import axios, { type AxiosInstance } from "axios";


const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL : "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: !import.meta.env.PROD
});

export default http;
