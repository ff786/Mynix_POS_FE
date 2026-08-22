import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { getDashboard } from "../services/dashboardApi";

import {
    DollarSign,
    ShoppingCart,
    Package,
    TriangleAlert,
} from "lucide-react";


function getLocalDateString(date = new Date()) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}


function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {
        loadDashboard();
    }, []);


    async function loadDashboard() {

        try {

            const data =
                await getDashboard();

            setDashboard(data);

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );

        } finally {

            setLoading(false);

        }
    }


    function openTodaySales() {

        const today =
            getLocalDateString();

        navigate(
            `/sales?date=${today}`
        );
    }


    if (loading) {

        return (
            <div className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                xl:grid-cols-4
            ">

                {[1, 2, 3, 4].map(
                    (item) => (
                        <div
                            key={item}
                            className="
                                animate-pulse
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >
                            <div className="
                                mb-5
                                h-4
                                w-24
                                rounded
                                bg-slate-200
                            />

                            <div className="
                                 h-8
                                 w-32
                                 rounded
                                 bg-slate-200
                            />
                        </div>
                    )
                )}

            </div>
        );
    }


    if (!dashboard) {

        return (
            <div className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-10
                text-center
                shadow-sm
            ">

                <p className="
                    text-slate-500
                ">
                    Unable to load dashboard data.
                </p>


                <button
                    type="button"
                    onClick={loadDashboard}
                    className="
                        mt-4
                        rounded-xl
                        bg-emerald-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-emerald-700
                    "
                >
                    Try Again
                </button>

            </div>
        );
    }


    return (
        <div className="
            space-y-8
        ">

            <DashboardHeader />


            <div className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                xl:grid-cols-4
            ">

                {/* TODAY'S SALES */}

                <StatCard
                    title="Today's Sales"
                    value={`Rs. ${Number(
                        dashboard.salesToday
                    ).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    onClick={openTodaySales}
                />


                {/* ORDERS TODAY */}

                <StatCard
                    title="Orders Today"
                    value={Number(
                        dashboard.ordersToday
                    ).toLocaleString()}
                    icon={ShoppingCart}
                    color="bg-blue-500"
                    onClick={openTodaySales}
                />


                {/* TOTAL PRODUCTS */}

                <StatCard
                    title="Total Products"
                    value={Number(
                        dashboard.totalProducts
                    ).toLocaleString()}
                    icon={Package}
                    color="bg-orange-500"
                    onClick={() =>
                        navigate("/products")
                    }
                />


                {/* LOW STOCK */}

                <StatCard
                    title="Low Stock"
                    value={Number(
                        dashboard.lowStockProducts
                    ).toLocaleString()}
                    icon={TriangleAlert}
                    color="bg-red-500"
                    onClick={() =>
                        navigate(
                            "/products?stock=low"
                        )
                    }
                />

            </div>

        </div>
    );
}


export default Dashboard;