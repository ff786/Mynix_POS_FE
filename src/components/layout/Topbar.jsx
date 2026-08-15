import { useLocation } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'

// Maps route paths to their display title for the "Current Page" label
const pageTitles = {
    '/dashboard': 'Dashboard',
    '/pos': 'New Sale',
    '/products': 'Products',
    '/categories': 'Categories',
    '/sales': 'Sales',
}

function Topbar({ onMenuClick }) {
    const location = useLocation()
    const currentPage = pageTitles[location.pathname] || 'Dashboard'

    return (
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between gap-4 px-4 md:px-8">
            {/* Left side */}
            <div className="flex items-center gap-3 min-w-0">
                {/* Hamburger — mobile only */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="md:hidden -ml-1 p-1 text-slate-500 hover:text-slate-900 transition"
                >
                    <Menu size={22} />
                </button>

                <div className="min-w-0">
                    <p className="text-xs text-slate-400 leading-none hidden sm:block">Current Page</p>
                    <h2 className="text-sm font-semibold text-slate-900 sm:mt-1 truncate">{currentPage}</h2>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-5 shrink-0">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative text-slate-500 hover:text-slate-900 transition"
                >
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="hidden sm:block h-6 w-px bg-slate-200" />

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
                        A
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-800">
                            Admin
                        </p>
                        <p className="text-xs text-slate-400">
                            Cashier
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Topbar