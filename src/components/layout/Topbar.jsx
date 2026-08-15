import { useLocation, useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'

// Maps route paths to their display title for the "Current Page" label
const pageTitles = {
    '/dashboard': 'Dashboard',
    '/pos': 'New Sale',
    '/products': 'Products',
    '/categories': 'Categories',
    '/sales': 'Sales',
}

function Topbar() {
    const location = useLocation()
    const currentPage = pageTitles[location.pathname] || 'Dashboard'

    return (
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            {/* Left side */}
            <div>
                <p className="text-xs text-slate-400 leading-none">Current Page</p>
                <h2 className="text-sm font-semibold text-slate-900 mt-1">{currentPage}</h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-5">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative text-slate-500 hover:text-slate-900 transition"
                >
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
                        A
                    </div>
                    <div>
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