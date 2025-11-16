import React, { createContext, useState, useEffect, useRef } from "react";
import { axiosPublic } from "../controller/axios";
import type { AuthState, RefreshResponse } from "../models/types/auth";

interface AuthContextType {
    auth: AuthState;
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
    persist: boolean;
    setPersist: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({});
    const [persist, setPersist] = useState<boolean>(
        JSON.parse(localStorage.getItem("persist") || "false")
    );
    const [loading, setLoading] = useState<boolean>(true);

    const mountedRef = useRef(true);

    useEffect(() => () => {
        mountedRef.current = false;
    }, []);

    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                if (!persist) {
                    setLoading(false);
                    return;
                }

                const response = await axiosPublic.get<RefreshResponse>(
                    "/api/auth/refresh",
                    { withCredentials: true }
                );

                if (!mountedRef.current) return;

                const { accessToken, role, user } = response.data;

                setAuth({ accessToken, role, user });

            } catch (error) {
                if (!mountedRef.current) return;
                setAuth({});
            } finally {
                if (mountedRef.current) setLoading(false);
            }
        };

        refreshAccessToken();
    }, [persist]);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
