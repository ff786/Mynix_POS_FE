import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import CustomerHeader from "@/components/customers/details/CustomerHeader";
import CustomerFinancialSummary from "@/components/customers/details/CustomerFinancialSummary";
import CustomerLedger from "@/components/customers/details/CustomerLedger";
import CustomerModal from "@/components/customers/CustomerModal";

import {
    getCustomer,
    getCustomerTransactions,
} from "@/services/customerApi";

function CustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    // Load customer and transactions
    const loadData = async () => {
        try {
            setLoading(true);

            const [customerData, transactionData] = await Promise.all([
                getCustomer(id),
                getCustomerTransactions(id),
            ]);

            setCustomer(customerData);
            setTransactions(
                Array.isArray(transactionData)
                    ? transactionData
                    : []
            );
        } catch (error) {
            console.error("Customer details error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load customer."
            );
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadData();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="rounded-2xl border bg-white py-20 text-center text-sm text-slate-400">
                Loading customer...
            </div>
        );
    }

    // Customer not found
    if (!customer) {
        return (
            <div className="rounded-2xl border bg-white py-20 text-center">
                <p className="text-slate-500">
                    Customer not found.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/customers")}
                    className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                >
                    Back to Customers
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Customer header */}
            <CustomerHeader
                customer={customer}
                onBack={() => navigate("/customers")}
                onEdit={() => setEditOpen(true)}
            />

            {/* Financial summary */}
            <CustomerFinancialSummary
                customer={customer}
                transactions={transactions}
            />

            {/* Customer ledger */}
            <CustomerLedger
                customerId={customer.id}
                customer={customer}
                onCustomerUpdated={loadData}
            />

            {/* Edit customer */}
            <CustomerModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                customer={customer}
                onSaved={async () => {
                    setEditOpen(false);
                    await loadData();
                }}
            />
        </div>
    );
}

export default CustomerDetails;