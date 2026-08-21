function ReceiptItem({ item }) {
    const name =
        item.name ??
        item.productName ??
        "Unknown Product";

    const unitPrice = Number(
        item.sellingPrice ??
        item.unitPrice ??
        0
    );

    const quantity =
        Number(item.quantity) || 0;

    const lineTotal = Number(
        item.lineTotal ??
        quantity * unitPrice
    );

    return (
        <div className="
            mynix-receipt-item
            grid
            grid-cols-[minmax(0,1fr)_auto]
            gap-3
            border-b
            border-slate-100
            px-4
            py-3
            last:border-b-0
        ">
            <div className="
                min-w-0
            ">
                <p className="
                    min-w-0
                    break-words
                    text-[11px]
                    font-bold
                    leading-tight
                    text-slate-900
                ">
                    {name}
                </p>

                <p className="
                    mt-1
                    text-[9px]
                    font-medium
                    leading-tight
                    text-slate-400
                ">
                    {quantity} × Rs.{" "}
                    {unitPrice.toLocaleString(
                        "en-LK",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    )}
                </p>
            </div>

            <div className="
                shrink-0
                self-center
                whitespace-nowrap
                text-[11px]
                font-extrabold
                text-slate-900
            ">
                Rs.{" "}
                {lineTotal.toLocaleString(
                    "en-LK",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }
                )}
            </div>
        </div>
    );
}

export default ReceiptItem;