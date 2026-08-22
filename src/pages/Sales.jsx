import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ReceiptText,
    X,
} from "lucide-react";

import {
    useSearchParams,
} from "react-router-dom";

import { toast } from "sonner";

import SalesToolbar from "../components/sales/SalesToolbar";
import SalesTable from "../components/sales/SalesTable";

import ReceiptModal from "@/components/receipt/ReceiptModal";

import {
    getSales,
    getSale,
} from "../services/salesApi";

function getLocalDateString(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function getTodayDateString() {
    return getLocalDateString(new Date());
}

function Sales() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const [selectedDate, setSelectedDate] = useState(
        () => searchParams.get("date") || ""
    );

    const [selectedSale, setSelectedSale] = useState(null);
    const [receiptOpen, setReceiptOpen] = useState(false);

    /*
     * Keep the date filter synchronized with
     * the URL so dashboard navigation and
     * manual filtering behave consistently.
     */

    useEffect(() => {
        const urlDate = searchParams.get("date") || "";
        setSelectedDate(urlDate);
    }, [searchParams]);

    const loadSales = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const data = await getSales();

                setSales(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load sales:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load sales history."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadSales();
    }, [loadSales]);

    async function handleViewSale(sale) {
        try {
            const data = await getSale(
                sale.invoiceNumber
            );

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

    function handleDateChange(value) {
        setSelectedDate(value);

        const nextParams = new URLSearchParams(
            searchParams
        );

        if (value) {
            nextParams.set("date", value);
        } else {
            nextParams.delete("date");
        }

        setSearchParams(nextParams, {
            replace: true,
        });
    }

    const filteredSales = useMemo(() => {
        const query = search.trim().toLowerCase();

        return sales.filter((sale) => {
            const invoice =
                sale.invoiceNumber?.toLowerCase() || "";

            const payment =
                sale.paymentMethod?.toLowerCase() || "";

            const customer =
                sale.customerName?.toLowerCase() || "";

            const customerId = String(
                sale.customerId ?? ""
            ).toLowerCase();

            const matchesSearch =
                !query ||
                invoice.includes(query) ||
                payment.includes(query) ||
                customer.includes(query) ||
                customerId.includes(query);

            if (!matchesSearch) {
                return false;
            }

            /*
             * DATE FILTER
             *
             * Compare local calendar dates
             * so timezone conversion does not
             * shift a late-night sale onto the
             * wrong day.
             */

            if (selectedDate) {
                return (
                    getLocalDateString(
                        sale.createdAt
                    ) === selectedDate
                );
            }

            return true;
        });
    }, [sales, search, selectedDate]);

    function clearFilters() {
        setSearch("");
        setSelectedDate("");

        const nextParams = new URLSearchParams(
            searchParams
        );

        nextParams.delete("date");

        setSearchParams(nextParams, {
            replace: true,
        });
    }

    const hasFilters = Boolean(
        search.trim() || selectedDate
    );

    const showingToday =
        selectedDate === getTodayDateString();

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-[1600px] space-y-5">
                <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />

                <div className="h-[500px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-5">
            <SalesToolbar
                search={search}
                setSearch={setSearch}
                selectedDate={selectedDate}
                setSelectedDate={handleDateChange}
                onRefresh={() => loadSales(true)}
                refreshing={refreshing}
            />

            {/* RESULTS SUMMARY */}

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

                        {showingToday && (
                            <p className="text-xs font-medium text-emerald-600">
                                Today's sales
                            </p>
                        )}

                        {hasFilters &&
                            !showingToday && (
                                <p className="text-xs text-slate-400">
                                    Filtered results
                                </p>
                            )}
                    </div>
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                    >
                        Clear filters
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