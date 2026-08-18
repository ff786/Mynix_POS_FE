import { useEffect, useRef, useState } from "react";
import {
    Bell,
    Menu,
    ChevronDown,
    LogOut,
    User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

const pageTitles = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Overview",
    },

    "/pos": {
        title: "New Sale",
        subtitle: "Point of Sale",
    },

    "/products": {
        title: "Products",
        subtitle: "Inventory Management",
    },

    "/categories": {
        title: "Categories",
        subtitle: "Product Organization",
    },

    "/sales": {
        title: "Sales",
        subtitle: "Transaction History",
    },

    "/staff": {
        title: "Staff",
        subtitle: "User Management",
    },

    "/customers": {
        title: "Customers",
        subtitle: "Customer Management",
    },
};

function Topbar({ onMenuClick }) {
    const location = useLocation();
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);

    const page = pageTitles[location.pathname] || {
        title: "MYNIX",
        subtitle: "Business Management",
    };

    const initials = user?.username?.charAt(0)?.toUpperCase() || "U";

    /*
     * Close profile menu when clicking outside
     */
    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    /*
     * Close profile menu when route changes
     */
    useEffect(() => {
        setProfileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        setProfileOpen(false);

        logout();

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <header className="sticky top-0 z-30 shrink-0 px-3 pt-3 sm:px-4 sm:pt-4 md:px-5 lg:px-6 xl:px-8">
            <div className="relative flex h-[60px] items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:h-16 sm:px-4 md:px-5 lg:px-6">

                {/* LEFT */}

                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                    {/* Mobile menu */}

                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 lg:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Page indicator */}

                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 sm:flex">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.10)]" />
                    </div>

                    {/* Page information */}

                    <div className="min-w-0">
                        <p className="hidden truncate text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-slate-400 md:block">
                            {page.subtitle}
                        </p>

                        <h2 className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base md:mt-1">
                            {page.title}
                        </h2>
                    </div>
                </div>

                {/* RIGHT */}

                <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">

                    {/* Notifications */}

                    {/*<button
                        type="button"
                        aria-label="Notifications"
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                    >
                        <Bell size={18} />

                        <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>*/}

                    {/* Divider */}

                    <div className="hidden h-7 w-px bg-slate-200 sm:block" />

                    {/* PROFILE */}

                    <div
                        ref={profileRef}
                        className="relative"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setProfileOpen(
                                    previous => !previous
                                )
                            }
                            aria-expanded={profileOpen}
                            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-50 active:scale-[0.98]"
                        >
                            {/* Avatar */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
                                {initials}
                            </div>

                            {/* Details */}

                            <div className="hidden min-w-0 text-left sm:block">
                                <p className="max-w-[110px] truncate text-sm font-semibold leading-tight text-slate-800 lg:max-w-[160px]">
                                    {user?.username || "User"}
                                </p>

                                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    {user?.role || ""}
                                </p>
                            </div>

                            <ChevronDown
                                size={15}
                                className={`hidden text-slate-400 transition-transform md:block ${profileOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Profile dropdown */}

                        {profileOpen && (
                            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.14)]">

                                {/* User header */}

                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-700">
                                        {initials}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {user?.username || "User"}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-slate-400">
                                            {user?.role || ""}
                                        </p>
                                    </div>
                                </div>

                                {/* Profile */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <User size={17} />
                                    My Profile
                                </button>

                                {/* Logout */}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;