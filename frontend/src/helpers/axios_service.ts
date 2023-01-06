// parent class that has the single axios instance
// that is used by all the services
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
        ? import.meta.env.VITE_BACKEND_URL
        : "http://127.0.0.1:8000/api",
    headers: {"Content-Type": "application/json"},
    withCredentials: true,
});
export default axiosInstance

export function http() {
    return axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL
            ? import.meta.env.VITE_BACKEND_URL
            : "http://127.0.0.1:8000/api",
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
    });
}
