import {
    ReceiptText,
    Tag,
    Truck,
} from "lucide-react";

function CartSummary({cart, discount, setDiscount, deliveryFee, setDeliveryFee,}) {

    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity || 0) *
            Number(item.sellingPrice || 0),
        0
    );

    const deliveryAmount = Math.max(
        Number(deliveryFee) || 0,
        0
    );

    const safeDiscount = Math.min(
        Math.max(Number(discount) || 0, 0),
        subtotal
    );

    const total =
        subtotal -
        safeDiscount +
        deliveryAmount;

    function formatMoney(value) {
        return Number(value || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    }

    function handleDiscountChange(e) {
        const value = Number(e.target.value) || 0;

        setDiscount(
            Math.min(
                Math.max(value, 0),
                subtotal
            )
        );
    }

    function handleDeliveryChange(e) {
        const value = Number(e.target.value) || 0;

        setDeliveryFee(Math.max(value, 0));
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            {/* Header */}

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                        <ReceiptText size={19} className="text-emerald-600" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Order Summary
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                            {cart.length} {cart.length === 1 ? "product" : "products"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary */}

            <div className="mt-5 space-y-4">
                {/* Subtotal */}

                <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500">
                        Subtotal
                    </span>

                    <span className="font-semibold text-slate-800">
                        Rs. {formatMoney(subtotal)}
                    </span>
                </div>

                {/* Discount */}

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <Tag size={16} className="shrink-0 text-slate-400" />

                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    Discount
                                </p>

                                <p className="hidden text-[11px] text-slate-400 sm:block">
                                    Applied to subtotal
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-500">
                                Rs.
                            </span>

                            <input
                                type="text"
                                inputMode="decimal"
                                min="0"
                                max={subtotal}
                                value={discount}
                                onChange={handleDiscountChange}
                                disabled={cart.length === 0}
                                className="h-10 w-24 rounded-lg border border-slate-200 bg-white px-3 text-right text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-28"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery */}

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <Truck size={16} className="shrink-0 text-slate-400" />

                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    Delivery Fee
                                </p>

                                <p className="hidden text-[11px] text-slate-400 sm:block">
                                    Added to total
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-500">
                                Rs.
                            </span>

                            <input
                                type="text"
                                inputMode="decimal"
                                min="0"
                                value={deliveryFee}
                                onChange={handleDeliveryChange}
                                disabled={cart.length === 0}
                                placeholder="0.00"
                                className="h-10 w-24 rounded-lg border border-slate-200 bg-white px-3 text-right text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-28"
                            />
                        </div>
                    </div>
                </div>

                {/* Calculation */}

                <div className="border-t border-slate-100 pt-4">
                    <div className="space-y-2 text-sm">
                        {safeDiscount > 0 && (
                            <div className="flex justify-between gap-3 text-slate-500">
                                <span>
                                    Discount
                                </span>

                                <span className="font-medium text-red-500">
                                    - Rs. {formatMoney(safeDiscount)}
                                </span>
                            </div>
                        )}

                        {deliveryAmount > 0 && (
                            <div className="flex justify-between gap-3 text-slate-500">
                                <span>
                                    Delivery
                                </span>

                                <span className="font-medium text-slate-700">
                                    + Rs. {formatMoney(deliveryAmount)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grand total */}

                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Total Payable
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Final amount
                            </p>
                        </div>

                        <p className="text-xl font-bold tracking-tight sm:text-2xl">
                            Rs. {formatMoney(total)}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CartSummary;