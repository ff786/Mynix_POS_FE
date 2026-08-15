import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import {
    getUsers,
    deactivateUser,
} from "@/services/userApi";

import StaffModal from "@/components/staff/StaffModal";

function Staff() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {

        try {

            setLoading(true);

            const data = await getUsers();

            setUsers(data);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load staff."
            );

        } finally {

            setLoading(false);

        }
    }

    function handleAdd() {

        setSelectedUser(null);
        setModalOpen(true);

    }

    function handleEdit(user) {

        setSelectedUser(user);
        setModalOpen(true);

    }

    async function handleDeactivate(user) {

        if (user.username === "admin") {

            toast.error(
                "The system administrator cannot be deactivated."
            );

            return;
        }

        const confirmed = window.confirm(
            `Deactivate ${user.fullName}?`
        );

        if (!confirmed) return;

        try {

            await deactivateUser(user.id);

            toast.success(
                `${user.fullName} deactivated.`
            );

            loadUsers();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to deactivate staff."
            );

        }
    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Staff
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage cashiers and system users.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
                >
                    <Plus size={18} />
                    Add Staff
                </button>

            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

                {loading ? (

                    <div className="p-10 text-center text-slate-500">
                        Loading staff...
                    </div>

                ) : users.length === 0 ? (

                    <div className="p-16 text-center">

                        <Users
                            size={40}
                            className="mx-auto text-slate-300"
                        />

                        <p className="font-medium text-slate-700 mt-4">
                            No staff members found
                        </p>

                        <p className="text-sm text-slate-400 mt-1">
                            Add your first cashier to get started.
                        </p>

                    </div>

                ) : (

                    <table className="w-full">

                        <thead className="bg-slate-50 border-b">

                        <tr>

                            <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-slate-500">
                                Staff
                            </th>

                            <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-slate-500">
                                Username
                            </th>

                            <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-slate-500">
                                Role
                            </th>

                            <th className="text-left px-6 py-4 text-xs uppercase tracking-wide text-slate-500">
                                Status
                            </th>

                            <th className="text-right px-6 py-4 text-xs uppercase tracking-wide text-slate-500">
                                Actions
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {users.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b last:border-b-0 hover:bg-slate-50 transition"
                            >

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
                                            {user.fullName
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>

                                            <p className="font-medium text-slate-900">
                                                {user.fullName}
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {user.username}
                                </td>

                                <td className="px-6 py-4">

                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                        {user.role}
                                    </span>

                                </td>

                                <td className="px-6 py-4">

                                    {user.active ? (

                                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                            Active
                                        </span>

                                    ) : (

                                        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                            Inactive
                                        </span>

                                    )}

                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex justify-end gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(user)
                                            }
                                            className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-medium"
                                        >
                                            Edit
                                        </button>

                                        {user.active &&
                                            user.username !== "admin" && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeactivate(user)
                                                    }
                                                    className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                                                >
                                                    Deactivate
                                                </button>

                                            )}

                                    </div>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                )}

            </div>

            <StaffModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                user={selectedUser}
                onSuccess={loadUsers}
            />

        </div>
    );
}

export default Staff;