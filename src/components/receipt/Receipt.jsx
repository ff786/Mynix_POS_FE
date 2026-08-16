import ReceiptItem from "./ReceiptItem";

function Receipt({ sale }) {
    if (!sale) return null;

    const customerOutstanding = Number(
        sale.customerOutstanding || 0
    );

    return (
        <div
            id="receipt-content"
            className="w-full bg-white text-slate-900 space-y-5 print:space-y-3"
        >
            {/* Business header */}
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    MYNIX POS
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Business Management System
                </p>
            </div>

            <div className="border-t border-dashed border-slate-300" />

            {/* Invoice information */}
            <div className="space-y-2.5 text-sm">
                <ReceiptInfo
                    label="Invoice"
                    value={sale.invoiceNumber}
                    mono
                />

                <ReceiptInfo
                    label="Date"
                    value={
                        sale.createdAt
                            ? new Date(sale.createdAt).toLocaleString()
                            : "—"
                    }
                />

                <ReceiptInfo
                    label="Cashier"
                    value={
                        sale.cashierName ||
                        sale.cashierUsername ||
                        "Admin"
                    }
                />

                <ReceiptInfo
                    label="Payment"
                    value={formatPaymentMethod(sale.paymentMethod)}
                />
            </div>

            {/* Customer */}
            {sale.customerId && (
                <>
                    <div className="border-t border-dashed border-slate-300" />

                    <div className="space-y-2.5 text-sm">
                        <div className="font-semibold text-slate-900 mb-2">
                            Customer
                        </div>

                        <ReceiptInfo
                            label="Name"
                            value={sale.customerName}
                        />

                        <ReceiptInfo
                            label="Contact"
                            value={sale.customerContactNumber}
                        />

                        {sale.paymentMethod === "CREDIT" && (
                            <ReceiptInfo
                                label="Outstanding"
                                value={`Rs. ${customerOutstanding.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}`}
                            />
                        )}
                    </div>
                </>
            )}

            <div className="border-t border-dashed border-slate-300" />

            {/* Items */}
            <div>
                {sale.items?.length > 0 ? (
                    <div>
                        {sale.items.map((item, index) => (
                            <ReceiptItem
                                key={
                                    item.barcode ??
                                    `${item.productName}-${index}`
                                }
                                item={item}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">
                        Item details are not available for this historical sale.
                    </p>
                )}
            </div>

            <div className="border-t border-dashed border-slate-300" />

            {/* Totals */}
            <div className="space-y-2.5">
                <ReceiptTotal
                    label="Subtotal"
                    value={sale.subtotal}
                />

                <ReceiptTotal
                    label="Discount"
                    value={sale.discount}
                />

                <ReceiptTotal
                    label="Delivery Fee"
                    value={sale.deliveryFee}
                />

                <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">
                    <span className="text-lg font-bold">
                        TOTAL
                    </span>

                    <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                        Rs.{" "}
                        {Number(sale.grandTotal || 0).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}
                    </span>
                </div>
            </div>

            {/* Credit notice */}
            {sale.paymentMethod === "CREDIT" && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
                    <p className="text-xs font-semibold text-amber-800">
                        CREDIT SALE
                    </p>

                    <p className="text-xs text-amber-700 mt-1">
                        Outstanding balance: Rs.{" "}
                        {customerOutstanding.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="border-t border-dashed border-slate-300 pt-4 text-center text-xs sm:text-sm text-slate-500 space-y-1">
                <p>
                    Thank you for shopping with MYNIX POS!
                </p>

                <p>
                    Please keep this receipt for your records.
                </p>
            </div>
        </div>
    );
}

/* Info row */
function ReceiptInfo({
                         label,
                         value,
                         mono = false,
                     }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-slate-500">
                {label}
            </span>

            <span
                className={`text-right font-medium break-all ${
                    mono ? "font-mono" : ""
                }`}
            >
                {value || "—"}
            </span>
        </div>
    );
}

/* Total row */
function ReceiptTotal({
                          label,
                          value,
                      }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-500">
                {label}
            </span>

            <span className="font-medium">
                Rs.{" "}
                {Number(value || 0).toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }
                )}
            </span>
        </div>
    );
}

/* Payment label */
function formatPaymentMethod(method) {
    const labels = {
        CASH: "Cash",
        CARD: "Card",
        BANK_DEPOSIT: "Bank Deposit",
        CREDIT: "Credit",
        CHEQUE: "Cheque",
    };

    return labels[method] || method || "—";
}

export default Receipt;