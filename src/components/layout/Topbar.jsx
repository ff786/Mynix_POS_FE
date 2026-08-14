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
    const navigate = useNavigate()
    const currentPage = pageTitles[location.pathname] || 'Dashboard'

    const handleLogout = () => {
        // TODO: wire up to real auth logic (clear token/session)
        localStorage.removeItem('token')
        navigate('/login')
    }

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
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <Bell size={20} />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                        A
                    </div>
                    <span className="text-sm font-medium text-slate-700">Admin</span>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Topbar