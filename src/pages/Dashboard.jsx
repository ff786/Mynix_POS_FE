import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { getDashboard } from "../services/dashboardApi";

import { ArrowUpRight, CalendarDays, CircleDollarSign, ClipboardList, Package, Plus, ShoppingCart, TriangleAlert, Users, Wallet } from "lucide-react";

function getLocalDateString(date = new Date()) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("en-LK");
}

function formatToday() {
    return new Intl.DateTimeFormat("en-LK", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
}

function Dashboard() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function loadDashboard(showRefresh = false) {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getDashboard();
            setDashboard(data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    function openTodaySales() {
        navigate(`/sales?date=${getLocalDateString()}`);
    }

    function openLowStock() {
        navigate("/products?stock=low");
    }

    const inventoryHealth = useMemo(() => {
        if (!dashboard) return 0;

        const total = Number(dashboard.totalProducts) || 0;
        const low = Number(dashboard.lowStockProducts) || 0;

        if (total === 0) return 100;

        return Math.max(0, Math.min(100, Math.round(((total - low) / total) * 100)));
    }, [dashboard]);

    if (loading) {
        return (
            <div className="space-y-6 md:space-y-8">
                <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-4 h-8 w-64 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map(item => (
                        <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="h-3 w-24 rounded bg-slate-200" />
                                    <div className="mt-4 h-8 w-32 rounded bg-slate-200" />
                                </div>
                                <div className="h-11 w-11 rounded-xl bg-slate-200" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white xl:col-span-2" />
                    <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                        <TriangleAlert size={24} className="text-red-500" />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-slate-900">Dashboard unavailable</h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        We couldn't load the latest business information.
                    </p>

                    <button type="button" onClick={() => loadDashboard()} className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50 to-transparent" />

                <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                                <CalendarDays size={15} className="text-emerald-600" />
                            </div>

                            <p className="text-xs font-semibold text-slate-400">{formatToday()}</p>
                        </div>

                        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                            Business Overview
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Here's what's happening across your MYNIX business today.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button type="button" onClick={() => navigate("/pos")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]">
                            <Plus size={17} />
                            New Sale
                        </button>

                        <button type="button" onClick={() => loadDashboard(true)} disabled={refreshing} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
                            {refreshing ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Today's snapshot</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Today's Sales" value={`Rs. ${formatCurrency(dashboard.salesToday)}`} icon={CircleDollarSign} color="bg-emerald-500" onClick={openTodaySales} />
                    <StatCard title="Orders Today" value={formatNumber(dashboard.ordersToday)} icon={ShoppingCart} color="bg-blue-500" onClick={openTodaySales} />
                    <StatCard title="Total Products" value={formatNumber(dashboard.totalProducts)} icon={Package} color="bg-orange-500" onClick={() => navigate("/products")} />
                    <StatCard title="Low Stock" value={formatNumber(dashboard.lowStockProducts)} icon={TriangleAlert} color="bg-red-500" onClick={openLowStock} />
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Revenue overview</p>
                            <h2 className="mt-1 text-lg font-bold text-slate-900">Today's performance</h2>
                        </div>

                        <button type="button" onClick={openTodaySales} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition hover:text-emerald-700">
                            View sales
                            <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-8 p-5 sm:p-6 md:grid-cols-2">
                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium text-slate-400">Sales revenue</p>
                                    <p className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                        Rs. {formatCurrency(dashboard.salesToday)}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                                    <Wallet size={20} className="text-emerald-600" />
                                </div>
                            </div>

                            <div className="mt-7">
                                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                                    <span>Today's revenue</span>
                                    <span>Active</span>
                                </div>

                                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                                </div>
                            </div>
                        </div>

                        <div className="md:border-l md:border-slate-100 md:pl-8">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium text-slate-400">Orders processed</p>
                                    <p className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                        {formatNumber(dashboard.ordersToday)}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                                    <ClipboardList size={20} className="text-blue-600" />
                                </div>
                            </div>

                            <div className="mt-7 rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold text-slate-500">Average order value</p>

                                <p className="mt-1 text-lg font-black text-slate-900">
                                    Rs. {formatCurrency(Number(dashboard.ordersToday) > 0 ? Number(dashboard.salesToday) / Number(dashboard.ordersToday) : 0)}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-400">Based on today's recorded sales</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Inventory</p>
                            <h2 className="mt-1 text-lg font-bold text-slate-900">Stock health</h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                            <Package size={18} className="text-orange-500" />
                        </div>
                    </div>

                    <div className="mt-7 flex items-center justify-center">
                        <div
                            className="relative flex h-36 w-36 items-center justify-center rounded-full"
                            style={{ background: `conic-gradient(#10b981 ${inventoryHealth}%, #f1f5f9 ${inventoryHealth}%)` }}
                        >
                            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                                <p className="text-2xl font-black tracking-tight text-slate-900">{inventoryHealth}%</p>
                                <p className="text-[10px] font-semibold text-slate-400">healthy</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 space-y-3">
                        <InventoryRow label="Total products" value={formatNumber(dashboard.totalProducts)} />
                        <InventoryRow label="Low stock" value={formatNumber(dashboard.lowStockProducts)} danger />
                    </div>

                    <button type="button" onClick={openLowStock} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                        Review inventory
                        <ArrowUpRight size={15} />
                    </button>
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Quick actions</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <QuickAction icon={ShoppingCart} title="New Sale" description="Start checkout" onClick={() => navigate("/pos")} />
                    <QuickAction icon={Package} title="Products" description="Manage inventory" onClick={() => navigate("/products")} />
                    <QuickAction icon={Users} title="Customers" description="View customers" onClick={() => navigate("/customers")} />
                    <QuickAction icon={ClipboardList} title="Sales" description="View transactions" onClick={openTodaySales} />
                </div>
            </section>
        </div>
    );
}

function InventoryRow({ label, value, danger = false }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${danger ? "bg-red-500" : "bg-emerald-500"}`} />
                <span className="text-xs font-medium text-slate-500">{label}</span>
            </div>

            <span className="text-sm font-bold text-slate-900">{value}</span>
        </div>
    );
}

function QuickAction({ icon: Icon, title, description, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex min-w-0 flex-col items-start rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md active:scale-[0.99] sm:p-5"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
                <Icon size={18} />
            </div>

            <p className="mt-4 truncate text-sm font-bold text-slate-900">{title}</p>
            <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">{description}</p>
        </button>
    );
}

export default Dashboard;