import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function NavItem({to, icon: Icon, label, variant = "link", onClick, collapsed = false,}) {
    const baseClasses = `group relative flex min-h-[46px] w-full items-center rounded-xl text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98] ${collapsed ? "justify-center px-2" : "gap-3 px-3.5"}`;

    /*
     * Logout / button variant
     */
    if (variant === "button") {
        return (
            <button
                type="button"
                onClick={onClick}
                title={collapsed ? label : undefined}
                className={`${baseClasses} text-white/55 hover:bg-red-500/10 hover:text-red-300`}
            >
                <Icon
                    size={19}
                    strokeWidth={2}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                />

                <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
                >
                    {label}
                </span>
            </button>
        );
    }

    return (
        <NavLink
            to={to}
            onClick={onClick}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
                `${baseClasses} ${
                    isActive
                        ? "bg-white/10 text-white"
                        : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {/* Active indicator */}

                    {isActive && (
                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#9fb0cf]" />
                    )}

                    {/* Icon */}

                    <span className="flex shrink-0 items-center justify-center">
                        <Icon
                            size={19}
                            strokeWidth={isActive ? 2.4 : 2}
                            className={`transition-all duration-200 ${isActive ? "text-white" : ""} group-hover:scale-105`}
                        />
                    </span>

                    {/* Label */}

                    <span
                        className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
                    >
                        {label}
                    </span>

                    {/* Active arrow */}

                    {!collapsed && isActive && (
                        <ChevronRight
                            size={14}
                            strokeWidth={2.2}
                            className="ml-auto shrink-0 text-white/40"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}

export default NavItem;