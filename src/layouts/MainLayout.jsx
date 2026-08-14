import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function MainLayout() {

    return (

        <div className="flex h-screen bg-slate-50">

            <Sidebar />

            <div className="flex-1 min-w-0 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>

    );

}
export default MainLayout;