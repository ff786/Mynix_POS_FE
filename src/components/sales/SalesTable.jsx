import {
    Eye,
    ReceiptText,
    CreditCard,
    Banknote,
    WalletCards,
} from "lucide-react";

function SalesTable({ sales, onView }) {
    if (sales.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:py-20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <ReceiptText size={28} className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-800 sm:text-lg">
                    No sales found
                </h3>

                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-5 text-slate-400">
                    Try changing your search or date filter.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                        <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Invoice
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Date
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Payment
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
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

            <div className="space-y-3 md:hidden">
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

function DesktopSaleRow({ sale, onView }) {
    return (
        <tr className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/70">
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                        <ReceiptText size={17} className="text-emerald-600" />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-mono text-sm font-semibold text-slate-900">
                            {sale.invoiceNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            {sale.customerName || "Walk-in Customer"}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-6 py-5 text-sm text-slate-600">
                <p>{formatDate(sale.createdAt)}</p>

                <p className="mt-1 text-xs text-slate-400">
                    {formatTime(sale.createdAt)}
                </p>
            </td>

            <td className="px-6 py-5">
                <PaymentBadge method={sale.paymentMethod} />
            </td>

            <td className="px-6 py-5">
                <span className="font-bold text-slate-900">
                    Rs. {formatAmount(sale.grandTotal)}
                </span>
            </td>

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
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition active:scale-[0.995]">
            <div className="flex items-start justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                        <ReceiptText size={18} className="text-emerald-600" />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-mono text-sm font-bold text-slate-900">
                            {sale.invoiceNumber}
                        </p>

                        <p className="mt-1 truncate text-xs font-medium text-slate-400">
                            {sale.customerName || "Walk-in Customer"}
                        </p>
                    </div>
                </div>

                <PaymentBadge method={sale.paymentMethod} />
            </div>

            <div className="grid grid-cols-2 gap-3 border-y border-slate-100 bg-slate-50/60 px-4 py-3.5">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Date
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                        {formatDate(sale.createdAt)}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                        {formatTime(sale.createdAt)}
                    </p>
                </div>

                <div className="min-w-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total
                    </p>

                    <p className="mt-1 truncate text-lg font-black tracking-tight text-slate-900">
                        Rs. {formatAmount(sale.grandTotal)}
                    </p>
                </div>
            </div>

            <div className="p-3">
                <button
                    type="button"
                    onClick={() => onView(sale)}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 active:bg-emerald-200"
                >
                    <Eye size={16} />
                    View Invoice
                </button>
            </div>
        </article>
    );
}

function PaymentBadge({ method }) {
    const normalized = method?.toUpperCase();

    let Icon = WalletCards;

    if (normalized === "CASH") {
        Icon = Banknote;
    }

    if (normalized === "CARD" || normalized === "CREDIT_CARD") {
        Icon = CreditCard;
    }

    return (
        <span className="inline-flex max-w-[42vw] shrink-0 items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 sm:text-xs">
            <Icon size={12} className="shrink-0" />

            <span className="truncate">
                {formatPaymentMethod(method)}
            </span>
        </span>
    );
}

function ViewButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 active:bg-emerald-200"
        >
            <Eye size={16} />
            View
        </button>
    );
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
}

function formatAmount(value) {
    return Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatPaymentMethod(method) {
    const labels = {
        CASH: "Cash",
        CARD: "Card",
        BANK_DEPOSIT: "Bank Deposit",
        CREDIT: "Credit",
        CHEQUE: "Cheque",
    };

    return labels[method] || method || "Payment";
}

export default SalesTable;