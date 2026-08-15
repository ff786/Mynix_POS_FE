import { Plus, Minus, Trash2 } from "lucide-react";

function CartTable({
                       cart,
                       onIncrease,
                       onDecrease,
                       onRemove,
                   }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border flex-1 overflow-hidden">

            <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-lg">
                    Current Sale
                </h3>

                <p className="text-sm text-slate-500">
                    {cart.length} product{cart.length !== 1 ? "s" : ""} in cart
                </p>
            </div>

            {cart.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-24 text-slate-400">

                    <div className="text-4xl mb-3">
                        🛒
                    </div>

                    <p className="font-medium">
                        Cart is empty
                    </p>

                    <p className="text-sm mt-1">
                        Scan a product to begin the sale.
                    </p>

                </div>

            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                        <tr>

                            <th className="text-left px-6 py-3 text-xs uppercase text-slate-500">
                                Product
                            </th>

                            <th className="text-center px-4 py-3 text-xs uppercase text-slate-500">
                                Price
                            </th>

                            <th className="text-center px-4 py-3 text-xs uppercase text-slate-500">
                                Quantity
                            </th>

                            <th className="text-right px-6 py-3 text-xs uppercase text-slate-500">
                                Total
                            </th>

                            <th className="w-12"></th>

                        </tr>

                        </thead>

                        <tbody>

                        {cart.map((item) => {

                            const lineTotal =
                                Number(item.sellingPrice) *
                                Number(item.quantity);

                            const stockLimit =
                                Number(item.quantity) >=
                                Number(item.stockQuantity);

                            return (

                                <tr
                                    key={item.barcode}
                                    className="border-t hover:bg-slate-50"
                                >

                                    <td className="px-6 py-4">

                                        <div>
                                            <p className="font-medium">
                                                {item.name}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {item.barcode}
                                            </p>
                                        </div>

                                    </td>

                                    <td className="px-4 py-4 text-center">

                                        Rs.{" "}
                                        {Number(
                                            item.sellingPrice
                                        ).toLocaleString()}

                                    </td>

                                    <td className="px-4 py-4">

                                        <div className="flex items-center justify-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDecrease(item.barcode)
                                                }
                                                className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-slate-100"
                                            >
                                                <Minus size={15} />
                                            </button>

                                            <span className="w-8 text-center font-semibold">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={stockLimit}
                                                onClick={() =>
                                                    onIncrease(item.barcode)
                                                }
                                                className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={15} />
                                            </button>

                                        </div>

                                    </td>

                                    <td className="px-6 py-4 text-right font-semibold">

                                        Rs.{" "}
                                        {lineTotal.toLocaleString()}

                                    </td>

                                    <td className="px-4 py-4">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemove(item.barcode)
                                            }
                                            className="text-slate-400 hover:text-red-600 transition"
                                            title="Remove product"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </td>

                                </tr>

                            );

                        })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default CartTable;