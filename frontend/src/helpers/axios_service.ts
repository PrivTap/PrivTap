// parent class that has the single axios instance
// that is used by all the services
import axios, { type AxiosInstance } from "axios";

// this is a singleton class
export default class AxiosService {
  http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL
        ? import.meta.env.VITE_BACKEND_URL
        : "http://127.0.0.1:8000/api",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  }
}
