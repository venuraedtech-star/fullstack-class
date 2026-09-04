import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  // Sends/receives the httpOnly refresh-token cookie the backend now sets
  // on login/register instead of returning it in the JSON body.
  withCredentials: true,
});

// The access token now lives in memory only (see store/authSlice.js) —
// never localStorage. This module-level variable is how axiosInstance
// reads the current value without importing the Redux store directly,
// which would create a circular import (store -> authSlice -> this file
// -> store). authSlice calls setAccessToken() whenever the token changes.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

function redirectToLogin() {
  setAccessToken(null);
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

// Handles an expired access token transparently: on a 401 from a protected
// route, try the refresh token once (sent automatically as a cookie via
// withCredentials — no body needed) and retry the original request. If the
// refresh token is also invalid/expired, the session is really over — clear
// it and send the user back to the login screen.
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.startsWith("/auth/");

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axiosInstance.post("/auth/refresh").finally(() => {
          refreshPromise = null;
        });
      }
      const { data } = await refreshPromise;
      setAccessToken(data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
