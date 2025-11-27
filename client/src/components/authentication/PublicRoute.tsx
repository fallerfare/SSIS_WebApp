import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    isLoggedIn: boolean;
    children: JSX.Element;
}

export function PublicRoute({ isLoggedIn, children }: PublicRouteProps) {
    if (isLoggedIn) {
        return <Navigate to="/table/students" replace />;
    }
    return children;
}
