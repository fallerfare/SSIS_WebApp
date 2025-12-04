import { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    isLoggedIn: boolean;
    children: JSX.Element;
}

export function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}
