import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;

// import router from "../router/index";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
//   timeout: 10000,
// });

// // Request Interceptor - Gắn Token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor - Xử lý Token Expired
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Token hết hạn hoặc không hợp lệ
//       localStorage.removeItem("access_token");

//       // Thông báo cho người dùng
//       alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

//       // Redirect về trang login
//       router.push("/login");
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
