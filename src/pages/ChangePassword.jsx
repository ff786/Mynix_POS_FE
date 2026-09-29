import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, MessageSquareText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { changePassword, requestPasswordCode } from "@/services/authApi";


const inputClasses =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none shadow-sm transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";


/**
 * Changing the password takes two steps: a 6-digit code sent by SMS to the
 * shop phone, then the code with the new password. After an emergency reset
 * (temporary password Admin@123) this page is required before anything else.
 */
function ChangePassword() {

    const navigate = useNavigate();
    const { user, logout, passwordChanged } = useAuth();

    const [sentTo, setSentTo] = useState(null);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const required = Boolean(user?.mustChangePassword);


    async function sendCode() {

        setError("");

        try {

            setBusy(true);

            const data = await requestPasswordCode();

            setSentTo(data.sentTo);

            toast.success(`Code sent to ${data.sentTo}.`);

        } catch (e) {

            setError(e.response?.data?.message ?? "Couldn't send the code. Please try again.");

        } finally {

            setBusy(false);

        }
    }


    async function handleSubmit(e) {

        e.preventDefault();
        setError("");

        if (!/^\d{6}$/.test(code.trim())) {
            setError("Enter the 6-digit code from the SMS.");
            return;
        }

        if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            setError("Use at least 10 characters, with letters and numbers.");
            return;
        }

        if (password !== confirm) {
            setError("The two passwords don't match.");
            return;
        }

        try {

            setBusy(true);

            await changePassword(code.trim(), password);

            passwordChanged();

            toast.success("Password changed.");

            navigate("/dashboard", { replace: true });

        } catch (e) {

            setError(e.response?.data?.message ?? "Couldn't change the password. Please try again.");

        } finally {

            setBusy(false);

        }
    }


    return (

        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">

            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <KeyRound size={20} />
                </div>

                <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                    {required ? "Choose a new password" : "Change password"}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    {required
                        ? "You signed in with a temporary password. Choose your own before using the POS."
                        : `Signed in as ${user?.username}.`}
                    {" "}We&apos;ll text a code to the shop phone to confirm it&apos;s you.
                </p>


                {!sentTo ? (

                    <button
                        type="button"
                        onClick={sendCode}
                        disabled={busy}
                        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                        <MessageSquareText size={17} />
                        {busy ? "Sending..." : "Send code by SMS"}
                    </button>

                ) : (

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800">
                            <ShieldCheck size={16} />
                            Code sent to {sentTo}. It expires in 10 minutes.
                        </p>

                        <label className="block space-y-2 text-sm font-semibold text-slate-700">
                            <span>SMS code</span>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="123456"
                                className={`${inputClasses} tracking-[0.3em]`}
                            />
                        </label>

                        <label className="block space-y-2 text-sm font-semibold text-slate-700">
                            <span>New password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                className={inputClasses}
                            />
                            <span className="block text-xs font-normal text-slate-400">
                                At least 10 characters, with letters and numbers.
                            </span>
                        </label>

                        <label className="block space-y-2 text-sm font-semibold text-slate-700">
                            <span>Repeat new password</span>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                autoComplete="new-password"
                                className={inputClasses}
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={busy}
                            className="h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {busy ? "Saving..." : "Save new password"}
                        </button>

                        <button
                            type="button"
                            onClick={sendCode}
                            disabled={busy}
                            className="w-full text-sm text-slate-500 hover:text-slate-900 disabled:opacity-50"
                        >
                            Send a new code
                        </button>

                    </form>
                )}


                {error && (
                    <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                        {error}
                    </p>
                )}


                <div className="mt-6 flex justify-between border-t border-slate-100 pt-4 text-sm">

                    {!required ? (
                        <button type="button" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900">
                            Cancel
                        </button>
                    ) : <span />}

                    <button
                        type="button"
                        onClick={() => {
                            logout();
                            navigate("/login", { replace: true });
                        }}
                        className="text-slate-500 hover:text-red-600"
                    >
                        Sign out
                    </button>

                </div>

            </div>

        </main>
    );
}

export default ChangePassword;
