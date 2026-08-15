import { Bell, Menu, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
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
};

function Topbar({ onMenuClick }) {
    const location = useLocation();
    const { user } = useAuth();

    const page = pageTitles[location.pathname] || {
        title: "MYNIX",
        subtitle: "Business Management",
    };

    const initials = user?.username?.charAt(0)?.toUpperCase() || "U";

    return (
        <header className="sticky top-0 z-30 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 pt-2 sm:pt-3 shrink-0">
            <div className="h-14 sm:h-16 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex items-center justify-between px-3 sm:px-4 md:px-5 lg:px-6 gap-3">
                {/* Left */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {/* Mobile menu */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation"
                        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Page icon / indicator */}
                    <div className="hidden sm:flex w-9 h-9 rounded-xl bg-emerald-50 items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                    </div>

                    {/* Page information */}
                    <div className="min-w-0">
                        <p className="hidden md:block text-[10px] uppercase tracking-[0.16em] font-bold text-slate-400 leading-none">
                            {page.subtitle}
                        </p>

                        <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate md:mt-1">
                            {page.title}
                        </h2>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
                    {/* Notification */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                        <Bell size={18} />

                        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>

                    {/* Divider */}
                    <div className="hidden sm:block h-7 w-px bg-slate-200 mx-1" />

                    {/* User */}
                    <div className="flex items-center gap-2 sm:gap-2.5 pl-1 sm:pl-0">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                            {initials}
                        </div>

                        {/* User details */}
                        <div className="hidden sm:block min-w-0">
                            <p className="text-sm font-semibold text-slate-800 leading-tight max-w-[120px] lg:max-w-[180px] truncate">
                                {user?.username || "User"}
                            </p>

                            <p className="text-[11px] text-slate-400 mt-0.5 uppercase">
                                {user?.role || ""}
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className="hidden md:block text-slate-400"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;