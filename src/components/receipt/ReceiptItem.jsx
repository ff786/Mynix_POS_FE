function ReceiptItem({ item }) {

    const name = item.name ?? item.productName;

    const unitPrice = Number(
        item.sellingPrice ?? item.unitPrice ?? 0
    );

    const lineTotal = Number(
        item.lineTotal ?? item.quantity * unitPrice
    );

    return (
        <div className="flex justify-between py-2 border-b text-sm">

            <div>
                <p className="font-medium text-slate-900">
                    {name}
                </p>

                <p className="text-slate-500">
                    {item.quantity} × Rs.{" "}
                    {unitPrice.toLocaleString()}
                </p>
            </div>

            <div className="font-medium">
                Rs. {lineTotal.toLocaleString()}
            </div>

        </div>
    );
}

export default ReceiptItem;