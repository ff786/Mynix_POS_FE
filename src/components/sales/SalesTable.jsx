import {
    Eye,
    ReceiptText,
    CreditCard,
    Banknote,
    WalletCards,
    Building2,
    FileCheck2,
} from "lucide-react";

function SalesTable({
                        sales,
                        onView,
                    }) {

    if (sales.length === 0) {

        return (
            <div className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-6
                py-16
                text-center
                shadow-sm
                sm:py-20
            ">

                <div className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                ">

                    <ReceiptText
                        size={28}
                        className="text-slate-400"
                    />

                </div>

                <h3 className="
                    mt-5
                    text-base
                    font-semibold
                    text-slate-800
                    sm:text-lg
                ">
                    No sales found
                </h3>

                <p className="
                    mx-auto
                    mt-1.5
                    max-w-sm
                    text-sm
                    leading-5
                    text-slate-400
                ">
                    No transactions match your
                    current search.
                </p>

            </div>
        );
    }

    return (
        <div>

            {/* =========================
                DESKTOP
            ========================== */}

            <div className="
                hidden
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                md:block
            ">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                        <tr className="
                                border-b
                                border-slate-200
                                bg-slate-50
                            ">

                            <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                ">
                                Invoice
                            </th>

                            <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                ">
                                Customer
                            </th>

                            <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                ">
                                Date
                            </th>

                            <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                ">
                                Payment
                            </th>

                            <th className="
                                    px-6
                                    py-4
                                    text-right
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                ">
                                Total
                            </th>

                            <th className="
                                    px-6
                                    py-4
                                    text-right
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                ">
                                Action
                            </th>

                        </tr>

                        </thead>

                        <tbody className="
                            divide-y
                            divide-slate-100
                        ">

                        {sales.map(sale => (

                            <DesktopSaleRow
                                key={
                                    sale.invoiceNumber
                                }
                                sale={sale}
                                onView={onView}
                            />

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =========================
                MOBILE
            ========================== */}

            <div className="
                space-y-3
                md:hidden
            ">

                {sales.map(sale => (

                    <MobileSaleCard
                        key={
                            sale.invoiceNumber
                        }
                        sale={sale}
                        onView={onView}
                    />

                ))}

            </div>

        </div>
    );
}


/* =================================
   DESKTOP ROW
================================= */

function DesktopSaleRow({
                            sale,
                            onView,
                        }) {

    return (
        <tr className="
            border-b
            border-slate-100
            transition
            last:border-b-0
            hover:bg-slate-50/70
        ">

            {/* Invoice */}

            <td className="px-6 py-5">

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                    ">

                        <ReceiptText
                            size={17}
                            className="text-emerald-600"
                        />

                    </div>

                    <div>

                        <p className="
                            font-mono
                            text-sm
                            font-semibold
                            text-slate-900
                        ">
                            {sale.invoiceNumber}
                        </p>

                        <p className="
                            mt-1
                            text-xs
                            text-slate-400
                        ">
                            Sale transaction
                        </p>

                    </div>

                </div>

            </td>

            {/* Customer */}

            <td className="px-6 py-5">

                <div className="min-w-0">

                    <p className="
                        max-w-[180px]
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                    ">
                        {sale.customerName ||
                            "Walk-in Customer"}
                    </p>

                    {sale.customerId && (
                        <p className="
                            mt-1
                            text-xs
                            text-slate-400
                        ">
                            Customer #{sale.customerId}
                        </p>
                    )}

                </div>

            </td>

            {/* Date */}

            <td className="
                px-6
                py-5
                text-sm
                text-slate-600
            ">

                <p>
                    {formatDate(
                        sale.createdAt
                    )}
                </p>

                <p className="
                    mt-1
                    text-xs
                    text-slate-400
                ">
                    {formatTime(
                        sale.createdAt
                    )}
                </p>

            </td>

            {/* Payment */}

            <td className="px-6 py-5">

                <PaymentBadge
                    method={
                        sale.paymentMethod
                    }
                />

            </td>

            {/* Total */}

            <td className="
                px-6
                py-5
                text-right
            ">

                <span className="
                    text-sm
                    font-bold
                    text-slate-900
                ">
                    Rs.{" "}
                    {formatMoney(
                        sale.grandTotal
                    )}
                </span>

            </td>

            {/* Action */}

            <td className="px-6 py-5">

                <div className="
                    flex
                    justify-end
                ">

                    <ViewButton
                        onClick={() =>
                            onView(sale)
                        }
                    />

                </div>

            </td>

        </tr>
    );
}


/* =================================
   MOBILE CARD
================================= */

function MobileSaleCard({
                            sale,
                            onView,
                        }) {

    return (
        <article className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
        ">

            {/* Top */}

            <div className="
                flex
                items-start
                justify-between
                gap-3
            ">

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                    ">

                        <ReceiptText
                            size={18}
                            className="text-emerald-600"
                        />

                    </div>

                    <div className="min-w-0">

                        <p className="
                            truncate
                            font-mono
                            text-sm
                            font-bold
                            text-slate-900
                        ">
                            {sale.invoiceNumber}
                        </p>

                        <p className="
                            mt-1
                            truncate
                            text-xs
                            text-slate-500
                        ">
                            {sale.customerName ||
                                "Walk-in Customer"}
                        </p>

                    </div>

                </div>

                <PaymentBadge
                    method={
                        sale.paymentMethod
                    }
                />

            </div>

            {/* Information */}

            <div className="
                mt-4
                grid
                grid-cols-2
                gap-3
                border-t
                border-slate-100
                pt-4
            ">

                <div>

                    <p className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                    ">
                        Date
                    </p>

                    <p className="
                        mt-1
                        text-sm
                        font-medium
                        text-slate-700
                    ">
                        {formatDate(
                            sale.createdAt
                        )}
                    </p>

                    <p className="
                        mt-0.5
                        text-xs
                        text-slate-400
                    ">
                        {formatTime(
                            sale.createdAt
                        )}
                    </p>

                </div>

                <div className="text-right">

                    <p className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                    ">
                        Total
                    </p>

                    <p className="
                        mt-1
                        text-lg
                        font-bold
                        text-slate-900
                    ">
                        Rs.{" "}
                        {formatMoney(
                            sale.grandTotal
                        )}
                    </p>

                </div>

            </div>

            {/* View */}

            <button
                type="button"
                onClick={() =>
                    onView(sale)
                }
                className="
                    mt-4
                    flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-50
                    px-4
                    text-sm
                    font-semibold
                    text-emerald-700
                    transition
                    hover:bg-emerald-100
                    active:scale-[0.98]
                "
            >

                <Eye size={16} />

                View Invoice

            </button>

        </article>
    );
}


/* =================================
   PAYMENT BADGE
================================= */

function PaymentBadge({
                          method,
                      }) {

    const normalized =
        method?.toUpperCase();

    let Icon = WalletCards;

    let classes = `
        border-slate-200
        bg-slate-50
        text-slate-600
    `;

    let label =
        method || "Unknown";

    switch (normalized) {

        case "CASH":

            Icon = Banknote;

            classes = `
                border-emerald-200
                bg-emerald-50
                text-emerald-700
            `;

            label = "Cash";

            break;

        case "CARD":
        case "CREDIT_CARD":

            Icon = CreditCard;

            classes = `
                border-blue-200
                bg-blue-50
                text-blue-700
            `;

            label = "Card";

            break;

        case "BANK_DEPOSIT":

            Icon = Building2;

            classes = `
                border-indigo-200
                bg-indigo-50
                text-indigo-700
            `;

            label = "Bank";

            break;

        case "CREDIT":

            Icon = WalletCards;

            classes = `
                border-amber-200
                bg-amber-50
                text-amber-700
            `;

            label = "Credit";

            break;

        case "CHEQUE":

            Icon = FileCheck2;

            classes = `
                border-purple-200
                bg-purple-50
                text-purple-700
            `;

            label = "Cheque";

            break;

        default:
            break;
    }

    return (
        <span
            className={`
                inline-flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                px-2.5
                py-1
                text-xs
                font-semibold
                whitespace-nowrap
                ${classes}
            `}
        >

            <Icon size={13} />

            {label}

        </span>
    );
}


/* =================================
   VIEW BUTTON
================================= */

function ViewButton({
                        onClick,
                    }) {

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-50
                px-3.5
                text-sm
                font-semibold
                text-emerald-700
                transition
                hover:bg-emerald-100
                active:scale-[0.98]
            "
        >

            <Eye size={16} />

            View

        </button>
    );
}


/* =================================
   HELPERS
================================= */

function formatMoney(value) {

    return Number(
        value || 0
    ).toLocaleString(
        undefined,
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

    return date.toLocaleDateString(
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

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit",
        }
    );
}


export default SalesTable;