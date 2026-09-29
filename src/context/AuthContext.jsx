import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        const mustChangePassword = localStorage.getItem("mustChangePassword") === "true";

        if (token && username && role) {

            setUser({
                username,
                role,
                mustChangePassword,
            });

        }

        setLoading(false);

    }, []);

    function login(data) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("mustChangePassword", String(Boolean(data.mustChangePassword)));

        setUser({
            username: data.username,
            role: data.role,
            mustChangePassword: Boolean(data.mustChangePassword),
        });
    }

    /** After a successful password change, the POS opens up again. */
    function passwordChanged() {

        localStorage.setItem("mustChangePassword", "false");

        setUser(previous => previous && { ...previous, mustChangePassword: false });
    }

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("mustChangePassword");

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                passwordChanged,
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