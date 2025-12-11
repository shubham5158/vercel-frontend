import axios from "axios";

// Auto-switch base URL based on environment
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"       // Local backend
    : import.meta.env.VITE_API_BASE_URL; // Vercel backend

const client = axios.create({
  baseURL,
});

// Attach token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
