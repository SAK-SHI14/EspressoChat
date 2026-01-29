import axios from "axios";

// Determine API URL based on environment or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add Authorization token to every request
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
