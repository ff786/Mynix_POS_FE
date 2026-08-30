import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const fullName = localStorage.getItem("fullName");
        const role = localStorage.getItem("role");

        if (token && username && role) {

            setUser({
                username,
                fullName: fullName || username,
                role,
            });

        }

        setLoading(false);

    }, []);

    function login(data) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        if (data.fullName) {
            localStorage.setItem("fullName", data.fullName);
        }

        setUser({
            username: data.username,
            fullName: data.fullName || data.username,
            role: data.role,
        });
    }

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("fullName");
        localStorage.removeItem("role");

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}