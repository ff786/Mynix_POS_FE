function ReceiptItem({ item }) {

    const lineTotal =
        Number(item.quantity) *
        Number(item.sellingPrice);

    return (
        <div className="flex justify-between py-3 border-b text-sm">
            <div>
                <p className="font-medium text-slate-900">
                    {item.name}
                </p>
                <p className="text-slate-500">
                    {item.quantity} × Rs.{" "}
                    {Number(item.sellingPrice).toLocaleString()}
                </p>
            </div>
            <div className="font-medium">
                Rs. {lineTotal.toLocaleString()}
            </div>
        </div>
    );
}
export default ReceiptItem;