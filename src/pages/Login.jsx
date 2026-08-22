import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Gem, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

import { loginUser } from "@/services/authApi";
import { useAuth } from "@/context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            setError("Please enter your username.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(trimmedUsername, password);

            login(data);

            navigate("/dashboard", { replace: true });
        } catch (requestError) {
            console.error("Login failed:", requestError);

            setError(requestError?.response?.data?.message || "Invalid username or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[100dvh] overflow-hidden bg-slate-950">
            <div className="flex min-h-[100dvh] flex-col lg:flex-row">
                <section className="relative hidden overflow-hidden lg:flex lg:w-[52%] xl:w-[56%]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:48px_48px]" />

                    <div className="relative z-10 flex min-h-full w-full flex-col justify-between p-10 xl:p-14">
                        <div>
                            <div className="inline-flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_12px_35px_rgba(16,185,129,0.28)]">
                                    <Gem size={24} strokeWidth={2.3} />
                                </div>

                                <div>
                                    <p className="text-xl font-black tracking-tight text-white">MYNIX</p>
                                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-emerald-300">POS SYSTEM</p>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Retail Management System
                            </div>

                            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white xl:text-6xl">
                                Powerful tools for
                                <span className="block text-emerald-400">smarter business.</span>
                            </h1>

                            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
                                Manage sales, products, customers, inventory and payments from one elegant workspace built for modern Sri Lankan businesses.
                            </p>

                            <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 xl:grid-cols-3">
                                <Feature icon={ShieldCheck} title="Secure" text="Protected access" />
                                <Feature icon={Gem} title="Smart" text="Built for retail" />
                                <Feature icon={ArrowRight} title="Simple" text="Fast workflows" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 h-px w-24 bg-gradient-to-r from-emerald-500 to-transparent" />
                            <p className="text-xs font-semibold text-slate-400">© 2026 MYNIX PVT (LTD)</p>
                            <p className="mt-1 text-[11px] text-slate-500">
                                Crafted &amp; developed by{" "}
                                <span className="font-semibold text-slate-300">FS Technologies</span>
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex min-h-[100dvh] w-full flex-1 items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:w-[48%] lg:px-10 xl:w-[44%]">
                    <div className="w-full max-w-md">
                        <div className="mb-8 flex flex-col items-center text-center lg:hidden">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_10px_30px_rgba(5,150,105,0.22)]">
                                <Gem size={26} strokeWidth={2.2} />
                            </div>

                            <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900">MYNIX</h1>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">POS SYSTEM</p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_70px_rgba(15,23,42,0.09)] sm:p-8">
                            <div className="mb-7">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Welcome back</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Sign in to MYNIX</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">Access your business management workspace.</p>
                            </div>

                            {error && (
                                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-700">
                                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                    <p className="leading-5">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="username" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Username
                                    </label>

                                    <div className="relative">
                                        <UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                        <input
                                            id="username"
                                            value={username}
                                            onChange={event => setUsername(event.target.value)}
                                            autoComplete="username"
                                            autoCapitalize="none"
                                            spellCheck="false"
                                            placeholder="Enter your username"
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Password
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={event => setPassword(event.target.value)}
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(previous => !previous)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                                >
                                    {loading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-center gap-2 text-center">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <p className="text-[10px] font-medium text-slate-400">Secure business access</p>
                            </div>
                        </div>

                        <div className="mt-6 text-center lg:hidden">
                            <p className="text-[10px] font-medium text-slate-400">© 2026 MYNIX PVT (LTD)</p>
                            <p className="mt-1 text-[10px] text-slate-400">
                                Crafted &amp; developed by{" "}
                                <span className="font-semibold text-slate-500">FS Technologies</span>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function Feature({ icon: Icon, title, text }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
            <Icon size={16} className="text-emerald-400" />
            <p className="mt-2 text-xs font-bold text-white">{title}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">{text}</p>
        </div>
    );
}

export default Login;