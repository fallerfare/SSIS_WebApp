import { fetchMe } from "@/controller/api";
import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    isLoggedIn: boolean;
    children: JSX.Element;
}

export function PublicRoute({ isLoggedIn, children }: PublicRouteProps) {
    const [verified, setVerified] = useState(isLoggedIn);

    useEffect(() => {
        const check = async () => {
            const data = await fetchMe();
            setVerified(data.isLoggedIn);
        };
        check();
    }, []);

    if (verified) {
        return <Navigate to="/table/students" replace />;
    }
    return children;
}
