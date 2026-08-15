function CartSummary({ cart }) {

    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity) *
            Number(item.sellingPrice),
        0
    );

    const discount = 0;

    const total = subtotal - discount;

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">

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

                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                        Subtotal
                    </span>

                    <span className="font-medium">
                        Rs. {subtotal.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                        Discount
                    </span>

                    <span className="font-medium">
                        Rs. {discount.toLocaleString()}
                    </span>
                </div>

                <div className="border-t pt-4">

                    <div className="flex justify-between items-center">

                        <span className="text-lg font-semibold">
                            TOTAL
                        </span>

                        <span className="text-2xl font-bold text-emerald-600">
                            Rs. {total.toLocaleString()}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CartSummary;