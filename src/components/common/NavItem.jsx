import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function NavItem({
    to,
    icon: Icon,
    label,
    variant = "link",
    onClick,
    collapsed = false,
}) {
    const baseClasses = `
        group relative flex items-center w-full min-h-[44px] rounded-xl text-sm font-medium transition-all duration-200
        ${collapsed ? "justify-center px-2" : "gap-3 px-3.5"}
    `;

    if (variant === "button") {
        return (
            <button
                type="button"
                onClick={onClick}
                title={collapsed ? label : undefined}
                className={`
                    ${baseClasses}
                    text-slate-500 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]
                `}
            >
                <Icon
                    size={19}
                    strokeWidth={2}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                />

                <span className={`
                    whitespace-nowrap overflow-hidden transition-all duration-200
                    ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                `}>
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
            className={({ isActive }) => `
                ${baseClasses}
                ${isActive
                ? "bg-emerald-50 text-emerald-700 font-semibold"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }
            `}
        >
            {({ isActive }) => (
                <>
                    {/* Active indicator */}
                    {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-emerald-600" />
                    )}

                    <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 2}
                        className={`
                            shrink-0 transition-all duration-200
                            ${isActive ? "text-emerald-600" : ""}
                            group-hover:scale-105
                        `}
                    />

                    <span className={`
                        whitespace-nowrap overflow-hidden transition-all duration-200
                        ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                    `}>
                        {label}
                    </span>

                    {/* Desktop expanded arrow */}
                    {!collapsed && isActive && (
                        <ChevronRight
                            size={14}
                            className="ml-auto text-emerald-400"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}

export default NavItem;