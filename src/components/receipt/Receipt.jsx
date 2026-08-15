import ReceiptItem from "./ReceiptItem";

function Receipt({ sale }) {

    if (!sale) return null;

    return (

        <div className="space-y-5">
            <div className="text-center">
                <h2 className="text-2xl font-bold">
                    MYNIX POS
                </h2>
                <p className="text-sm text-slate-500">
                    Business Management System
                </p>
            </div>
            <hr />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Invoice</span>
                    <span>{sale.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span>Date</span>
                    <span>{new Date(sale.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Cashier</span>
                    <span>Admin</span>
                </div>
                <div className="flex justify-between">
                    <span>Payment</span>
                    <span>{sale.paymentMethod}</span>
                </div>
            </div>
            <hr />
            <div>
                {sale.items?.length > 0 ? (
                    sale.items.map(item => (
                        <ReceiptItem
                            key={item.barcode}
                            item={item}
                        />
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">
                        Item details are not available for this historical sale.
                    </p>
                )}
            </div>
            <hr />
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                        Rs. {Number(sale.subtotal).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Discount</span>
                    <span>
                        Rs. {Number(sale.discount).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3">
                    <span>TOTAL</span>
                    <span>
                        Rs. {Number(sale.grandTotal).toLocaleString()}
                    </span>
                </div>
            </div>
            <hr />
            <div className="text-center text-slate-500">
                <p>Thank you for shopping!</p>
                <p>Visit Again ❤️</p>
            </div>
        </div>
    );
}

export default Receipt;