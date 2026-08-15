import { useEffect, useMemo, useState } from "react";
import { ReceiptText, X } from "lucide-react";
import { toast } from "sonner";

import SalesToolbar from "../components/sales/SalesToolbar";
import SalesTable from "../components/sales/SalesTable";

import ReceiptModal from "@/components/receipt/ReceiptModal";

import {
    getSales,
    getSale,
} from "../services/salesApi";

function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSale, setSelectedSale] = useState(null);
    const [receiptOpen, setReceiptOpen] = useState(false);

    useEffect(() => {
        loadSales();
    }, []);

    async function loadSales() {
        try {
            setLoading(true);

            const data = await getSales();

            setSales(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error("Failed to load sales:", error);

            toast.error(
                "Failed to load sales history."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleViewSale(sale) {
        try {
            const data = await getSale(
                sale.invoiceNumber
            );

            setSelectedSale(data);
            setReceiptOpen(true);
        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to load sale details."
            );
        }
    }

    const filteredSales = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return sales;
        }

        return sales.filter((sale) => {
            const invoice =
                sale.invoiceNumber?.toLowerCase() || "";

            const payment =
                sale.paymentMethod?.toLowerCase() || "";

            return (
                invoice.includes(query) ||
                payment.includes(query)
            );
        });
    }, [sales, search]);

    function clearSearch() {
        setSearch("");
    }

    if (loading) {
        return (
            <div className="w-full max-w-[1600px] mx-auto space-y-6">
                <div className="h-32 rounded-2xl border border-slate-200 bg-white animate-pulse" />

                <div className="h-[420px] rounded-2xl border border-slate-200 bg-white animate-pulse" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-5">
            <SalesToolbar
                search={search}
                setSearch={setSearch}
            />

            {/* Results summary */}
            <div className="flex items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <ReceiptText
                            size={16}
                            className="text-emerald-600"
                        />
                    </div>

                    <span>
                        <span className="font-semibold text-slate-700">
                            {filteredSales.length}
                        </span>{" "}

                        {filteredSales.length === 1
                            ? "transaction"
                            : "transactions"}
                    </span>
                </div>

                {search && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition"
                    >
                        Clear search
                        <X size={14} />
                    </button>
                )}
            </div>

            <SalesTable
                sales={filteredSales}
                onView={handleViewSale}
            />

            <ReceiptModal
                open={receiptOpen}
                onOpenChange={setReceiptOpen}
                sale={selectedSale}
            />
        </div>
    );
}

export default Sales;