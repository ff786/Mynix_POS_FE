import {
    Edit3,
    Printer,
    Trash2,
    Package,
    ChevronRight,
} from "lucide-react";

function ProductRow({
                        product,
                        onEdit,
                        onDelete,
                        onPrintLabel,
                        selected,
                        onSelect,
                        mobile = false,
                        isAdmin = false,
                    }) {
    const stock = Number(product.stockQuantity) || 0;
    const minimumStock = Number(product.minimumStock) || 0;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock <= minimumStock;

    const stockStatus = isOutOfStock
        ? {
            label: "Out of Stock",
            className: "bg-red-50 text-red-700 border-red-100",
        }
        : isLowStock
            ? {
                label: "Low Stock",
                className: "bg-orange-50 text-orange-700 border-orange-100",
            }
            : {
                label: "In Stock",
                className: "bg-emerald-50 text-emerald-700 border-emerald-100",
            };

    /*
     * MOBILE
     */

    if (mobile) {
        return (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        {isAdmin && (
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => onSelect(product)}
                                className="mt-1 h-4 w-4 accent-emerald-600"
                            />
                        )}

                        {/* Product image */}

                        <div className="shrink-0">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
                                    <Package size={23} className="text-slate-400" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="truncate font-semibold text-slate-900">
                                        {product.name}
                                    </h3>

                                    <p className="mt-1 font-mono text-xs text-slate-400">
                                        {product.barcode}
                                    </p>
                                </div>

                                <span className="shrink-0 text-sm font-bold text-slate-900">
                                    Rs. {Number(product.sellingPrice).toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                    {product.category || "Uncategorized"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stock */}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div>
                            <p className="text-xs text-slate-400">
                                Available Stock
                            </p>

                            <p
                                className={`mt-0.5 text-lg font-bold ${
                                    isOutOfStock
                                        ? "text-red-600"
                                        : isLowStock
                                            ? "text-orange-600"
                                            : "text-slate-800"
                                }`}
                            >
                                {stock}
                            </p>
                        </div>

                        <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stockStatus.className}`}
                        >
                            {stockStatus.label}
                        </span>
                    </div>
                </div>

                {/* ADMIN ACTIONS ONLY */}

                {isAdmin && (
                    <div className="grid grid-cols-3 border-t border-slate-100">
                        <ActionButton
                            icon={Edit3}
                            label="Edit"
                            onClick={() => onEdit(product)}
                        />

                        <ActionButton
                            icon={Printer}
                            label="Label"
                            onClick={() => onPrintLabel(product)}
                        />

                        <ActionButton
                            icon={Trash2}
                            label="Delete"
                            danger
                            onClick={() => onDelete(product)}
                        />
                    </div>
                )}
            </div>
        );
    }

    /*
     * DESKTOP
     */

    return (
        <tr className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70">
            {isAdmin && (
                <td className="px-4 py-4">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onSelect(product)}
                        className="h-4 w-4 cursor-pointer accent-emerald-600"
                    />
                </td>
            )}

            {/* Product */}

            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-11 w-11 rounded-xl border border-slate-200 object-cover"
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                            <Package size={19} className="text-slate-400" />
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="max-w-[220px] truncate font-semibold text-slate-900">
                            {product.name}
                        </p>
                    </div>
                </div>
            </td>

            {/* Barcode */}

            <td className="px-4 py-4">
                <span className="inline-flex rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600">
                    {product.barcode}
                </span>
            </td>

            {/* Category */}

            <td className="px-4 py-4">
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {product.category || "Uncategorized"}
                </span>
            </td>

            {/* Selling Price */}

            <td className="whitespace-nowrap px-4 py-4">
                <span className="font-semibold text-slate-900">
                    Rs. {Number(product.sellingPrice).toLocaleString()}
                </span>
            </td>

            {/* Stock */}

            <td className="px-4 py-4">
                <div className="flex flex-col gap-1.5">
                    <span
                        className={`font-bold ${
                            isOutOfStock
                                ? "text-red-600"
                                : isLowStock
                                    ? "text-orange-600"
                                    : "text-slate-700"
                        }`}
                    >
                        {stock}
                    </span>

                    <span
                        className={`w-fit rounded-full border px-2 py-0.5 text-[11px] font-semibold ${stockStatus.className}`}
                    >
                        {stockStatus.label}
                    </span>
                </div>
            </td>

            {/* ADMIN ACTIONS */}

            {isAdmin && (
                <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(product)}
                            title="Edit product"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                        >
                            <Edit3 size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => onPrintLabel(product)}
                            title="Print label"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                        >
                            <Printer size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(product)}
                            title="Delete product"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            )}
        </tr>
    );
}

function ActionButton({
                          icon: Icon,
                          label,
                          onClick,
                          danger = false,
                      }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors ${
                danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-50"
            }`}
        >
            <Icon size={15} />
            {label}
            <ChevronRight size={13} className="text-slate-300" />
        </button>
    );
}

export default ProductRow;