import { Plus, Minus, Trash2 } from "lucide-react";

function CartTable({
                       cart,
                       onIncrease,
                       onDecrease,
                       onRemove,
                   }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border flex-1 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b">
                <h3 className="font-semibold text-lg">
                    Current Sale
                </h3>
                <p className="text-sm text-slate-500">
                    {cart.length} product{cart.length !== 1 ? "s" : ""} in cart
                </p>
            </div>

            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center text-slate-400">
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
                <>
                    {/* Mobile: stacked cards — no horizontal scrolling needed */}
                    <div className="sm:hidden divide-y">

                        {cart.map((item) => {

                            const lineTotal =
                                Number(item.sellingPrice) *
                                Number(item.quantity);

                            const stockLimit =
                                Number(item.quantity) >=
                                Number(item.stockQuantity);

                            return (

                                <div
                                    key={item.barcode}
                                    className="p-4 flex flex-col gap-3"
                                >

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">
                                            <p className="font-medium truncate">
                                                {item.name}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {item.barcode}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemove(item.barcode)
                                            }
                                            className="shrink-0 text-slate-400 hover:text-red-600 transition"
                                            title="Remove product"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-slate-500">
                                            Rs.{" "}
                                            {Number(
                                                item.sellingPrice
                                            ).toLocaleString()}{" "}
                                            each
                                        </span>

                                        <div className="flex items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDecrease(item.barcode)
                                                }
                                                className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-slate-100"
                                            >
                                                <Minus size={15} />
                                            </button>

                                            <span className="w-6 text-center font-semibold">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={stockLimit}
                                                onClick={() =>
                                                    onIncrease(item.barcode)
                                                }
                                                className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={15} />
                                            </button>

                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2 border-t">
                                        <span className="text-slate-500">
                                            Total
                                        </span>
                                        <span className="font-semibold">
                                            Rs. {lineTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Tablet / desktop: original table */}
                    <div className="hidden sm:block overflow-x-auto">
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
                </>
            )}

        </div>
    );
}

export default CartTable;