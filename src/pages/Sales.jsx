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
import EditSaleModal from "../components/sales/EditSaleModal";

import ReceiptModal from "@/components/receipt/ReceiptModal";

import DeleteSaleModal from "../components/sales/DeleteSaleModal";

import {
    getSales,
    getSale,
    updateSale,
    deleteSale,
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
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [selectedDate, setSelectedDate] =
        useState(
            () => searchParams.get("date") || ""
        );

    const [selectedSale, setSelectedSale] =
        useState(null);

    const [receiptOpen, setReceiptOpen] =
        useState(false);

    const [editSale, setEditSale] =
        useState(null);

    const [editOpen, setEditOpen] =
        useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const SALES_PER_PAGE = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedDate]);

    useEffect(() => {
        const urlDate =
            searchParams.get("date") || "";

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
                    ? [...data].sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    )
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

    /*
     * OPEN EDIT MODAL
     *
     * Important:
     * SalesTable passes the complete sale object.
     */
    async function handleEditSale(sale) {
        try {
            const data = await getSale(
                sale.invoiceNumber
            );

            setEditSale(data);
            setEditOpen(true);
        } catch (error) {
            console.error(
                "Failed to load sale for editing:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load sale for editing."
            );
        }
    }

    /*
     * UPDATE SALE
     */
    async function handleUpdateSale(
        invoiceNumber,
        data
    ) {
        try {
            const updatedSale =
                await updateSale(
                    invoiceNumber,
                    data
                );

            toast.success(
                "Sale updated successfully."
            );

            setSales((currentSales) =>
                [...currentSales]
                    .map((sale) =>
                        sale.invoiceNumber === invoiceNumber
                            ? {
                                ...sale,
                                ...updatedSale,
                            }
                            : sale
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    )
            );

            if (
                selectedSale?.invoiceNumber ===
                invoiceNumber
            ) {
                setSelectedSale(
                    (current) => ({
                        ...current,
                        ...updatedSale,
                    })
                );
            }

            setEditSale(null);
            setEditOpen(false);

            return updatedSale;
        } catch (error) {
            console.error(
                "Failed to update sale:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update sale."
            );

            throw error;
        }
    }

    /*
     * DELETE SALE
     */
    function handleDeleteSale(sale) {
        setSaleToDelete(sale);
        setDeleteModalOpen(true);
    }

    function handleCancelDelete() {
        if (deleting) {
            return;
        }

        setDeleteModalOpen(false);
        setSaleToDelete(null);
    }

    async function handleConfirmDelete() {
        if (!saleToDelete) {
            return;
        }

        try {
            setDeleting(true);

            await deleteSale(
                saleToDelete.invoiceNumber
            );

            setSales((currentSales) =>
                currentSales.filter(
                    (sale) =>
                        sale.invoiceNumber !==
                        saleToDelete.invoiceNumber
                )
            );

            toast.success(
                `Sale ${saleToDelete.invoiceNumber} deleted successfully.`
            );

            setDeleteModalOpen(false);
            setSaleToDelete(null);
        } catch (error) {
            console.error(
                "Failed to delete sale:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete sale."
            );
        } finally {
            setDeleting(false);
        }
    }

    function handleDateChange(value) {
        setSelectedDate(value);

        const nextParams =
            new URLSearchParams(
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
        const query =
            search.trim().toLowerCase();

        return sales.filter((sale) => {
            const invoice =
                sale.invoiceNumber?.toLowerCase() ||
                "";

            const payment =
                sale.paymentMethod?.toLowerCase() ||
                "";

            const customer =
                sale.customerName?.toLowerCase() ||
                "";

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

            if (selectedDate) {
                return (
                    getLocalDateString(
                        sale.createdAt
                    ) === selectedDate
                );
            }

            return true;
        });
    }, [
        sales,
        search,
        selectedDate,
    ]);

    const totalPages = Math.ceil(
        filteredSales.length / SALES_PER_PAGE
    );

    const paginatedSales = useMemo(() => {
        const startIndex =
            (currentPage - 1) * SALES_PER_PAGE;

        return filteredSales.slice(
            startIndex,
            startIndex + SALES_PER_PAGE
        );
    }, [filteredSales, currentPage]);

    function clearFilters() {
        setSearch("");
        setSelectedDate("");

        const nextParams =
            new URLSearchParams(
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
        selectedDate ===
        getTodayDateString();

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
                setSelectedDate={
                    handleDateChange
                }
                onRefresh={() =>
                    loadSales(true)
                }
                refreshing={refreshing}
            />

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
                                {
                                    filteredSales.length
                                }
                            </span>{" "}
                            {filteredSales.length ===
                            1
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
                        onClick={
                            clearFilters
                        }
                        className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                    >
                        Clear filters
                        <X size={14} />
                    </button>
                )}
            </div>

            <SalesTable
                sales={paginatedSales}
                onView={handleViewSale}
                onEdit={(sale) => {
                    handleEditSale(sale);
                }}
                onDelete={handleDeleteSale}
            />

            {totalPages > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                        Showing{" "}
                        <span className="font-semibold text-slate-600">
                {(currentPage - 1) * SALES_PER_PAGE + 1}
            </span>
                        {" – "}
                        <span className="font-semibold text-slate-600">
                {Math.min(
                    currentPage * SALES_PER_PAGE,
                    filteredSales.length
                )}
            </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-600">
                {filteredSales.length}
            </span>{" "}
                        sales
                    </p>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.max(page - 1, 1)
                                )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ←
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() =>
                                    setCurrentPage(page)
                                }
                                className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                                    currentPage === page
                                        ? "bg-emerald-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(
                                        page + 1,
                                        totalPages
                                    )
                                )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            →
                        </button>
                    </div>
                </div>
            )}

            <EditSaleModal
                open={editOpen}
                sale={editSale}
                onClose={() => {
                    setEditOpen(false);
                    setEditSale(null);
                }}
                onSave={handleUpdateSale}
            />

            <ReceiptModal
                open={receiptOpen}
                onOpenChange={
                    setReceiptOpen
                }
                sale={selectedSale}
                onUpdate={
                    handleUpdateSale
                }
                onDelete={
                    handleDeleteSale
                }
            />

            <DeleteSaleModal
                open={deleteModalOpen}
                sale={saleToDelete}
                deleting={deleting}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

export default Sales;