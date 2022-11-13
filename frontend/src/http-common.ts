import axios, { type AxiosInstance } from "axios";

const http: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-type": "application/json",
  },
});

export default http;