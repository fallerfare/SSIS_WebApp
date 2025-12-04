import { fetchMe } from "@/controller/api";
import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    isLoggedIn: boolean;
    children: JSX.Element;
}

export function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
    const [verified, setVerified] = useState(isLoggedIn);

    useEffect(() => {
        const check = async () => {
            const data = await fetchMe();
            setVerified(data.isLoggedIn);
        };
        check();
    }, []);

    if (!verified) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
