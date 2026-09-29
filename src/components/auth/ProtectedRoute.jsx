import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function ProtectedRoute({children, roles = [],}) {

    const {
        user,
        loading,
    } = useAuth();

    const location = useLocation();

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );

    }

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    // After an emergency reset, a new password comes first.
    if (
        user.mustChangePassword &&
        location.pathname !== "/change-password"
    ) {

        return (
            <Navigate
                to="/change-password"
                replace
            />
        );

    }

    if (
        roles.length > 0 &&
        !roles.includes(user.role)
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    return children;
}

export default ProtectedRoute;