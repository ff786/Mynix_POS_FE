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
                min-w-0
                bg-white
                text-slate-900
            "
        >
            {/* =====================================================
                BRAND
            ====================================================== */}

            <header className="
                mynix-receipt-header
                text-center
            ">
                <div className="
                    mynix-logo-mark
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-emerald-600
                    text-xl
                    font-black
                    text-white
                    shadow-sm
                ">
                    M
                </div>

                <h1 className="
                    mt-3
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950
                ">
                    MYNIX
                </h1>

                <p className="
                    mt-0.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-slate-400
                ">
                    POS & Business Management
                </p>

                <div className="
                    mt-3
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-emerald-700
                ">
                    Customer Receipt
                </div>
            </header>


            {/* =====================================================
                INVOICE INFORMATION
            ====================================================== */}

            <section className="
                mynix-receipt-card
                mt-5
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-4
            ">
                <div className="
                    grid
                    grid-cols-2
                    gap-x-5
                    gap-y-4
                ">
                    <ReceiptInfo
                        label="Invoice No."
                        value={
                            sale.invoiceNumber
                        }
                        mono
                    />

                    <ReceiptInfo
                        label="Payment"
                        value={
                            paymentMethod
                        }
                    />

                    <ReceiptInfo
                        label="Date"
                        value={
                            formatDate(
                                sale.createdAt
                            )
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
                </div>
            </section>


            {/* =====================================================
                CUSTOMER
            ====================================================== */}

            {hasCustomer && (
                <section className="
                    mynix-receipt-card
                    mt-3
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                ">
                    <div className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    ">
                        <div className="min-w-0">

                            <p className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-slate-400
                            ">
                                Customer
                            </p>

                            <p className="
                                mt-1
                                truncate
                                text-sm
                                font-bold
                                text-slate-950
                            ">
                                {sale.customerName ||
                                    "Customer"}
                            </p>
                        </div>

                        {sale.customerContactNumber && (
                            <p className="
                                shrink-0
                                text-right
                                text-[10px]
                                font-semibold
                                text-slate-500
                            ">
                                {sale.customerContactNumber}
                            </p>
                        )}
                    </div>

                    {isCredit && (
                        <div className="
                            mt-3
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            px-3
                            py-2.5
                        ">
                            <span className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-amber-700
                            ">
                                Outstanding
                            </span>

                            <span className="
                                text-xs
                                font-extrabold
                                text-amber-900
                            ">
                                Rs.{" "}
                                {formatAmount(
                                    customerOutstanding
                                )}
                            </span>
                        </div>
                    )}
                </section>
            )}


            {/* =====================================================
                ITEMS
            ====================================================== */}

            <section className="
                mt-5
            ">
                <div className="
                    mb-2
                    flex
                    items-end
                    justify-between
                    px-1
                ">
                    <div>
                        <p className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-slate-400
                        ">
                            Purchase
                        </p>

                        <p className="
                            mt-0.5
                            text-sm
                            font-bold
                            text-slate-800
                        ">
                            {itemCount}{" "}
                            {itemCount === 1
                                ? "item"
                                : "items"}
                        </p>
                    </div>

                    <p className="
                        text-[9px]
                        font-medium
                        text-slate-400
                    ">
                        Amount
                    </p>
                </div>

                <div className="
                    mynix-item-table
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                ">
                    <div className="
                        grid
                        grid-cols-[minmax(0,1fr)_auto]
                        gap-3
                        bg-slate-950
                        px-4
                        py-2.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-white
                    ">
                        <span>
                            Product
                        </span>

                        <span className="
                            text-right
                        ">
                            Amount
                        </span>
                    </div>

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
                            px-4
                            py-6
                            text-center
                            text-xs
                            text-slate-400
                        ">
                            Item details are not
                            available for this
                            historical sale.
                        </div>
                    )}
                </div>
            </section>


            {/* =====================================================
                SUMMARY
            ====================================================== */}

            <section className="
                mynix-summary-card
                mt-4
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
            ">
                <div className="
                    space-y-2
                ">
                    <ReceiptTotal
                        label="Subtotal"
                        value={
                            sale.subtotal
                        }
                    />

                    <ReceiptTotal
                        label="Discount"
                        value={
                            sale.discount
                        }
                        negative
                    />

                    <ReceiptTotal
                        label="Delivery Fee"
                        value={
                            sale.deliveryFee || 0
                        }
                    />
                </div>

                <div className="
                    my-3
                    border-t
                    border-dashed
                    border-slate-300
                " />

                <div className="
                    flex
                    items-end
                    justify-between
                    gap-4
                ">
                    <div>
                        <p className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-slate-400
                        ">
                            Total
                        </p>

                        <p className="
                            mt-1
                            text-[10px]
                            font-semibold
                            text-slate-400
                        ">
                            {paymentMethod}
                        </p>
                    </div>

                    <p className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-slate-950
                    ">
                        Rs.{" "}
                        {formatAmount(
                            sale.grandTotal
                        )}
                    </p>
                </div>
            </section>


            {/* =====================================================
                CREDIT NOTICE
            ====================================================== */}

            {isCredit && (
                <section className="
                    mt-3
                    rounded-2xl
                    border
                    border-amber-200
                    bg-amber-50
                    px-4
                    py-3
                    text-center
                ">
                    <p className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-amber-700
                    ">
                        Credit Sale
                    </p>

                    <p className="
                        mt-1
                        text-[11px]
                        font-semibold
                        text-amber-900
                    ">
                        Outstanding balance:
                        {" "}
                        Rs.{" "}
                        {formatAmount(
                            customerOutstanding
                        )}
                    </p>
                </section>
            )}


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="
                mynix-receipt-footer
                mt-6
                border-t
                border-dashed
                border-slate-300
                pt-4
                text-center
            ">
                <p className="
                    text-xs
                    font-bold
                    text-slate-800
                ">
                    Thank you for choosing MYNIX.
                </p>

                <p className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-slate-400
                ">
                    We appreciate your business.
                </p>

                <p className="
                    mt-3
                    text-[9px]
                    font-semibold
                    text-slate-500
                ">
                    Inquiries: 0778843815
                </p>

                <p className="
                    mt-1.5
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    text-slate-300
                ">
                    Computer-generated receipt
                </p>

                <p className="
                    mt-1
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-emerald-600
                ">
                    MYNIX POS
                </p>
            </footer>
        </div>
    );
}


