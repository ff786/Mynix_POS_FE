import { useNavigate } from "react-router-dom";
import {
    LogOut,
    X,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

import NavItem from "../common/NavItem";
import { navigation } from "../../config/navigation";
import { useAuth } from "@/context/AuthContext";

function Sidebar({
    isOpen,
    onClose,
    collapsed,
    onToggleCollapse,
}) {
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
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 z-50 h-[100dvh] bg-white border-r border-slate-200/80 flex flex-col overflow-hidden shadow-[8px_0_30px_rgba(15,23,42,0.04)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                    ${collapsed ? "lg:w-[76px]" : "lg:w-[280px]"}
                    w-[280px] max-w-[88vw] shrink-0
                `}
                style={{
                    paddingTop: "env(safe-area-inset-top)",
                }}
            >
                {/* Brand */}
                <div className={`
                    relative h-[76px] shrink-0 border-b border-slate-100 flex items-center
                    ${collapsed ? "justify-center px-3" : "justify-between px-5"}
                    transition-all duration-300
                `}>
                    {/* Logo */}
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center min-w-0 outline-none"
                        title={collapsed ? "MYNIX Dashboard" : undefined}
                    >
                        {/* Logo mark */}
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                            M
                        </div>

                        {/* Brand text */}
                        <div className={`
                            ml-3 overflow-hidden whitespace-nowrap transition-all duration-300
                            ${collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"}
                        `}>
                            <h1 className="text-lg font-black tracking-tight text-slate-900">
                                MYNIX
                            </h1>

                            <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-slate-400">
                                POS SYSTEM
                            </p>
                        </div>
                    </button>

                    {/* Mobile close */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                        <X size={19} />
                    </button>

                    {/* Desktop collapse */}
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className={`
                            hidden lg:flex absolute -right-3 top-[26px] w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition z-10
                        `}
                    >
                        {collapsed ? (
                            <PanelLeftOpen size={13} />
                        ) : (
                            <PanelLeftClose size={13} />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 scrollbar-thin scrollbar-thumb-slate-200">
                    {/* Section label */}
                    <div className={`
                        px-3 mb-3 overflow-hidden whitespace-nowrap transition-all duration-300
                        ${collapsed ? "h-0 opacity-0 mb-0" : "h-6 opacity-100"}
                    `}>
                        <span className="text-[10px] leading-4 uppercase tracking-[0.18em] font-bold text-slate-400">
                            Workspace
                        </span>
                    </div>

                    <div className="space-y-1">
                        {visibleNavigation.map((item) => (
                            <NavItem
                                key={item.path}
                                to={item.path}
                                icon={item.icon}
                                label={item.label}
                                collapsed={collapsed}
                                onClick={onClose}
                            />
                        ))}
                    </div>
                </nav>

                {/* User area */}
                <div className="shrink-0 border-t border-slate-100 p-3">
                    <div className={`
                        rounded-xl bg-slate-50 border border-slate-100 mb-2 transition-all duration-300
                        ${collapsed ? "p-2" : "p-3"}
                    `}>
                        <div className={`
                            flex items-center
                            ${collapsed ? "justify-center" : "gap-3"}
                        `}>
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                                {user?.username?.charAt(0).toUpperCase() || "U"}
                            </div>

                            {/* User details */}
                            <div className={`
                                min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300
                                ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                            `}>
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {user?.username || "User"}
                                </p>

                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    {user?.role || ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Logout */}
                    <NavItem
                        icon={LogOut}
                        label="Logout"
                        variant="button"
                        collapsed={collapsed}
                        onClick={handleLogout}
                    />
                </div>
            </aside>
        </>
    );
}

export default Sidebar;