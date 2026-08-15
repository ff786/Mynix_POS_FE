function CartSummary({
                         cart,
                         discount,
                         setDiscount,
                         deliveryFee,
                         setDeliveryFee,
                     }) {

    const subtotal = cart.reduce(
        (sum, item) =>
            sum + item.quantity * Number(item.sellingPrice),
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
        subtotal - safeDiscount + deliveryAmount;

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

        setDeliveryFee(
            Math.max(value, 0)
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-lg">
                        Order Summary
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {cart.length} item{cart.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {/* SUBTOTAL */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                        Subtotal
                    </span>
                    <span className="font-medium">
                        Rs. {subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                    </span>
                </div>

                {/* DISCOUNT */}
                <div className="flex items-center justify-between gap-3">
                    <span>
                        Discount
                    </span>
                    <div className="flex items-center">
                        <span className="mr-2">
                            Rs.
                        </span>
                        <input
                            type="text"
                            inputMode="decimal"
                            min="0"
                            max={subtotal}
                            value={discount}
                            onChange={handleDiscountChange}
                            className="w-24 sm:w-28 border rounded-lg px-3 py-2 text-right outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* DELIVERY FEE */}
                <div className="flex items-center justify-between gap-3">
                    <span>
                        Delivery Fee
                    </span>
                    <div className="flex items-center">
                        <span className="mr-2">
                            Rs.
                        </span>
                        <input
                            type="text"
                            inputMode="decimal"
                            min="0"
                            value={deliveryFee}
                            onChange={handleDeliveryChange}
                            className="w-24 sm:w-28 border rounded-lg px-3 py-2 text-right outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <hr />
                {/* BREAKDOWN */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-500">
                        <span>Discount</span>
                        <span>
                            - Rs. {safeDiscount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Delivery Fee</span>
                        <span>
                            + Rs. {deliveryAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        </span>
                    </div>
                </div>
                {/* TOTAL */}
                <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-semibold">
                            TOTAL
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                            Rs. {total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartSummary;