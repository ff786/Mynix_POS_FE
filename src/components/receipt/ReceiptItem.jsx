function ReceiptItem({
                         item,
                     }) {
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
        <div className="flex justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0">
            <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-900 break-words">
                    {name}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                    {quantity} × Rs.{" "}
                    {unitPrice.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    )}
                </p>
            </div>

            <div className="font-semibold text-sm text-slate-900 whitespace-nowrap">
                Rs.{" "}
                {lineTotal.toLocaleString(
                    undefined,
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