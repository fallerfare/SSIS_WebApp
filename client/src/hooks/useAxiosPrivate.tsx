import { useEffect } from "react";
import { axiosPrivate } from "../controller/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    sent?: boolean;
}

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                config.withCredentials = true;

                (config.headers as any) = {
                    ...config.headers,
                    Authorization: config.headers?.Authorization ?? `Bearer ${auth?.accessToken}`
                };

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const prevRequest = error.config as RetryRequestConfig;
                const status = error.response?.status;

                if ((status === 401 || status === 403) && !prevRequest.sent) {
                    prevRequest.sent = true;

                    try {
                        const newToken = await refresh();

                        (prevRequest.headers as any) = {
                            ...prevRequest.headers,
                            Authorization: `Bearer ${newToken}`
                        };

                        return axiosPrivate(prevRequest);
                    } catch (err) {
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
