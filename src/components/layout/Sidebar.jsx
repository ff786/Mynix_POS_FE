import { useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";

import NavItem from "../common/NavItem";
import { navigation } from "../../config/navigation";

import { useAuth } from "@/context/AuthContext";

function Sidebar({ isOpen, onClose }) {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", {
            replace: true,
        });
    };

    const visibleNavigation = navigation.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <>
            {/* Mobile backdrop — tap to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85%] h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col overflow-y-auto
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:static md:z-auto md:translate-x-0 md:shrink-0 md:transition-none
                `}
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
                {/* Logo */}
                <div className="px-6 py-6 border-b flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-emerald-600">
                            MYNIX
                        </h1>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                            POS SYSTEM
                        </p>
                    </div>

                    {/* Close button — mobile only */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="md:hidden p-1 text-slate-400 hover:text-slate-700 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {visibleNavigation.map(item => (

                        <NavItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            onClick={onClose}
                        />

                    ))}
                </nav>

                {/* User / Logout */}
                <div className="px-4 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                                {user?.username || "User"}
                            </p>
                            <p className="text-xs text-slate-400">
                                {user?.role || ""}
                            </p>
                        </div>
                    </div>
                    <NavItem
                        icon={LogOut}
                        label="Logout"
                        variant="button"
                        onClick={handleLogout}
                    />
                </div>
            </aside>
        </>
    );
}

export default Sidebar;