import ReceiptItem from "./ReceiptItem";

function Receipt({ sale }) {
    if (!sale) return null;

    const customerOutstanding = Number(sale.customerOutstanding || 0);
    const hasCustomer = Boolean(sale.customerId);
    const isCredit = sale.paymentMethod === "CREDIT";
    const paymentMethod = formatPaymentMethod(sale.paymentMethod);
    const items = Array.isArray(sale.items) ? sale.items : [];
    const itemCount = items.length;
    const subtotal = Number(sale.subtotal || 0);
    const discount = Number(sale.discount || 0);
    const deliveryFee = Number(sale.deliveryFee || 0);
    const grandTotal = Number(sale.grandTotal || 0);

    return (
        <div
            id="receipt-content"
            className="mynix-receipt mx-auto w-full max-w-4xl overflow-hidden bg-white text-slate-900 print:bg-white"
        >
            <header className="border-b border-slate-200 px-4 py-5 text-center sm:px-6 sm:py-6">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-black tracking-tight text-emerald-950 sm:text-3xl">
                        MYNIX PVT (LTD)
                    </h1>

                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                        The Signature of Perfection
                    </p>

                    <div className="mt-4 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 sm:px-4 sm:py-2 sm:text-xs">
                        ✓ Customer Receipt
                    </div>
                </div>
            </header>

            <section className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
                    <MetaItem label="Invoice No." value={sale.invoiceNumber} mono />
                    <MetaItem label="Payment Method" value={paymentMethod} />
                    <MetaItem label="Date & Time" value={formatDate(sale.createdAt)} />
                    <MetaItem
                        label="Cashier"
                        value={sale.cashierName || sale.cashierUsername || "System"}
                    />
                </div>
            </section>

            {hasCustomer && (
                <section className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                    Customer
                                </p>

                                <p className="mt-1 truncate text-base font-bold text-slate-900 sm:text-lg">
                                    {sale.customerName || "Customer"}
                                </p>
                            </div>

                            {sale.customerContactNumber && (
                                <div className="w-full rounded-xl bg-white px-3 py-2 sm:w-auto">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                        Contact
                                    </p>

                                    <p className="mt-0.5 break-all font-mono text-xs font-semibold text-slate-700 sm:text-sm">
                                        {sale.customerContactNumber}
                                    </p>
                                </div>
                            )}
                        </div>

                        {isCredit && (
                            <div className="mt-3 flex flex-col gap-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">
                                    Outstanding Balance
                                </span>

                                <span className="text-lg font-black text-amber-900">
                                    Rs. {formatAmount(customerOutstanding)}
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="border-b border-slate-200 bg-white px-3 py-4 sm:px-6 sm:py-5">
                <div className="mb-4 flex items-end justify-between gap-3 px-1">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Items Purchased
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                    </div>

                    <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {paymentMethod}
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-4 bg-slate-900 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-300 sm:grid sm:px-5">
                        <span>Product</span>
                        <span className="text-right">Amount</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {itemCount > 0 ? (
                            items.map((item, index) => (
                                <ReceiptItem
                                    key={
                                        item.id ??
                                        item.barcode ??
                                        `${item.productName}-${index}`
                                    }
                                    item={item}
                                />
                            ))
                        ) : (
                            <div className="px-4 py-10 text-center text-sm text-slate-400">
                                Item details not available
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 sm:py-6">
                <div className="space-y-3">
                    <SummaryRow label="Subtotal" value={subtotal} />

                    {discount > 0 && (
                        <SummaryRow
                            label="Discount"
                            value={discount}
                            negative
                        />
                    )}

                    {deliveryFee > 0 && (
                        <SummaryRow
                            label="Delivery Fee"
                            value={deliveryFee}
                        />
                    )}
                </div>

                <div className="my-5 border-t border-dashed border-slate-300" />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Total Amount
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                            Payment: {paymentMethod}
                        </p>
                    </div>

                    <div className="text-left sm:text-right">
                        <p className="break-words text-2xl font-black tracking-tight text-emerald-600 sm:text-3xl">
                            Rs. {formatAmount(grandTotal)}
                        </p>
                    </div>
                </div>
            </section>

            {isCredit && (
                <section className="mx-3 my-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center sm:mx-6 sm:my-5 sm:px-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
                        Credit Transaction
                    </p>

                    <p className="mt-1 text-sm font-semibold text-amber-900">
                        Outstanding Balance
                    </p>

                    <p className="mt-2 text-2xl font-black tracking-tight text-amber-700">
                        Rs. {formatAmount(customerOutstanding)}
                    </p>
                </section>
            )}

            <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center sm:px-6 sm:py-7">
                <p className="text-base font-bold text-slate-900 sm:text-lg">
                    Thank you for your business!
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    We appreciate your trust in MYNIX.
                </p>

                <div className="mx-auto my-4 h-px max-w-xs bg-slate-200" />

                <p className="text-base font-black tracking-tight text-emerald-600">
                    MYNIX POS
                </p>

                <p className="mt-1 text-xs font-medium text-slate-600">
                    Inquiries: 0778843815
                </p>

                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                    Computer-Generated Receipt
                </p>
            </footer>
        </div>
    );
}

function MetaItem({ label, value, mono = false }) {
    return (
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 break-words text-sm font-bold text-slate-800 sm:text-[15px] ${
                    mono ? "font-mono" : ""
                }`}
            >
                {value || "—"}
            </p>
        </div>
    );
}

function SummaryRow({ label, value, negative = false }) {
    if (!value) return null;

    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-600">
                {label}
            </span>

            <span
                className={`shrink-0 font-mono text-sm font-bold ${
                    negative ? "text-red-600" : "text-slate-800"
                }`}
            >
                {negative ? "− " : ""}
                Rs. {formatAmount(value)}
            </span>
        </div>
    );
}

function formatAmount(value) {
    return Number(value || 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

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