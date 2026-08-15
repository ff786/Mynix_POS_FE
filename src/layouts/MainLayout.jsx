import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function MainLayout() {
    const location = useLocation();

    /* Sidebar states */
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    /* Load desktop sidebar preference */
    useEffect(() => {
        const saved = localStorage.getItem("mynix-sidebar-collapsed");

        if (saved === "true") {
            setSidebarCollapsed(true);
        }
    }, []);

    /* Save sidebar preference */
    useEffect(() => {
        localStorage.setItem(
            "mynix-sidebar-collapsed",
            String(sidebarCollapsed)
        );
    }, [sidebarCollapsed]);

    /* Route change */
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    /* Escape key */
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setIsSidebarOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="min-h-[100dvh] bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(previous => !previous)}
            />

            {/* Main area */}
            <div className="flex flex-col flex-1 min-w-0 min-h-[100dvh]">
                <Topbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    sidebarCollapsed={sidebarCollapsed}
                />

                {/* Content */}
                <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                    <div className="w-full max-w-[1800px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;