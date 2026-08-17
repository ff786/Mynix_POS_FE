import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function MainLayout() {
    const location = useLocation();

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    /*
     * Restore desktop sidebar preference
     */
    useEffect(() => {
        const saved =
            localStorage.getItem(
                "mynix-sidebar-collapsed"
            );

        if (saved === "true") {
            setSidebarCollapsed(true);
        }
    }, []);

    /*
     * Save desktop sidebar preference
     */
    useEffect(() => {
        localStorage.setItem(
            "mynix-sidebar-collapsed",
            String(sidebarCollapsed)
        );
    }, [sidebarCollapsed]);

    /*
     * Close mobile sidebar after navigation
     */
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    /*
     * Escape closes mobile sidebar
     */
    useEffect(() => {

        function handleKeyDown(event) {

            if (event.key === "Escape") {
                setIsSidebarOpen(false);
            }

        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, []);

    return (
        <div className="
            flex
            h-[100dvh]
            min-h-0
            w-full
            overflow-hidden
            bg-slate-50
        ">

            {/* =========================
                SIDEBAR
            ========================== */}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() =>
                    setIsSidebarOpen(false)
                }
                collapsed={sidebarCollapsed}
                onToggleCollapse={() =>
                    setSidebarCollapsed(
                        previous => !previous
                    )
                }
            />

            {/* =========================
                APPLICATION AREA
            ========================== */}

            <div className="
                flex
                min-h-0
                min-w-0
                flex-1
                flex-col
                overflow-hidden
            ">

                {/* TOPBAR */}

                <Topbar
                    onMenuClick={() =>
                        setIsSidebarOpen(true)
                    }
                    sidebarCollapsed={
                        sidebarCollapsed
                    }
                />

                {/* =========================
                    PAGE CONTENT
                ========================== */}

                <main className="
                    min-h-0
                    min-w-0
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    overscroll-contain
                    bg-slate-50
                    p-3
                    sm:p-4
                    md:p-5
                    lg:p-6
                    xl:p-8
                ">

                    <div className="
                        mx-auto
                        min-h-full
                        w-full
                        max-w-[1800px]
                    ">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>
    );
}

export default MainLayout;