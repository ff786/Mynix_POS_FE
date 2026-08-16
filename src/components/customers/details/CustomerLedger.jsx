import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    Landmark,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
    getCustomerTransactions,
    getCustomerCheques,
    updateChequeStatus,
} from "@/services/customerApi";

function CustomerLedger({
    customerId,
    onCustomerUpdated,
}) {

    const [transactions, setTransactions] = useState([]);
    const [cheques, setCheques] = useState([]);

    const [loading, setLoading] = useState(true);
    const [updatingCheque, setUpdatingCheque] = useState(null);

    async function loadLedger() {

        if (!customerId) return;

        try {

            setLoading(true);

            const [
                transactionData,
                chequeData,
            ] = await Promise.all([
                getCustomerTransactions(customerId),
                getCustomerCheques(customerId),
            ]);

            setTransactions(
                Array.isArray(transactionData)
                    ? transactionData
                    : []
            );

            setCheques(
                Array.isArray(chequeData)
                    ? chequeData
                    : []
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Failed to load customer ledger."
            );

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadLedger();
    }, [customerId]);

    /*
     * Once a cheque becomes CREDITED, the backend creates
     * a CHEQUE_PAYMENT customer transaction.
     *
     * We don't display that transaction separately because
     * the cheque itself is already displayed below.
     *
     * This prevents:
     *
     * CHEQUE #10001
     * CHEQUE_PAYMENT
     *
     * appearing as two transactions.
     */
    const normalTransactions = useMemo(() => {

        return transactions.filter(
            transaction =>
                transaction.type !== "CHEQUE_PAYMENT"
        );

    }, [transactions]);

    /*
     * Merge normal customer transactions + cheque records
     * into one chronological ledger.
     */
    const ledger = useMemo(() => {

        const normal = normalTransactions.map(
            transaction => ({
                ...transaction,
                ledgerType: "TRANSACTION",
                ledgerDate:
                transaction.createdAt,
            })
        );

        const chequeRows = cheques.map(
            cheque => ({
                ...cheque,
                ledgerType: "CHEQUE",
                ledgerDate:
                    cheque.receivedDate ??
                    cheque.chequeDate,
            })
        );

        return [
            ...normal,
            ...chequeRows,
        ].sort(
            (a, b) =>
                new Date(b.ledgerDate) -
                new Date(a.ledgerDate)
        );

    }, [
        normalTransactions,
        cheques,
    ]);

    async function handleChequeStatus(
        cheque,
        newStatus
    ) {

        try {

            setUpdatingCheque(cheque.id);

            const options = {};

            if (newStatus === "BOUNCED") {

                const reason =
                    window.prompt(
                        "Why was this cheque bounced?"
                    );

                if (!reason?.trim()) {
                    return;
                }

                options.bounceReason =
                    reason.trim();
            }

            await updateChequeStatus(
                cheque.id,
                newStatus,
                options
            );

            toast.success(
                `Cheque marked as ${newStatus.toLowerCase()}.`
            );

            /*
             * Reload BOTH.
             *
             * Important:
             * CREDITED creates CHEQUE_PAYMENT
             * on the backend, so the customer
             * outstanding can change.
             */
            await loadLedger();

            if (onCustomerUpdated) {
                await onCustomerUpdated();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to update cheque status."
            );

        } finally {

            setUpdatingCheque(null);

        }
    }

    function formatMoney(amount) {

        return Number(amount || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    }

    function formatDate(value) {

        if (!value) return "-";

        return new Date(value).toLocaleDateString(
            undefined,
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    function getStatusClass(status) {

        switch (status) {

            case "CREDITED":
                return "bg-emerald-50 text-emerald-700";

            case "BOUNCED":
                return "bg-red-50 text-red-700";

            case "DEPOSITED":
                return "bg-blue-50 text-blue-700";

            default:
                return "bg-amber-50 text-amber-700";
        }
    }

    if (loading) {

        return (
            <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-400">
                Loading customer ledger...
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b px-5 py-5">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            Customer Transactions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Sales, payments and cheque activity
                        </p>

                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Landmark
                            size={18}
                            className="text-slate-600"
                        />
                    </div>

                </div>

            </div>

            {/* LEDGER */}

            {ledger.length === 0 ? (

                <div className="px-5 py-12 text-center">

                    <p className="text-sm text-slate-400">
                        No transactions found.
                    </p>

                </div>

            ) : (

                <div className="divide-y">

                    {ledger.map((entry) => {

                        /* =========================
                           CHEQUE
                           ========================= */

                        if (
                            entry.ledgerType ===
                            "CHEQUE"
                        ) {

                            const cheque =
                                entry;

                            const updating =
                                updatingCheque ===
                                cheque.id;

                            return (
                                <div
                                    key={`cheque-${cheque.id}`}
                                    className="px-5 py-5"
                                >

                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                        <div className="min-w-0">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                                                    <Landmark
                                                        size={17}
                                                        className="text-amber-600"
                                                    />
                                                </div>

                                                <div>

                                                    <p className="font-semibold text-slate-900">
                                                        Cheque Payment
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {cheque.chequeNumber}
                                                    </p>

                                                </div>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                                        cheque.status
                                                    )}`}
                                                >

                                                    {cheque.status}

                                                </span>

                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

                                                <span>
                                                    Amount:{" "}
                                                    <strong className="text-slate-700">
                                                        Rs.{" "}
                                                        {formatMoney(
                                                            cheque.amount
                                                        )}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Cheque Date:{" "}
                                                    {formatDate(
                                                        cheque.chequeDate
                                                    )}
                                                </span>

                                                <span>
                                                    Received:{" "}
                                                    {formatDate(
                                                        cheque.receivedDate
                                                    )}
                                                </span>

                                                {cheque.depositDate && (
                                                    <span>
                                                        Deposited:{" "}
                                                        {formatDate(
                                                            cheque.depositDate
                                                        )}
                                                    </span>
                                                )}

                                            </div>

                                            {cheque.bankName && (
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Bank:{" "}
                                                    {cheque.bankName}
                                                </p>
                                            )}

                                            {cheque.status ===
                                                "BOUNCED" &&
                                                cheque.bounceReason && (
                                                    <p className="mt-2 text-xs font-medium text-red-600">
                                                        Bounce reason:{" "}
                                                        {
                                                            cheque.bounceReason
                                                        }
                                                    </p>
                                                )}

                                        </div>

                                        {/* ACTIONS */}

                                        <div className="flex shrink-0 flex-wrap gap-2">

                                            {cheque.status ===
                                                "RECEIVED" && (

                                                    <button
                                                        type="button"
                                                        disabled={updating}
                                                        onClick={() =>
                                                            handleChequeStatus(
                                                                cheque,
                                                                "DEPOSITED"
                                                            )
                                                        }
                                                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                    <span className="flex items-center gap-1.5">
                                                        <Landmark
                                                            size={14}
                                                        />
                                                        Mark Deposited
                                                    </span>
                                                    </button>
                                                )}

                                            {cheque.status ===
                                                "DEPOSITED" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={updating}
                                                            onClick={() =>
                                                                handleChequeStatus(
                                                                    cheque,
                                                                    "CREDITED"
                                                                )
                                                            }
                                                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                        <span className="flex items-center gap-1.5">
                                                            <CheckCircle2
                                                                size={14}
                                                            />
                                                            Mark Credited
                                                        </span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={updating}
                                                            onClick={() =>
                                                                handleChequeStatus(
                                                                    cheque,
                                                                    "BOUNCED"
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                        <span className="flex items-center gap-1.5">
                                                            <AlertCircle
                                                                size={14}
                                                            />
                                                            Mark Bounced
                                                        </span>
                                                        </button>
                                                    </>
                                                )}

                                        </div>

                                    </div>

                                </div>
                            );
                        }

                        /* =========================
                           NORMAL TRANSACTION
                           ========================= */

                        const isCreditSale =
                            entry.type ===
                            "CREDIT_SALE";

                        return (
                            <div
                                key={`transaction-${entry.id}`}
                                className="px-5 py-5"
                            >

                                <div className="flex items-center justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={
                                                isCreditSale
                                                    ? "flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50"
                                                    : "flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50"
                                            }
                                        >

                                            {isCreditSale ? (
                                                <ArrowUpRight
                                                    size={17}
                                                    className="text-amber-600"
                                                />
                                            ) : (
                                                <ArrowDownLeft
                                                    size={17}
                                                    className="text-emerald-600"
                                                />
                                            )}

                                        </div>

                                        <div>

                                            <p className="font-semibold text-slate-900">
                                                {isCreditSale
                                                    ? "Credit Sale"
                                                    : "Payment"}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {entry.description ||
                                                    "-"}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p
                                            className={
                                                isCreditSale
                                                    ? "font-semibold text-amber-600"
                                                    : "font-semibold text-emerald-600"
                                            }
                                        >
                                            {isCreditSale
                                                ? "+"
                                                : "-"}
                                            Rs.{" "}
                                            {formatMoney(
                                                entry.amount
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {formatDate(
                                                entry.createdAt
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default CustomerLedger;