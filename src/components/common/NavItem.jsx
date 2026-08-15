import { NavLink } from "react-router-dom";

function NavItem({ to, icon: Icon, label, variant = "link", onClick }) {

    const baseClasses =
        "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors";

    if (variant === "button") {

        return (
            <button
                type="button"
                onClick={onClick}
                className={`${baseClasses} text-slate-600 hover:bg-red-50 hover:text-red-600`}
            >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
            </button>
        );
    }

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `${baseClasses} ${
                    isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
            }
        >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
        </NavLink>
    );
}

export default NavItem;