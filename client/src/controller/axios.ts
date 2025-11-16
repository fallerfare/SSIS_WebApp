import axios, {
    AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from "axios";

import type { AuthState, RefreshResponse } from "@/models/types/auth";

const BASE_URL = "http://localhost:8080";

export const axiosPublic = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// ------------------------------
// PRIVATE AXIOS INSTANCE
// ------------------------------
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// ------------------------------
// REQUEST INTERCEPTOR
// ------------------------------
axiosPrivate.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const auth: AuthState = JSON.parse(localStorage.getItem("auth") || "{}");

        if (auth?.accessToken) {
            (config.headers as any) = {
                ...config.headers,
                Authorization: `Bearer ${auth.accessToken}`
            };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ------------------------------
// RESPONSE (REFRESH TOKEN) INTERCEPTOR
// ------------------------------
axiosPrivate.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = await axios.get<RefreshResponse>(
                    `${BASE_URL}/api/auth/refresh`,
                    { withCredentials: true }
                );

                const newAccessToken = refresh.data.accessToken;

                const currentAuth: AuthState = JSON.parse(localStorage.getItem("auth") || "{}");
                const updatedAuth: AuthState = {
                    ...currentAuth,
                    accessToken: newAccessToken,
                    role: refresh.data.role
                };

                localStorage.setItem("auth", JSON.stringify(updatedAuth));

                axiosPrivate.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

                (originalRequest.headers as any) = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return axiosPrivate(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("auth");
                localStorage.removeItem("persist");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
