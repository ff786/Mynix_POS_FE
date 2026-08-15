import { useEffect, useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
    createUser,
    updateUser,
} from "@/services/userApi";

function StaffForm({
                       user,
                       onSuccess,
                       onClose,
                   }) {
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        password: "",
        role: "CASHIER",
    });

    useEffect(() => {
        setShowPassword(false);

        if (user) {
            setForm({
                fullName: user.fullName || "",
                username: user.username || "",
                password: "",
                role: user.role || "CASHIER",
            });
        } else {
            setForm({
                fullName: "",
                username: "",
                password: "",
                role: "CASHIER",
            });
        }
    }, [user]);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const fullName = form.fullName.trim();
        const username = form.username.trim();

        if (!fullName) {
            toast.error("Full name is required.");
            return;
        }

        if (!username) {
            toast.error("Username is required.");
            return;
        }

        if (!user && !form.password.trim()) {
            toast.error("Password is required.");
            return;
        }

        if (!user && form.password.trim().length < 6) {
            toast.error("Password must contain at least 6 characters.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                fullName,
                username,
                role: form.role,
            };

            if (form.password.trim()) {
                payload.password = form.password.trim();
            }

            if (user) {
                await updateUser(user.id, payload);
                toast.success("Staff updated successfully.");
            } else {
                await createUser(payload);
                toast.success("Staff created successfully.");
            }

            await onSuccess();
            onClose();
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to save staff."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Full name */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                </label>

                <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Mohamed Farsith"
                    autoComplete="name"
                    className="w-full h-11 border border-slate-200 rounded-xl bg-slate-50 px-4 text-sm outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
            </div>

            {/* Username */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Username
                </label>

                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="e.g. cashier01"
                    autoComplete="username"
                    className="w-full h-11 border border-slate-200 rounded-xl bg-slate-50 px-4 text-sm font-mono outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <p className="text-xs text-slate-400 mt-1.5">
                    This username will be used to sign in.
                </p>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password

                    {user && (
                        <span className="ml-2 text-xs font-normal text-slate-400">
                            Optional when editing
                        </span>
                    )}
                </label>

                <div className="relative">
                    <LockKeyhole
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder={user ? "Enter new password" : "Enter password"}
                        autoComplete="new-password"
                        className="w-full h-11 border border-slate-200 rounded-xl bg-slate-50 pl-10 pr-11 text-sm outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(previous => !previous)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                </div>

                {!user && (
                    <p className="text-xs text-slate-400 mt-1.5">
                        Use at least 6 characters.
                    </p>
                )}
            </div>

            {/* Role */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Account Role
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <RoleOption
                        value="CASHIER"
                        current={form.role}
                        onSelect={role =>
                            setForm(previous => ({
                                ...previous,
                                role,
                            }))
                        }
                        icon={UserRound}
                        title="Cashier"
                        description="POS and sales operations"
                    />

                    <RoleOption
                        value="ADMIN"
                        current={form.role}
                        onSelect={role =>
                            setForm(previous => ({
                                ...previous,
                                role,
                            }))
                        }
                        icon={ShieldCheck}
                        title="Administrator"
                        description="Full system access"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="w-full sm:w-auto min-h-11 px-5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto min-h-11 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl text-sm font-semibold transition"
                >
                    {saving
                        ? "Saving..."
                        : user
                            ? "Save Changes"
                            : "Create Staff"}
                </button>
            </div>
        </form>
    );
}

/* Role option */
function RoleOption({
    value,
    current,
    onSelect,
    icon: Icon,
    title,
    description,
}) {
    const selected = value === current;

    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={`text-left rounded-xl border p-4 transition ${
                selected
                    ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/10"
                    : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        selected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white text-slate-500"
                    }`}
                >
                    <Icon size={17} />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                        {title}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                        {description}
                    </p>
                </div>
            </div>
        </button>
    );
}

export default StaffForm;