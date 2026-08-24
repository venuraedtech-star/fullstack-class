import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

// Attaches the access token to every request made through this instance.
// Reads straight from localStorage (rather than importing the Redux store)
// to avoid a circular import between the store and this module.
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
