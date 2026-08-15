import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "@/services/authApi";
import { useAuth } from "@/context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            const data = await loginUser(
                username,
                password
            );

            login(data);

            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid username or password."
            );

        } finally {

            setLoading(false);

        }
    }

    return (

        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

            <div className="w-full max-w-md">

                <div className="bg-white border rounded-2xl shadow-sm p-8">

                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-bold text-slate-900">
                            MYNIX
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            POS SYSTEM
                        </p>

                    </div>

                    {error && (

                        <div className="mb-5 rounded-lg bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">
                            {error}
                        </div>

                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block text-sm font-medium mb-2">
                                Username
                            </label>

                            <input
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter username"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter password"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg py-3 font-semibold transition"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"
                            }
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;