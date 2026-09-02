import {
    AlertTriangle,
    Trash2,
    X,
} from "lucide-react";

function DeleteSaleModal({
                             open,
                             sale,
                             onCancel,
                             onConfirm,
                             deleting = false,
                         }) {
    if (!open || !sale) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* BACKDROP */}

            <button
                type="button"
                aria-label="Close delete confirmation"
                onClick={onCancel}
                disabled={deleting}
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />

            {/* MODAL */}

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* HEADER */}

                <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
                            <AlertTriangle
                                size={21}
                                className="text-red-600"
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                Delete Sale?
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* SALE DETAILS */}

                <div className="mx-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:mx-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Invoice
                            </p>

                            <p className="mt-1 truncate font-mono text-sm font-bold text-slate-900">
                                {sale.invoiceNumber}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Total
                            </p>

                            <p className="mt-1 text-sm font-black text-slate-900">
                                Rs.{" "}
                                {formatAmount(
                                    sale.grandTotal
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 border-t border-slate-200 pt-3">
                        <p className="text-xs text-slate-500">
                            {sale.customerName ||
                                "Walk-in Customer"}
                        </p>
                    </div>
                </div>

                {/* WARNING */}

                <div className="px-5 py-4 sm:px-6">
                    <p className="text-sm leading-5 text-slate-500">
                        Are you sure you want to permanently
                        delete this sale and its associated
                        transaction records?
                    </p>
                </div>

                {/* ACTIONS */}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Trash2 size={16} />

                        {deleting
                            ? "Deleting..."
                            : "Delete Sale"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function formatAmount(value) {
    return Number(value || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
}

export default DeleteSaleModal;