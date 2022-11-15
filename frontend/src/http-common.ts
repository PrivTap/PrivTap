import axios, { type AxiosInstance } from "axios";


const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.BASE_URL : "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

export default http;
