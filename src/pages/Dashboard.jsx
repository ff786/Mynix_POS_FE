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
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    if (loading || !dashboard) {
        return (
            <div className="flex items-center justify-center h-full">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div>
            <DashboardHeader />
            <div className="grid grid-cols-4 gap-6">
                <StatCard
                    title="Today's Sales"
                    value={`Rs. ${dashboard.salesToday}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Orders Today"
                    value={dashboard.ordersToday}
                    icon={ShoppingCart}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Products"
                    value={dashboard.totalProducts}
                    icon={Package}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Low Stock"
                    value={dashboard.lowStockProducts}
                    icon={TriangleAlert}
                    color="bg-red-500"
                />
            </div>
        </div>
    );
}

export default Dashboard;