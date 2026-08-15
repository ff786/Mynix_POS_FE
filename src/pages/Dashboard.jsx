import { useEffect, useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { getDashboard } from "../services/dashboardApi";

import {
    DollarSign,
    ShoppingCart,
    Package,
    TriangleAlert,
} from "lucide-react";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            const data = await getDashboard();

            setDashboard(data);

        } catch (error) {

            console.error("Failed to load dashboard:", error);

        } finally {

            setLoading(false);

        }
    }

    if (loading) {

        return (
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="bg-white border rounded-xl p-6 animate-pulse"
                    >
                        <div className="h-4 bg-slate-200 rounded w-24 mb-5" />
                        <div className="h-8 bg-slate-200 rounded w-32" />
                    </div>
                ))}
            </div>
        );
    }
    if (!dashboard) {
        return (
            <div className="bg-white border rounded-xl p-10 text-center">
                <p className="text-slate-500">
                    Unable to load dashboard data.
                </p>
                <button
                    onClick={loadDashboard}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (

        <div className="space-y-8">
            <DashboardHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Sales"
                    value={`Rs. ${Number(
                        dashboard.salesToday
                    ).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Orders Today"
                    value={Number(
                        dashboard.ordersToday
                    ).toLocaleString()}
                    icon={ShoppingCart}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Products"
                    value={Number(
                        dashboard.totalProducts
                    ).toLocaleString()}
                    icon={Package}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Low Stock"
                    value={Number(
                        dashboard.lowStockProducts
                    ).toLocaleString()}
                    icon={TriangleAlert}
                    color="bg-red-500"
                />
            </div>
        </div>
    );
}

export default Dashboard;