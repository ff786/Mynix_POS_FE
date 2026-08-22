import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function MainLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(() =>
            localStorage.getItem(
                "mynix-sidebar-collapsed"
            ) === "true"
        );

    /*useEffect(() => {
        const saved = localStorage.getItem("mynix-sidebar-collapsed");
        if (saved === "true") {
            setSidebarCollapsed(true);
        }
    }, []);*/

    useEffect(() => {
        localStorage.setItem("mynix-sidebar-collapsed", String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    /*useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);*/

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
        <div className="flex h-[100dvh] min-h-0 w-full overflow-hidden bg-slate-50">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(previous => !previous)}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Topbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    sidebarCollapsed={sidebarCollapsed}
                />

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-50 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                    <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col">
                        <div className="min-w-0 flex-1">
                            <Outlet />
                        </div>

                        <footer className="mt-8 border-t border-slate-200/80 pt-5 pb-2 text-center sm:mt-10 sm:pt-6">
                            <p className="text-[10px] font-medium leading-5 text-slate-400 sm:text-[11px]">
                                © 2026 MYNIX PVT (LTD)
                                <span className="mx-1.5 text-slate-300">·</span>
                                Crafted &amp; developed by
                                <span className="ml-1 font-semibold text-slate-500">
                                    FS Technologies
                                </span>
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;