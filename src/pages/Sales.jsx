import { useCallback, useEffect, useMemo, useState } from "react";
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
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedSale, setSelectedSale] = useState(null);
    const [receiptOpen, setReceiptOpen] = useState(false);

    const loadSales = useCallback(async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getSales();

            setSales(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load sales:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load sales history."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadSales();
    }, [loadSales]);

    async function handleViewSale(sale) {
        try {
            const data = await getSale(sale.invoiceNumber);

            setSelectedSale(data);
            setReceiptOpen(true);
        } catch (error) {
            console.error(
                "Failed to load sale details:",
                error
            );

            toast.error(
                error.response?.data?.message ||
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

            const customer =
                sale.customerName?.toLowerCase() || "";

            const customerId =
                String(sale.customerId ?? "").toLowerCase();

            return (
                invoice.includes(query) ||
                payment.includes(query) ||
                customer.includes(query) ||
                customerId.includes(query)
            );
        });
    }, [sales, search]);

    function clearSearch() {
        setSearch("");
    }

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-[1600px] space-y-5">
                <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />

                <div className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-5">
            <SalesToolbar
                search={search}
                setSearch={setSearch}
                onRefresh={() => loadSales(true)}
                refreshing={refreshing}
            />

            {/* Results header */}

            <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                        <ReceiptText
                            size={16}
                            className="text-emerald-600"
                        />
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-700">
                                {filteredSales.length}
                            </span>{" "}
                            {filteredSales.length === 1
                                ? "transaction"
                                : "transactions"}
                        </p>

                        {search && (
                            <p className="text-xs text-slate-400">
                                Matching "{search}"
                            </p>
                        )}
                    </div>
                </div>

                {search && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
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