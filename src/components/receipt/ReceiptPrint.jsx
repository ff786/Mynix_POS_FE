function ReceiptPrint({ sale }) {
    if (!sale) return null;

    const items = Array.isArray(sale.items) ? sale.items : [];
    const paymentMethod = sale.paymentMethod || "";
    const isCredit = paymentMethod === "CREDIT";
    const isCheque = paymentMethod === "CHEQUE";
    const isFullyPaid = ["CASH", "CARD", "BANK_DEPOSIT"].includes(paymentMethod);

    const outstanding = toSafeNumber(sale.customerOutstanding);
    const subtotal = toSafeNumber(sale.subtotal);
    const discount = toSafeNumber(sale.discount);
    const deliveryFee = toSafeNumber(sale.deliveryFee);
    const grandTotal = toSafeNumber(sale.grandTotal);

    return (
        <div id="mynix-thermal-receipt" className="w-full bg-white text-black">
            <div className="thermal-header">
                <div className="thermal-brand">MYNIX</div>
                <div className="thermal-tagline">The Signature of Perfection</div>
                <div className="thermal-contact">0778843815</div>
            </div>

            <ThermalDivider />

            <div className="thermal-sale-header">
                <div className="thermal-sale-left">
                    <div><strong>INVOICE</strong></div>
                    <div className="thermal-invoice-number">{safeText(sale.invoiceNumber)}</div>
                </div>
                <div className="thermal-sale-right">
                    <div>{formatDate(sale.createdAt)}</div>
                    <div>{formatPaymentMethod(paymentMethod)}</div>
                </div>
            </div>

            {sale.customerId && (
                <>
                    <ThermalDivider />
                    <div className="thermal-customer">
                        <div className="thermal-customer-title">CUSTOMER</div>
                        <div className="thermal-customer-name">{safeText(sale.customerName, "Customer")}</div>
                        {sale.customerContactNumber && (
                            <div className="thermal-customer-contact">
                                {sanitizeSingleLine(sale.customerContactNumber)}
                            </div>
                        )}
                    </div>
                </>
            )}

            <ThermalDivider />

            <div className="thermal-item-header">
                <span className="col-no">NO</span>
                <span className="col-item">ITEM</span>
                <span className="col-qty">QTY</span>
                <span className="col-price">PRICE</span>
                <span className="col-amount">AMOUNT</span>
            </div>

            <ThermalDivider />

            <div className="thermal-items">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <ThermalItem
                            key={item.id ?? item.barcode ?? `${item.productName}-${index}`}
                            item={item}
                            index={index}
                        />
                    ))
                ) : (
                    <div className="thermal-empty">NO ITEM DETAILS AVAILABLE</div>
                )}
            </div>

            <ThermalDivider />

            <div className="thermal-totals">
                <ThermalAmountRow label="SUB TOTAL" value={subtotal} />

                {discount > 0 && (
                    <ThermalAmountRow label="DISCOUNT" value={discount} negative />
                )}

                {deliveryFee > 0 && (
                    <ThermalAmountRow label="DELIVERY FEE" value={deliveryFee} />
                )}

                <ThermalDivider />

                <ThermalAmountRow label="NET TOTAL" value={grandTotal} strong />

                <div className="thermal-payment-summary">
                    {isFullyPaid && (
                        <>
                            <ThermalAmountRow
                                label={formatPaymentMethod(paymentMethod).toUpperCase()}
                                value={grandTotal}
                            />
                            <ThermalAmountRow label="BALANCE" value={0} />
                        </>
                    )}

                    {(isCredit || isCheque) && (
                        <ThermalAmountRow label="OUTSTANDING" value={outstanding} strong />
                    )}
                </div>
            </div>

            {(isCredit || isCheque) && (
                <>
                    <ThermalDivider />
                    <div className="thermal-payment-notice">
                        <div className="thermal-payment-notice-title">
                            {isCredit ? "CREDIT SALE" : "CHEQUE SALE"}
                        </div>
                        <div>Outstanding: Rs. {formatAmount(outstanding)}</div>
                    </div>
                </>
            )}

            <div className="thermal-footer">
                <ThermalDivider />
                <div className="thermal-footer-thanks">THANK YOU FOR SHOPPING</div>
                <div className="thermal-footer-brand">WITH MYNIX</div>
                <div className="thermal-footer-tagline">The Signature of Perfection</div>
                <div className="thermal-footer-contact">Inquiries: 0778843815</div>
                <div className="thermal-footer-generated">COMPUTER GENERATED RECEIPT</div>
            </div>
        </div>
    );
}

function ThermalItem({ item, index }) {
    const name = sanitizeSingleLine(item?.name ?? item?.productName ?? "Unknown Product");
    const barcode = sanitizeSingleLine(item?.barcode ?? "");
    const unitPrice = toSafeNumber(item?.sellingPrice ?? item?.unitPrice);
    const quantity = toSafeNumber(item?.quantity);
    const lineTotal =
        item?.lineTotal !== null && item?.lineTotal !== undefined
            ? toSafeNumber(item.lineTotal)
            : quantity * unitPrice;

    return (
        <div className="thermal-item">
            <div className="thermal-item-main">
                <span className="thermal-item-number">{index + 1}</span>
                <span className="thermal-item-name" title={name}>{truncateText(name, 42)}</span>
                <span className="thermal-item-qty">{formatQuantity(quantity)}</span>
                <span className="thermal-item-price">{formatPlainAmount(unitPrice)}</span>
                <span className="thermal-item-amount">{formatPlainAmount(lineTotal)}</span>
            </div>

            {barcode && (
                <div className="thermal-item-barcode" title={barcode}>
                    {truncateText(barcode, 28)}
                </div>
            )}
        </div>
    );
}

function ThermalAmountRow({ label, value, negative = false, strong = false }) {
    return (
        <div className={`thermal-amount-row ${strong ? "thermal-amount-row-strong" : ""}`}>
            <span>{safeText(label, "—")}</span>
            <span>{negative ? "- " : ""}Rs. {formatAmount(value)}</span>
        </div>
    );
}

function ThermalDivider() {
    return (
        <div
            className="thermal-divider"
            aria-hidden="true"
        />
    );
}

function toSafeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function formatAmount(value) {
    return toSafeNumber(value).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatPlainAmount(value) {
    return formatAmount(value);
}

function formatQuantity(value) {
    const number = toSafeNumber(value);
    return Number.isInteger(number) ? String(number) : number.toFixed(2);
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
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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

function safeText(value, fallback = "—") {
    if (value === null || value === undefined) return fallback;

    const text = String(value).trim();
    return text || fallback;
}

function sanitizeSingleLine(value) {
    return safeText(value, "")
        .replace(/[\r\n\t]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function truncateText(value, maxLength) {
    const text = sanitizeSingleLine(value);

    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength - 1).trimEnd() + "…";
}

export default ReceiptPrint;