import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASE,
  headers: {
    "Content-Type": "application/json",
    "user-type": "TEACHER",
  },
});

export default api;