/* =========================================================
   INFO
========================================================= */

function ReceiptInfo({
                         label,
                         value,
                         mono = false,
                     }) {
    return (
        <div className="
            min-w-0
        ">
            <p className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-slate-400
            ">
                {label}
            </p>

            <p
                className={`
                    mt-1
                    min-w-0
                    break-words
                    text-[11px]
                    font-bold
                    text-slate-800
                    ${
                    mono
                        ? "font-mono"
                        : ""
                }
                `}
            >
                {value || "—"}
            </p>
        </div>
    );
}


/* =========================================================
   TOTAL
========================================================= */

function ReceiptTotal({
                          label,
                          value,
                          negative = false,
                      }) {
    return (
        <div className="
            flex
            items-center
            justify-between
            gap-4
        ">
            <span className="
                text-xs
                font-medium
                text-slate-500
            ">
                {label}
            </span>

            <span className="
                shrink-0
                text-xs
                font-semibold
                text-slate-800
            ">
                {negative
                    ? "- "
                    : ""}
                Rs.{" "}
                {formatAmount(value)}
            </span>
        </div>
    );
}


/* =========================================================
   FORMATTERS
========================================================= */

function formatAmount(value) {
    return Number(
        value || 0
    ).toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
}


function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleString(
        "en-LK",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );
}


function formatPaymentMethod(
    method
) {
    const labels = {
        CASH: "Cash",
        CARD: "Card",
        BANK_DEPOSIT:
            "Bank Deposit",
        CREDIT: "Credit",
        CHEQUE: "Cheque",
    };

    return (
        labels[method] ||
        method ||
        "—"
    );
}

export default Receipt;