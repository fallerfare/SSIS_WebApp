import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    isLoggedIn: boolean;
    children: JSX.Element;
}

export function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
