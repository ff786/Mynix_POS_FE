import {
    Eye,
    ReceiptText,
    CreditCard,
    Banknote,
    WalletCards,
} from "lucide-react";

function SalesTable({
                        sales,
                        onView,
                    }) {
    if (sales.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-16 sm:py-20 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                    <ReceiptText size={28} className="text-slate-400" />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                    No sales found
                </h3>

                <p className="text-sm text-slate-400 mt-1.5">
                    Try changing your search criteria.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* ============================ */}
            {/* DESKTOP                      */}
            {/* ============================ */}

            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Invoice
                            </th>

                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Date
                            </th>

                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Payment
                            </th>

                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total
                            </th>

                            <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Action
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {sales.map((sale) => (
                            <DesktopSaleRow
                                key={sale.invoiceNumber}
                                sale={sale}
                                onView={onView}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ============================ */}
            {/* MOBILE                       */}
            {/* ============================ */}

            <div className="md:hidden space-y-3">
                {sales.map((sale) => (
                    <MobileSaleCard
                        key={sale.invoiceNumber}
                        sale={sale}
                        onView={onView}
                    />
                ))}
            </div>
        </div>
    );
}

/* ================================= */
/* DESKTOP ROW                       */
/* ================================= */

function DesktopSaleRow({
                            sale,
                            onView,
                        }) {
    return (
        <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition">
            {/* Invoice */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <ReceiptText size={17} className="text-emerald-600" />
                    </div>

                    <div>
                        <p className="font-semibold text-slate-900 font-mono text-sm">
                            {sale.invoiceNumber}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                            Transaction
                        </p>
                    </div>
                </div>
            </td>

            {/* Date */}
            <td className="px-6 py-5 text-sm text-slate-600">
                <div>
                    <p>{formatDate(sale.createdAt)}</p>

                    <p className="text-xs text-slate-400 mt-1">
                        {formatTime(sale.createdAt)}
                    </p>
                </div>
            </td>

            {/* Payment */}
            <td className="px-6 py-5">
                <PaymentBadge method={sale.paymentMethod} />
            </td>

            {/* Total */}
            <td className="px-6 py-5">
                <span className="font-bold text-slate-900">
                    Rs.{" "}
                    {Number(sale.grandTotal).toLocaleString()}
                </span>
            </td>

            {/* Action */}
            <td className="px-6 py-5">
                <div className="flex justify-end">
                    <ViewButton onClick={() => onView(sale)} />
                </div>
            </td>
        </tr>
    );
}

function MobileSaleCard({ sale, onView }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                        <ReceiptText
                            size={17}
                            className="text-emerald-600"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-semibold font-mono text-sm text-slate-900">
                            {sale.invoiceNumber}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                            {sale.customerName || "Walk-in Customer"}
                        </p>
                    </div>
                </div>

                <PaymentBadge method={sale.paymentMethod} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div>
                    <p className="text-xs text-slate-400">
                        Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                        {formatDate(sale.createdAt)}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-slate-400">
                        Total
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                        Rs.{" "}
                        {Number(sale.grandTotal || 0).toLocaleString()}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={() => onView(sale)}
                className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200"
            >
                <Eye size={16} />
                View Invoice
            </button>
        </div>
    );
}

function PaymentBadge({
                          method,
                      }) {
    const normalized = method?.toUpperCase();

    let Icon = WalletCards;

    if (normalized === "CASH") {
        Icon = Banknote;
    }

    if (
        normalized === "CARD" ||
        normalized === "CREDIT_CARD"
    ) {
        Icon = CreditCard;
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold whitespace-nowrap">
            <Icon size={13} />
            {method}
        </span>
    );
}

/* ================================= */
/* VIEW BUTTON                       */
/* ================================= */

function ViewButton({
                        onClick,
                    }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center gap-2 min-h-10 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 text-sm font-semibold transition"
        >
            <Eye size={16} />
            View
        </button>
    );
}

/* ================================= */
/* DATE HELPERS                      */
/* ================================= */

function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}

function formatTime(value) {
    if (!value) {
        return "";
    }

    return new Date(value).toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

export default SalesTable;