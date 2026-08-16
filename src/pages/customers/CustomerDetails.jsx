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

    const loadData = async () => {

        try {

            setLoading(true);

            const [
                customerData,
                transactionData,
            ] = await Promise.all([
                getCustomer(id),
                getCustomerTransactions(id),
            ]);

            setCustomer(customerData);
            setTransactions(transactionData);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to load customer."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="rounded-2xl border bg-white py-20 text-center text-sm text-slate-400">
                Loading customer...
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="rounded-2xl border bg-white py-20 text-center">
                <p className="text-slate-500">
                    Customer not found.
                </p>

                <button
                    onClick={() => navigate("/customers")}
                    className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
                >
                    Back to Customers
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5">

            <CustomerHeader
                customer={customer}
                onBack={() => navigate("/customers")}
                onEdit={() => setEditOpen(true)}
            />

            <CustomerFinancialSummary
                customer={customer}
                transactions={transactions}
            />

            <CustomerLedger
                transactions={transactions}
            />

            <CustomerModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                customer={customer}
                onSaved={loadData}
            />

        </div>
    );
}

export default CustomerDetails;
