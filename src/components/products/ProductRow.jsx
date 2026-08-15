function ProductRow({ product, onEdit, onDelete, onPrintLabel, selected, onSelect }) {

    const isLowStock =
        Number(product.stockQuantity) <= Number(product.minimumStock);

    const isOutOfStock =
        Number(product.stockQuantity) === 0;

    return (

        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            {/*Selections*/}
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelect(product)}
                    className="w-4 h-4 accent-emerald-600"
                />
            </td>

            {/* Image */}
            <td className="px-4 py-4">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                    />
                ) : (
                    <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                        📦
                    </div>
                )}
            </td>

            {/* Product */}
            <td className="px-4 py-4">
                <div>
                    <p className="font-semibold text-slate-900">
                        {product.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Product #{product.id}
                    </p>
                </div>
            </td>


            {/* Barcode */}
            <td className="px-4 py-4">
                <span className="font-mono text-sm text-slate-600">
                    {product.barcode}
                </span>
            </td>

            {/* Category */}
            <td className="px-4 py-4">
                <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    {product.category}
                </span>
            </td>

            {/* Price */}
            <td className="px-4 py-4">
                <span className="font-semibold text-slate-900">
                    Rs. {Number(
                    product.sellingPrice
                ).toLocaleString()}
                </span>
            </td>

            {/* Stock */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    <span
                        className={`font-semibold ${
                            isOutOfStock
                                ? "text-red-600"
                                : isLowStock
                                    ? "text-orange-600"
                                    : "text-slate-700"
                        }`}
                    >
                        {product.stockQuantity}
                    </span>
                    {isOutOfStock ? (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                            Out of Stock
                        </span>
                    ) : isLowStock ? (
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                            Low Stock
                        </span>
                    ) : (
                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                            In Stock
                        </span>
                    )}
                </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onPrintLabel(product)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm transition-colors"
                    >
                        Print Label
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="px-3.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default ProductRow;