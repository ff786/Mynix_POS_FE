import {Plus, Minus, Trash2, Package, AlertTriangle,} from "lucide-react";

function CartTable({cart, onIncrease, onDecrease, onRemove,}) {

    const formatMoney = (value) =>
        Number(value || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

    return (
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">

                <div>

                    <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                        Current Sale
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                        {cart.length}{" "}
                        {cart.length === 1
                            ? "product"
                            : "products"}{" "}
                        in cart
                    </p>

                </div>

                {cart.length > 0 && (
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {cart.reduce(
                            (total, item) =>
                                total +
                                Number(
                                    item.quantity || 0
                                ),
                            0
                        )}{" "}
                        items
                    </div>
                )}

            </div>

            {/* Empty */}

            {cart.length === 0 ? (

                <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">

                        <Package
                            size={28}
                            className="text-slate-400"
                        />

                    </div>

                    <p className="mt-4 font-semibold text-slate-700">
                        Your cart is empty
                    </p>

                    <p className="mt-1 max-w-xs text-sm leading-5 text-slate-400">
                        Scan a barcode or search for a
                        product above to start the sale.
                    </p>

                </div>

            ) : (

                <>

                    <div className="divide-y divide-slate-100 overflow-y-auto sm:hidden">

                        {cart.map(item => {

                            const quantity =
                                Number(
                                    item.quantity || 0
                                );

                            const stock =
                                Number(
                                    item.stockQuantity || 0
                                );

                            const price =
                                Number(
                                    item.sellingPrice || 0
                                );

                            const lineTotal =
                                price * quantity;

                            const stockLimit =
                                quantity >= stock;

                            return (
                                <div
                                    key={item.barcode}
                                    className="p-4"
                                >

                                    {/* Product */}

                                    <div className="flex items-start gap-3">

                                        {/* Image */}

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                                            {item.imageUrl ? (
                                                <img
                                                    src={
                                                        item.imageUrl
                                                    }
                                                    alt={
                                                        item.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Package
                                                    size={22}
                                                    className="text-slate-400"
                                                />
                                            )}

                                        </div>

                                        {/* Details */}

                                        <div className="min-w-0 flex-1">

                                            <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 truncate font-mono text-[11px] text-slate-400">
                                                {item.barcode}
                                            </p>

                                            <p className="mt-1.5 text-sm font-medium text-slate-600">
                                                Rs.{" "}
                                                {formatMoney(
                                                    price
                                                )}{" "}
                                                each
                                            </p>

                                        </div>

                                        {/* Remove */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemove(
                                                    item.barcode
                                                )
                                            }
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600 active:bg-red-100"
                                            title="Remove product"
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                    {/* Bottom controls */}

                                    <div className="mt-4 flex items-center justify-between gap-3">

                                        {/* Quantity */}

                                        <div>

                                            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                Quantity
                                            </p>

                                            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDecrease(
                                                            item.barcode
                                                        )
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 active:scale-95"
                                                    aria-label={`Decrease ${item.name} quantity`}
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                                                    {quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        stockLimit
                                                    }
                                                    onClick={() =>
                                                        onIncrease(
                                                            item.barcode
                                                        )
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                                                    aria-label={`Increase ${item.name} quantity`}
                                                >
                                                    <Plus size={16} />
                                                </button>

                                            </div>

                                        </div>

                                        {/* Stock */}

                                        <div className="flex-1 text-center">

                                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                Stock
                                            </p>

                                            <p
                                                className={`mt-1 text-xs font-semibold ${stockLimit ? "text-amber-600" : "text-emerald-600"}`}
                                            >
                                                {stockLimit ? (
                                                    <span className="inline-flex items-center gap-1">
                                                        <AlertTriangle
                                                            size={13}
                                                        />
                                                        Max stock
                                                    </span>
                                                ) : (
                                                    `${stock} available`
                                                )}
                                            </p>

                                        </div>

                                        {/* Total */}

                                        <div className="text-right">

                                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                Total
                                            </p>

                                            <p className="mt-1 text-base font-bold text-slate-900">
                                                Rs.{" "}
                                                {formatMoney(
                                                    lineTotal
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    <div className="hidden flex-1 overflow-auto sm:block">

                        <table className="w-full min-w-[680px]">

                            <thead className="sticky top-0 z-10 bg-slate-50">

                            <tr>

                                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Product
                                </th>

                                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Price
                                </th>

                                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Quantity
                                </th>

                                <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Total
                                </th>

                                <th className="w-14" />

                            </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                            {cart.map(item => {

                                const quantity =
                                    Number(
                                        item.quantity || 0
                                    );

                                const stock =
                                    Number(
                                        item.stockQuantity || 0
                                    );

                                const price =
                                    Number(
                                        item.sellingPrice || 0
                                    );

                                const lineTotal =
                                    price * quantity;

                                const stockLimit =
                                    quantity >= stock;

                                return (
                                    <tr
                                        key={
                                            item.barcode
                                        }
                                        className="transition hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">

                                                    {item.imageUrl ? (
                                                        <img
                                                            src={
                                                                item.imageUrl
                                                            }
                                                            alt={
                                                                item.name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package
                                                            size={18}
                                                            className="text-slate-400"
                                                        />
                                                    )}

                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate font-medium text-slate-900">
                                                        {
                                                            item.name
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 font-mono text-xs text-slate-400">
                                                        {
                                                            item.barcode
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="px-4 py-4 text-center text-sm text-slate-600">
                                            Rs.{" "}
                                            {formatMoney(
                                                price
                                            )}
                                        </td>

                                        <td className="px-4 py-4">

                                            <div className="flex items-center justify-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDecrease(
                                                            item.barcode
                                                        )
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                                >
                                                    <Minus size={15} />
                                                </button>

                                                <span className="w-8 text-center text-sm font-semibold text-slate-900">
                                                        {quantity}
                                                    </span>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        stockLimit
                                                    }
                                                    onClick={() =>
                                                        onIncrease(
                                                            item.barcode
                                                        )
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    <Plus size={15} />
                                                </button>

                                            </div>

                                            {stockLimit && (
                                                <p className="mt-1 text-center text-[10px] font-medium text-amber-600">
                                                    Max stock
                                                </p>
                                            )}

                                        </td>

                                        <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                                            Rs.{" "}
                                            {formatMoney(
                                                lineTotal
                                            )}
                                        </td>

                                        <td className="px-4 py-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRemove(
                                                        item.barcode
                                                    )
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                title="Remove product"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <Trash2 size={17} />
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