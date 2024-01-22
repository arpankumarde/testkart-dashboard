import axios from "axios";

const server = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE,
});

server.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["user_type"] = "TEACHER";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default server;
