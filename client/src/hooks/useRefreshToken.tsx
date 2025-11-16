import { useCallback } from "react";
import useAuth from "./useAuth";
import { axiosPublic } from "../controller/axios";
import type { RefreshResponse } from "@/models/types/auth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = useCallback(async () => {
        const response = await axiosPublic.get<RefreshResponse>("/api/auth/refresh", {
            withCredentials: true
        });

        setAuth(prev => ({
            ...prev,
            accessToken: response.data.accessToken,
            role: response.data.role,
            user: response.data.user
        }));

        return response.data.accessToken;
    }, [setAuth]);

    return refresh;
};

export default useRefreshToken;
