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

    const visibleNavigation =
        navigation.filter(item =>
            item.roles.includes(user?.role)
        );

    return (
        <>
            {/* =================================
                MOBILE BACKDROP
            ================================= */}

            {isOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={onClose}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-slate-950/45
                        backdrop-blur-[3px]
                        lg:hidden
                    "
                />
            )}

            {/* =================================
                SIDEBAR
            ================================= */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    h-[100dvh]
                    w-[272px]
                    max-w-[88vw]
                    shrink-0
                    flex-col
                    overflow-hidden

                    border-r
                    border-white/5

                    bg-[#050505]
                    text-white

                    shadow-[12px_0_40px_rgba(0,0,0,0.25)]

                    transition-all
                    duration-300
                    ease-[cubic-bezier(0.4,0,0.2,1)]

                    ${isOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }

                    lg:sticky
                    lg:translate-x-0

                    ${collapsed
                    ? "lg:w-[76px]"
                    : "lg:w-[272px]"
                }
                `}
                style={{
                    paddingTop:
                        "env(safe-area-inset-top)",
                    paddingBottom:
                        "env(safe-area-inset-bottom)",
                }}
            >

                {/* =================================
                    BRAND
                ================================= */}

                <div
                    className={`
                        relative
                        flex
                        h-[76px]
                        shrink-0
                        items-center
                        border-b
                        border-white/10
                        ${collapsed
                        ? "justify-center px-3"
                        : "justify-between px-5"
                    }
                    `}
                >

                    {/* Brand */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="
                            flex
                            min-w-0
                            items-center
                            rounded-xl
                            outline-none
                            focus-visible:ring-2
                            focus-visible:ring-white/40
                        "
                    >

                        {/* Logo */}

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            text-sm
                            font-bold
                            text-[#050505]
                        ">
                            M
                        </div>

                        {/* Brand text */}

                        <div
                            className={`
                                ml-3
                                overflow-hidden
                                whitespace-nowrap
                                transition-all
                                duration-300
                                ${collapsed
                                ? "ml-0 w-0 opacity-0"
                                : "w-auto opacity-100"
                            }
                            `}
                        >

                            <h1 className="
                                text-[15px]
                                font-semibold
                                uppercase
                                tracking-[0.42em]
                                text-white
                            ">
                                MYNIX
                            </h1>

                            <p className="
                                mt-0.5
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-white/40
                            ">
                                POS SYSTEM
                            </p>

                        </div>

                    </button>

                    {/* Mobile close */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-white/50
                            transition

                            hover:bg-white/10
                            hover:text-white

                            active:scale-95

                            lg:hidden
                        "
                    >
                        <X size={19} />
                    </button>

                    {/* Desktop collapse */}

                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                        className="
                            absolute
                            -right-3
                            top-[26px]
                            z-10
                            hidden
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/15
                            bg-[#0b0b0c]
                            text-white/50
                            shadow-sm
                            transition

                            hover:border-white/40
                            hover:text-white

                            lg:flex
                        "
                    >

                        {collapsed ? (
                            <PanelLeftOpen size={13} />
                        ) : (
                            <PanelLeftClose size={13} />
                        )}

                    </button>

                </div>

                {/* =================================
                    NAVIGATION
                ================================= */}

                <nav className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    px-3
                    py-5
                    [scrollbar-width:thin]
                ">

                    {/* Section */}

                    <div
                        className={`
                            mb-3
                            overflow-hidden
                            whitespace-nowrap
                            px-3
                            transition-all
                            duration-300

                            ${collapsed
                            ? "mb-0 h-0 opacity-0"
                            : "h-5 opacity-100"
                        }
                        `}
                    >

                        <span className="
                            text-[10px]
                            font-bold
                            uppercase
                            leading-4
                            tracking-[0.18em]
                            text-white/35
                        ">
                            Workspace
                        </span>

                    </div>

                    {/* Navigation items */}

                    <div className="space-y-1">

                        {visibleNavigation.map(item => (

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

                {/* =================================
                    USER AREA
                ================================= */}

                <div className="
                    shrink-0
                    border-t
                    border-white/10
                    bg-[#050505]
                    p-3
                ">

                    {/* User card */}

                    <div
                        className={`
                            mb-2
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.04]
                            transition-all
                            duration-300

                            ${collapsed
                            ? "p-2"
                            : "p-3"
                        }
                        `}
                    >

                        <div
                            className={`
                                flex
                                items-center

                                ${collapsed
                                ? "justify-center"
                                : "gap-3"
                            }
                            `}
                        >

                            {/* Avatar */}

                            <div className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-sm
                                font-bold
                                text-[#050505]
                            ">
                                {user?.username
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                    "U"}
                            </div>

                            {/* Details */}

                            <div
                                className={`
                                    min-w-0
                                    overflow-hidden
                                    whitespace-nowrap
                                    transition-all
                                    duration-300

                                    ${collapsed
                                    ? "w-0 opacity-0"
                                    : "w-auto opacity-100"
                                }
                                `}
                            >

                                <p className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-white/90
                                ">
                                    {user?.username ||
                                        "User"}
                                </p>

                                <p className="
                                    mt-0.5
                                    text-[11px]
                                    font-medium
                                    text-white/40
                                ">
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