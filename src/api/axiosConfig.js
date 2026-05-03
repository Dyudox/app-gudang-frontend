import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Request Interceptor: Otomatis tambahkan token ke setiap request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Tangkap jika token expired (401)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");

      // Token expired atau tidak valid
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Jika ada data user

      window.location.href = "/login"; // Redirect paksa ke login
    }
    return Promise.reject(error);
  },
);

export default instance;
