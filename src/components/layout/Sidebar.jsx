import { useNavigate } from 'react-router-dom'
import {LogOut,} from 'lucide-react'
import NavItem from '../common/NavItem'
import { navigation } from "../../config/navigation";


function Sidebar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        // TODO: wire up to real auth logic (clear token/session)
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <aside className="w-[280px] shrink-0 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="px-6 py-6 border-b">
                <h1 className="text-2xl font-bold text-emerald-600">
                    MYNIX
                </h1>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    POS SYSTEM
                </p>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map(item => (
                    <NavItem
                        key={item.path}
                        to={item.path}
                        icon={item.icon}
                        label={item.label}
                    />
                ))}
            </nav>

            {/* Logout pinned to bottom */}
            <div className="px-4 py-4 border-t border-gray-100">
                <NavItem icon={LogOut} label="Logout" variant="button" onClick={handleLogout} />
            </div>
        </aside>
    )
}

export default Sidebar