import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Users,
    UserCheck,
    Wallet,
} from "lucide-react";
import { toast } from "sonner";

import CustomerTable from "@/components/customers/CustomerTable";
import CustomerModal from "@/components/customers/CustomerModal";

import {
    getCustomers,
    searchCustomers,
    deactivateCustomer,
} from "@/services/customerApi";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const loadCustomers = async () => {

        try {

            setLoading(true);

            const data = query.trim()
                ? await searchCustomers(query.trim())
                : await getCustomers();

            setCustomers(data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load customers."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        const timer = setTimeout(() => {
            loadCustomers();
        }, 250);

        return () => clearTimeout(timer);

    }, [query]);

    const statistics = useMemo(() => {

        const active = customers.filter(
            customer => customer.active
        );

        const outstanding = customers.reduce(
            (sum, customer) =>
                sum + Number(customer.outstanding || 0),
            0
        );

        return {
            total: customers.length,
            active: active.length,
            outstanding,
        };

    }, [customers]);

    const handleSaved = () => {
        loadCustomers();
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        setModalOpen(true);
    };

    const handleDeactivate = async (customer) => {

        const confirmed = window.confirm(
            `Deactivate ${customer.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deactivateCustomer(customer.id);

            toast.success("Customer deactivated.");

            loadCustomers();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to deactivate customer."
            );
        }
    };

    return (
        <div className="space-y-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Customers
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage customers, balances and payment history.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                    <Plus size={17} />
                    Add Customer
                </button>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Customers
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {statistics.total}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                            <Users size={20} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Active
                            </p>

                            <p className="mt-2 text-2xl font-bold text-emerald-600">
                                {statistics.active}
                            </p>
                        </div>

                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                            <UserCheck size={20} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Outstanding
                            </p>

                            <p className="mt-2 text-2xl font-bold text-amber-600">
                                Rs.{" "}
                                {statistics.outstanding.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                            <Wallet size={20} />
                        </div>

                    </div>

                </div>

            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">

                <div className="relative max-w-md">

                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by name or contact number..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />

                </div>

            </div>

            {loading ? (

                <div className="rounded-2xl border bg-white py-16 text-center text-sm text-slate-400">
                    Loading customers...
                </div>

            ) : (

                <CustomerTable
                    customers={customers}
                    onEdit={handleEdit}
                    onDeactivate={handleDeactivate}
                />

            )}

            <CustomerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                customer={editingCustomer}
                onSaved={handleSaved}
            />

        </div>
    );
}

export default Customers;
