import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Users,
    Search,
    ShieldCheck,
    UserRound,
    UserCheck,
    UserX,
    X,
} from "lucide-react";
import { toast } from "sonner";

import {
    getUsers,
    deactivateUser,
} from "@/services/userApi";

import StaffModal from "@/components/staff/StaffModal";

function Staff() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load staff.");
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
        if (user.username?.toLowerCase() === "admin") {
            toast.error("The system administrator cannot be deactivated.");
            return;
        }

        const confirmed = window.confirm(`Deactivate ${user.fullName}?`);

        if (!confirmed) {
            return;
        }

        try {
            await deactivateUser(user.id);
            toast.success(`${user.fullName} has been deactivated.`);
            await loadUsers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to deactivate staff.");
        }
    }

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return users;
        }

        return users.filter((user) => {
            const fullName = user.fullName?.toLowerCase() || "";
            const username = user.username?.toLowerCase() || "";
            const role = user.role?.toLowerCase() || "";

            return fullName.includes(query) || username.includes(query) || role.includes(query);
        });
    }, [users, search]);

    const activeCount = users.filter(user => user.active).length;
    const cashierCount = users.filter(user => user.role === "CASHIER").length;
    const adminCount = users.filter(user => user.role === "ADMIN").length;

    if (loading) {
        return (
            <div className="w-full max-w-[1600px] mx-auto space-y-6">
                {/* Header skeleton */}
                <div className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse" />

                {/* Stats skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-24 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                    ))}
                </div>

                {/* Table skeleton */}
                <div className="h-[420px] rounded-2xl bg-white border border-slate-200 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-5">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <Users size={21} className="text-emerald-600" />
                        </div>

                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                Staff Management
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Manage cashiers and system users
                            </p>
                        </div>
                    </div>

                    {/* Search + Add */}
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-64 lg:w-72">
                            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search staff..."
                                className="w-full h-11 border border-slate-200 rounded-xl bg-slate-50 pl-10 pr-9 text-sm outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="h-11 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition shadow-sm whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>Add Staff</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard icon={Users} label="Total Staff" value={users.length} />
                <StatCard icon={UserCheck} label="Active" value={activeCount} iconClass="text-emerald-600" iconBg="bg-emerald-50" />
                <StatCard icon={UserRound} label="Cashiers" value={cashierCount} iconClass="text-blue-600" iconBg="bg-blue-50" />
                <StatCard icon={ShieldCheck} label="Administrators" value={adminCount} iconClass="text-violet-600" iconBg="bg-violet-50" />
            </div>

            {/* Results */}
            <div className="flex items-center justify-between px-1">
                <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-700">{filteredUsers.length}</span>{" "}
                    {filteredUsers.length === 1 ? "staff member" : "staff members"}
                </p>
            </div>

            {/* Staff list */}
            {filteredUsers.length === 0 ? (
                <EmptyState search={search} onClear={() => setSearch("")} onAdd={handleAdd} />
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className={headerClass}>Staff</th>
                                    <th className={headerClass}>Username</th>
                                    <th className={headerClass}>Role</th>
                                    <th className={headerClass}>Status</th>
                                    <th className={`${headerClass} text-right`}>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredUsers.map((user) => (
                                    <DesktopStaffRow
                                        key={user.id}
                                        user={user}
                                        onEdit={handleEdit}
                                        onDeactivate={handleDeactivate}
                                    />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-3">
                        {filteredUsers.map((user) => (
                            <MobileStaffCard
                                key={user.id}
                                user={user}
                                onEdit={handleEdit}
                                onDeactivate={handleDeactivate}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Modal */}
            <StaffModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                user={selectedUser}
                onSuccess={loadUsers}
            />
        </div>
    );
}

/* Stat card */
function StatCard({
                      icon: Icon,
                      label,
                      value,
                      iconClass = "text-slate-600",
                      iconBg = "bg-slate-100",
                  }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={iconClass} />
                </div>

                <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500">{label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
                </div>
            </div>
        </div>
    );
}

/* Desktop row */
function DesktopStaffRow({
                             user,
                             onEdit,
                             onDeactivate,
                         }) {
    const isAdmin = user.username?.toLowerCase() === "admin";

    return (
        <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition">
            {/* Staff */}
            <td className="px-6 py-5">
                <StaffIdentity user={user} />
            </td>

            {/* Username */}
            <td className="px-6 py-5 text-sm text-slate-600 font-mono">
                {user.username}
            </td>

            {/* Role */}
            <td className="px-6 py-5">
                <RoleBadge role={user.role} />
            </td>

            {/* Status */}
            <td className="px-6 py-5">
                <StatusBadge active={user.active} />
            </td>

            {/* Actions */}
            <td className="px-6 py-5">
                <div className="flex justify-end items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="min-h-9 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition"
                    >
                        Edit
                    </button>

                    {user.active && !isAdmin && (
                        <button
                            type="button"
                            onClick={() => onDeactivate(user)}
                            className="min-h-9 px-3.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition"
                        >
                            Deactivate
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

/* Mobile card */
function MobileStaffCard({
                             user,
                             onEdit,
                             onDeactivate,
                         }) {
    const isAdmin = user.username?.toLowerCase() === "admin";

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
                <StaffIdentity user={user} />
                <StatusBadge active={user.active} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Username</p>
                    <p className="text-sm text-slate-700 font-mono mt-1 truncate">{user.username}</p>
                </div>

                <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Role</p>
                    <div className="mt-1">
                        <RoleBadge role={user.role} />
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="flex-1 min-h-10 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition"
                >
                    Edit
                </button>

                {user.active && !isAdmin && (
                    <button
                        type="button"
                        onClick={() => onDeactivate(user)}
                        className="flex-1 min-h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition"
                    >
                        Deactivate
                    </button>
                )}
            </div>
        </div>
    );
}

/* Identity */
function StaffIdentity({ user }) {
    const initials = user.fullName?.trim()?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                {initials}
            </div>

            <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{user.fullName}</p>
                <p className="text-xs text-slate-400 mt-0.5">Staff ID #{user.id}</p>
            </div>
        </div>
    );
}

/* Role badge */
function RoleBadge({ role }) {
    const isAdmin = role === "ADMIN";

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isAdmin ? "bg-violet-50 text-violet-700 border border-violet-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
            {isAdmin ? <ShieldCheck size={13} /> : <UserRound size={13} />}
            {isAdmin ? "Administrator" : "Cashier"}
        </span>
    );
}

/* Status badge */
function StatusBadge({ active }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
            {active ? "Active" : "Inactive"}
        </span>
    );
}

/* Empty state */
function EmptyState({
                        search,
                        onClear,
                        onAdd,
                    }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 px-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <Users size={28} className="text-slate-400" />
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                {search ? "No staff members found" : "No staff members yet"}
            </h3>

            <p className="text-sm text-slate-400 mt-1.5">
                {search ? "Try a different name, username, or role." : "Add your first cashier to get started."}
            </p>

            <div className="mt-5 flex justify-center gap-2">
                {search && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="min-h-10 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Clear Search
                    </button>
                )}

                {!search && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="min-h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Plus size={16} />
                            Add Staff
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}

const headerClass = "px-6 py-4 text-left text-xs uppercase tracking-wider font-semibold text-slate-500";

export default Staff;