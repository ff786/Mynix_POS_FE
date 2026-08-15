import { useEffect, useState } from "react";
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

    const [form, setForm] = useState({
        fullName: "",
        username: "",
        password: "",
        role: "CASHIER",
    });

    useEffect(() => {

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

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!form.fullName.trim()) {
            toast.error("Full name is required.");
            return;
        }

        if (!form.username.trim()) {
            toast.error("Username is required.");
            return;
        }

        if (!user && !form.password.trim()) {
            toast.error("Password is required.");
            return;
        }

        try {

            setSaving(true);

            const payload = {
                fullName: form.fullName.trim(),
                username: form.username.trim(),
                role: form.role,
            };

            if (form.password.trim()) {
                payload.password = form.password;
            }

            if (user) {

                await updateUser(
                    user.id,
                    payload
                );

                toast.success(
                    "Staff updated successfully."
                );

            } else {

                await createUser(payload);

                toast.success(
                    "Staff created successfully."
                );

            }

            onSuccess();
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

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div>

                <label className="block text-sm font-medium mb-2">
                    Full Name
                </label>

                <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

            </div>

            <div>

                <label className="block text-sm font-medium mb-2">
                    Username
                </label>

                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

            </div>

            <div>

                <label className="block text-sm font-medium mb-2">

                    Password

                    {user && (
                        <span className="text-xs text-slate-400 ml-2">
                            Leave blank to keep current password
                        </span>
                    )}

                </label>

                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                        user
                            ? "Enter new password (optional)"
                            : "Enter password"
                    }
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

            </div>

            <div>

                <label className="block text-sm font-medium mb-2">
                    Role
                </label>

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                >

                    <option value="CASHIER">
                        Cashier
                    </option>

                    <option value="ADMIN">
                        Admin
                    </option>

                </select>

            </div>

            <div className="flex justify-end gap-3 pt-3">

                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="px-5 py-2.5 border rounded-lg hover:bg-slate-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-medium"
                >
                    {saving
                        ? "Saving..."
                        : user
                            ? "Save Changes"
                            : "Create Staff"
                    }
                </button>

            </div>

        </form>
    );
}

export default StaffForm;