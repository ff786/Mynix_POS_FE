import ReceiptItem from "./ReceiptItem";

function Receipt({ sale }) {
    if (!sale) {
        return null;
    }

    const customerOutstanding = Number(
        sale.customerOutstanding || 0
    );

    const hasCustomer = Boolean(
        sale.customerId
    );

    const isCredit =
        sale.paymentMethod === "CREDIT";

    const paymentMethod =
        formatPaymentMethod(
            sale.paymentMethod
        );

    const itemCount =
        Array.isArray(sale.items)
            ? sale.items.length
            : 0;

    return (
        <div
            id="receipt-content"
            className="
                mynix-receipt
                w-full
                max-w-4xl
                mx-auto
                p-1
                max-h-screen
                overflow-y-auto
                bg-white
                text-slate-900
                print:bg-white
            "
        >
            {/* =====================================================
                BRAND HEADER
            ====================================================== */}

            <header className="
                mynix-receipt-header
                px-2
                py-2
                text-black
                text-center
            ">
                <div className="
                    flex
                    justify-center
                    gap-2
                    items-center
                    mb-3
                ">
                    <h1 className="
                        text-3xl
                        font-black
                        text-emerald-950
                        tracking-tight
                    ">
                        MYNIX PVT (LTD)
                    </h1>
                </div>

                {/*<p className="
                    text-emerald-50
                    text-xs
                    font-medium
                    tracking-wide
                    uppercase
                    mb-3
                ">
                    POS & Business Management
                </p>
*/}
                <div className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-white
                    px-4
                    py-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-emerald-600
                    bg-emerald-50
                ">
                    ✓ Customer Receipt
                </div>
            </header>


            {/* =====================================================
                INVOICE META
            ====================================================== */}

            <section className="
                px-6
                py-4
                border-b
                border-slate-200
                bg-white
            ">
                <div className="
                    space-y-4
                ">
                    <div className="grid grid-cols-2 gap-6">
                        <MetaItem
                            label="Invoice No."
                            value={sale.invoiceNumber}
                            mono
                        />
                        <MetaItem
                            label="Payment Method"
                            value={paymentMethod}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <MetaItem
                            label="Date & Time"
                            value={formatDate(sale.createdAt)}
                        />
                        <MetaItem
                            label="Cashier"
                            value={
                                sale.cashierName ||
                                sale.cashierUsername ||
                                "System"
                            }
                        />
                    </div>
                </div>
            </section>


            {/* =====================================================
                CUSTOMER SECTION
            ====================================================== */}

            {hasCustomer && (
                <section className="
                    px-6
                    py-4
                    border-b
                    border-slate-200
                    bg-white
                ">
                    <div className="
                        space-y-2
                    ">
                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">
                            <div className="flex-1">
                                <p className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                    mb-1
                                ">
                                    Customer
                                </p>
                                <p className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                ">
                                    {sale.customerName ||
                                        "Customer"}
                                </p>
                            </div>
                            {sale.customerContactNumber && (
                                <p className="
                                    shrink-0
                                    text-right
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    font-mono
                                ">
                                    {sale.customerContactNumber}
                                </p>
                            )}
                        </div>

                        {isCredit && (
                            <div className="
                                mt-2
                                flex
                                items-center
                                justify-between
                                gap-3
                                rounded-lg
                                border
                                border-amber-300
                                bg-amber-50
                                px-4
                                py-3
                            ">
                                <span className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-amber-700
                                ">
                                    Amount Due
                                </span>
                                <span className="
                                    text-base
                                    font-bold
                                    text-amber-900
                                ">
                                    Rs. {formatAmount(customerOutstanding)}
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            )}


            {/* =====================================================
                ITEMS
            ====================================================== */}

            <section className="
                px-6
                py-4
                border-b
                border-slate-200
                bg-white
            ">
                <div className="
                    mb-4
                ">
                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                        mb-2
                    ">
                        Items Purchased
                    </p>
                    <p className="
                        text-sm
                        font-bold
                        text-slate-900
                    ">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                </div>

                <div className="
                    overflow-hidden
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                ">
                    <div className="
                        grid
                        grid-cols-[minmax(0,1fr)_auto]
                        gap-4
                        bg-slate-900
                        px-5
                        py-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-300
                    ">
                        <span>Product</span>
                        <span className="text-right">Amount</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {itemCount > 0 ? (
                            sale.items.map(
                                (item, index) => (
                                    <ReceiptItem
                                        key={
                                            item.id ??
                                            item.barcode ??
                                            `${item.productName}-${index}`
                                        }
                                        item={item}
                                    />
                                )
                            )
                        ) : (
                            <div className="
                                px-5
                                py-8
                                text-center
                                text-sm
                                text-slate-400
                            ">
                                Item details not available
                            </div>
                        )}
                    </div>
                </div>
            </section>


            {/* =====================================================
                TOTALS
            ====================================================== */}

            <section className="
                px-6
                py-4
                border-b
                border-slate-200
                bg-white
            ">
                <div className="space-y-3 mb-4">
                    <SummaryRow
                        label="Subtotal"
                        value={sale.subtotal}
                    />

                    {sale.discount > 0 && (
                        <SummaryRow
                            label="Discount"
                            value={sale.discount}
                            negative
                        />
                    )}

                    {sale.deliveryFee > 0 && (
                        <SummaryRow
                            label="Delivery Fee"
                            value={sale.deliveryFee}
                        />
                    )}
                </div>

                <div className="
                    border-t
                    border-slate-300
                    pt-4
                " />

                <div className="
                    flex
                    items-end
                    justify-between
                    gap-4
                    mt-4
                ">
                    <div>
                        <p className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-500
                            mb-1
                        ">
                            Total Amount
                        </p>
                        <p className="
                            text-sm
                            font-medium
                            text-slate-600
                        ">
                            {paymentMethod}
                        </p>
                    </div>

                    <div className="
                        text-right
                    ">
                        <p className="
                            text-xl
                            font-black
                            text-emerald-600
                        ">
                            Rs. {formatAmount(sale.grandTotal)}
                        </p>
                    </div>
                </div>
            </section>


            {/* =====================================================
                CREDIT NOTICE
            ====================================================== */}

            {isCredit && (
                <section className="
                    mx-6
                    my-4
                    rounded-lg
                    border
                    border-amber-300
                    bg-amber-50
                    px-5
                    py-4
                    text-center
                ">
                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-amber-700
                        mb-2
                    ">
                        Credit Transaction
                    </p>

                    <p className="
                        text-sm
                        font-semibold
                        text-amber-900
                    ">
                        Outstanding Balance
                    </p>
                    <p className="
                        text-2xl
                        font-bold
                        text-amber-700
                        mt-2
                    ">
                        Rs. {formatAmount(customerOutstanding)}
                    </p>
                </section>
            )}


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="
                px-4
                py-3
                text-center
                border-t
                border-slate-200
                bg-white
            ">
                <p className="
                    text-base
                    font-bold
                    text-slate-900
                    mb-1
                ">
                    Thank you for your business!
                </p>

                <p className="
                    text-sm
                    text-slate-600
                    mb-2
                ">
                    We appreciate your trust in MYNIX
                </p>

                <div className="
                    my-3
                    border-t
                    border-slate-200
                " />

                <p className="
                    text-base
                    font-bold
                    text-emerald-600
                    mb-1
                ">
                    MYNIX POS
                </p>

                <p className="
                    text-sm
                    text-slate-600
                    mb-2
                ">
                    Inquiries: 0778843815
                </p>

                <p className="
                    text-xs
                    text-slate-400
                    uppercase
                    tracking-wide
                ">
                    Computer-Generated Receipt
                </p>
            </footer>
        </div>
    );
}


/* =========================================================
   META INFO (Invoice, Payment, Date, Cashier)
========================================================= */

function MetaItem({
                      label,
                      value,
                      mono = false,
                  }) {
    return (
        <div>
            <p className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-500
                mb-1
            ">
                {label}
            </p>

            <p
                className={`
                    text-sm
                    font-bold
                    text-slate-800
                    word-break
                    ${mono ? "font-mono" : ""}
                `}
            >
                {value || "—"}
            </p>
        </div>
    );
}


/* =========================================================
   SUMMARY ROW (Subtotal, Discount, Delivery)
========================================================= */

function SummaryRow({
                        label,
                        value,
                        negative = false,
                    }) {
    if (!value) return null;

    return (
        <div className="
            flex
            items-center
            justify-between
            gap-4
        ">
            <span className="
                text-sm
                font-medium
                text-slate-600
            ">
                {label}
            </span>

            <span className={`
                shrink-0
                text-sm
                font-bold
                font-mono
                ${
                negative
                    ? "text-red-600"
                    : "text-slate-800"
            }
            `}>
                {negative ? "− " : ""}
                Rs. {formatAmount(value)}
            </span>
        </div>
    );
}


/* =========================================================
   FORMATTERS
========================================================= */

function formatAmount(value) {
    return Number(value || 0).toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

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