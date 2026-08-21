function ReceiptPrint({ sale }) {
    if (!sale) {
        return null;
    }

    const items = Array.isArray(sale.items)
        ? sale.items
        : [];

    const isCredit =
        sale.paymentMethod === "CREDIT";

    const isCheque =
        sale.paymentMethod === "CHEQUE";

    const isFullyPaid = [
        "CASH",
        "CARD",
        "BANK_DEPOSIT",
    ].includes(sale.paymentMethod);

    const outstanding =
        Number(
            sale.customerOutstanding || 0
        );

    return (
        <div
            id="mynix-thermal-receipt"
            className="w-full bg-white text-black"
        >

            {/* HEADER */}

            <div className="thermal-header">

                <div className="thermal-brand">
                    MYNIX
                </div>

                <div className="thermal-tagline">
                    The Signature of Perfection
                </div>

                <div className="thermal-contact">
                    0778843815
                </div>

            </div>


            <ThermalDivider />


            {/* SALE DETAILS */}

            <div className="thermal-sale-header">

                <div className="thermal-sale-left">
                    <div>
                        <strong>INVOICE</strong>
                    </div>

                    <div>
                        {sale.invoiceNumber || "—"}
                    </div>
                </div>

                <div className="thermal-sale-right">
                    <div>
                        {formatDate(
                            sale.createdAt
                        )}
                    </div>

                    <div>
                        {formatPaymentMethod(
                            sale.paymentMethod
                        )}
                    </div>
                </div>

            </div>


            {sale.customerId && (
                <>
                    <ThermalDivider />

                    <div className="thermal-customer">

                        <div className="thermal-customer-title">
                            CUSTOMER
                        </div>

                        <div>
                            {sale.customerName ||
                                "Customer"}
                        </div>

                        {sale.customerContactNumber && (
                            <div>
                                {
                                    sale.customerContactNumber
                                }
                            </div>
                        )}

                    </div>
                </>
            )}


            <ThermalDivider />


            {/* ITEM HEADER */}

            <div className="thermal-item-header">

                <span className="col-no">
                    NO
                </span>

                <span className="col-item">
                    ITEM
                </span>

                <span className="col-qty">
                    QTY
                </span>

                <span className="col-price">
                    PRICE
                </span>

                <span className="col-amount">
                    AMOUNT
                </span>

            </div>


            <ThermalDivider />


            {/* ITEMS */}

            <div className="thermal-items">

                {items.length > 0 ? (

                    items.map(
                        (item, index) => (
                            <ThermalItem
                                key={
                                    item.id ??
                                    item.barcode ??
                                    `${item.productName}-${index}`
                                }
                                item={item}
                                index={index}
                            />
                        )
                    )

                ) : (

                    <div className="thermal-empty">
                        NO ITEM DETAILS AVAILABLE
                    </div>

                )}

            </div>


            <ThermalDivider />


            {/* TOTALS */}

            <div className="thermal-totals">

                <ThermalAmountRow
                    label="SUB TOTAL"
                    value={sale.subtotal}
                />

                <ThermalAmountRow
                    label="DISCOUNT"
                    value={sale.discount}
                    negative
                />

                <ThermalAmountRow
                    label="DELIVERY FEE"
                    value={
                        sale.deliveryFee
                    }
                />

                <ThermalDivider />

                <ThermalAmountRow
                    label="NET TOTAL"
                    value={
                        sale.grandTotal
                    }
                    strong
                />

                <div className="thermal-payment-summary">

                    {isFullyPaid && (
                        <>
                            <ThermalAmountRow
                                label={formatPaymentMethod(
                                    sale.paymentMethod
                                ).toUpperCase()}
                                value={
                                    sale.grandTotal
                                }
                            />

                            <ThermalAmountRow
                                label="BALANCE"
                                value={0}
                            />
                        </>
                    )}

                    {(isCredit ||
                        isCheque) && (
                        <ThermalAmountRow
                            label="OUTSTANDING"
                            value={
                                outstanding
                            }
                            strong
                        />
                    )}

                </div>

            </div>


            {/* CREDIT / CHEQUE */}

            {(isCredit || isCheque) && (
                <>
                    <ThermalDivider />

                    <div className="
                        thermal-payment-notice
                    ">

                        <div className="
                            thermal-payment-notice-title
                        ">
                            {isCredit
                                ? "CREDIT SALE"
                                : "CHEQUE SALE"}
                        </div>

                        <div>
                            Outstanding:
                            {" "}
                            Rs.{" "}
                            {formatAmount(
                                outstanding
                            )}
                        </div>

                    </div>
                </>
            )}


            {/* FOOTER */}

            <div className="thermal-footer">

                <ThermalDivider />

                <div className="
                    thermal-footer-thanks
                ">
                    THANK YOU FOR SHOPPING
                </div>

                <div className="
                    thermal-footer-brand
                ">
                    WITH MYNIX
                </div>

                <div className="
                    thermal-footer-tagline
                ">
                    The Signature of Perfection
                </div>

                <div className="
                    thermal-footer-contact
                ">
                    Inquiries: 0778843815
                </div>

                <div className="
                    thermal-footer-generated
                ">
                    COMPUTER GENERATED RECEIPT
                </div>

            </div>

        </div>
    );
}


/* =========================================================
   ITEM
========================================================= */

function ThermalItem({
                         item,
                         index,
                     }) {
    const name =
        item.name ??
        item.productName ??
        "Unknown Product";

    const barcode =
        item.barcode ?? "";

    const unitPrice =
        Number(
            item.sellingPrice ??
            item.unitPrice ??
            0
        );

    const quantity =
        Number(item.quantity) || 0;

    const lineTotal =
        Number(
            item.lineTotal ??
            quantity * unitPrice
        );

    return (
        <div className="thermal-item">

            <div className="
                thermal-item-main
            ">

                <span className="
                    thermal-item-number
                ">
                    {index + 1}
                </span>

                <span className="
                    thermal-item-name
                ">
                    {name}
                </span>

                <span className="
                    thermal-item-qty
                ">
                    {quantity}
                </span>

                <span className="
                    thermal-item-price
                ">
                    {formatPlainAmount(
                        unitPrice
                    )}
                </span>

                <span className="
                    thermal-item-amount
                ">
                    {formatPlainAmount(
                        lineTotal
                    )}
                </span>

            </div>

            {barcode && (
                <div className="
                    thermal-item-barcode
                ">
                    {barcode}
                </div>
            )}

        </div>
    );
}


/* =========================================================
   AMOUNT ROW
========================================================= */

function ThermalAmountRow({
                              label,
                              value,
                              negative = false,
                              strong = false,
                          }) {
    return (
        <div
            className={`
                thermal-amount-row
                ${
                strong
                    ? "thermal-amount-row-strong"
                    : ""
            }
            `}
        >

            <span>
                {label}
            </span>

            <span>
                {negative ? "- " : ""}
                Rs.{" "}
                {formatAmount(value)}
            </span>

        </div>
    );
}


/* =========================================================
   DIVIDER
========================================================= */

function ThermalDivider() {
    return (
        <div className="thermal-divider">
            ----------------------------------------
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

function formatPlainAmount(value) {
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

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const year =
        date.getFullYear();

    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            date.getSeconds()
        ).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatPaymentMethod(method) {
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

export default ReceiptPrint;