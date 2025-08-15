import axios from "axios";

const axiosService = axios.create({
  baseURL: "/",
  timeout: 10000,
});
axiosService.interceptors.request.use(
  function (config) {
    // const accessToken = localStorage?.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    // if (accessToken && config.headers) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    return config;
  },
  function (error) {
    return Promise.reject(new Error(error));
  },
);

// Add a response interceptor
axiosService.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    // const originalRequest = error.config;
    // if (error?.response?.status === 401 && !originalRequest._retry) {
    //     localStorage?.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    //     const refreshToken = localStorage?.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    //     if (refreshToken) {
    //         originalRequest._retry = true;
    //         return axiosService
    //             .get<IAuthRefreshTokenResponse>("/auth/refresh-token", {
    //                 data: {
    //                     refreshToken,
    //                 },
    //             })
    //             .then((res) => {
    //                 const { accessToken, refreshToken } = res.data;
    //                 localStorage?.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
    //                 localStorage?.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshToken);
    //                 originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
    //                 return axiosService(originalRequest);
    //             })
    //             .catch(() => {
    //                 localStorage?.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    //             });
    //     }
    // }
    return Promise.reject(error?.response?.data ?? error);
  },
);
export const { get, post, put, patch, delete: del } = axiosService;
