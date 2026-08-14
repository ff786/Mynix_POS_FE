function CartTable() {
    return (
        <div className="bg-white rounded-xl shadow border flex-1">
            <table className="w-full">
                <thead className="bg-slate-100">
                <tr>
                    <th className="p-4 text-left">Qty</th>
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Total</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td
                        colSpan="4"
                        className="text-center py-20 text-slate-400"
                    >
                        Scan a product to begin sale.
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default CartTable;