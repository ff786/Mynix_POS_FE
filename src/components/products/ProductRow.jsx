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


    /* ================= MOBILE ================= */

    if (mobile) {

        return (
            <div className="
                bg-white
                border border-slate-200
                rounded-2xl
                shadow-sm
                overflow-hidden
            ">

                {/* Top */}
                <div className="p-4">

                    <div className="flex items-start gap-3">

                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => onSelect(product)}
                            className="
                                mt-1
                                w-4 h-4
                                accent-emerald-600
                                cursor-pointer
                            "
                        />

                        {/* Image */}
                        <div className="shrink-0">

                            {product.imageUrl ? (

                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="
                                        w-16 h-16
                                        rounded-xl
                                        object-cover
                                        border border-slate-200
                                    "
                                />

                            ) : (

                                <div className="
                                    w-16 h-16
                                    rounded-xl
                                    bg-slate-100
                                    flex
                                    items-center
                                    justify-center
                                    text-xl
                                ">
                                    <Package
                                        size={24}
                                        className="text-slate-400"
                                    />
                                </div>

                            )}

                        </div>

                        {/* Product info */}
                        <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                                <div className="min-w-0">

                                    <h3 className="
                                        font-semibold
                                        text-slate-900
                                        truncate
                                    ">
                                        {product.name}
                                    </h3>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                        mt-1
                                    ">
                                        #{product.id}
                                    </p>

                                </div>

                                <span className="
                                    shrink-0
                                    text-sm
                                    font-bold
                                    text-slate-900
                                ">
                                    Rs. {Number(
                                    product.sellingPrice
                                ).toLocaleString()}
                                </span>

                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-3">

                                <span className="
                                    px-2.5 py-1
                                    rounded-full
                                    bg-slate-100
                                    text-slate-600
                                    text-xs
                                    font-medium
                                ">
                                    {product.category || "Uncategorized"}
                                </span>

                                <span className="
                                    font-mono
                                    text-xs
                                    text-slate-500
                                ">
                                    {product.barcode}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Stock */}
                    <div className="
                        flex
                        items-center
                        justify-between
                        mt-4
                        pt-4
                        border-t
                        border-slate-100
                    ">

                        <div>

                            <p className="text-xs text-slate-400">
                                Stock
                            </p>

                            <p className={`
                                text-lg
                                font-bold
                                mt-0.5
                                ${
                                isOutOfStock
                                    ? "text-red-600"
                                    : isLowStock
                                        ? "text-orange-600"
                                        : "text-slate-800"
                            }
                            `}>
                                {stock}
                            </p>

                        </div>

                        <span className={`
                            inline-flex
                            items-center
                            px-2.5 py-1
                            rounded-full
                            border
                            text-xs
                            font-semibold
                            ${stockStatus.className}
                        `}>
                            {stockStatus.label}
                        </span>

                    </div>

                </div>

                {/* Actions */}
                <div className="
                    grid
                    grid-cols-3
                    border-t
                    border-slate-100
                ">

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

            </div>
        );
    }


    /* ================= DESKTOP ================= */

    return (

        <tr className="
            border-b
            border-slate-100
            last:border-b-0
            hover:bg-slate-50/70
            transition-colors
        ">

            {/* Selection */}
            <td className="px-4 py-4">

                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelect(product)}
                    className="
                        w-4 h-4
                        accent-emerald-600
                        cursor-pointer
                    "
                />

            </td>


            {/* Product */}
            <td className="px-4 py-4">

                <div className="flex items-center gap-3">

                    {product.imageUrl ? (

                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="
                                w-11 h-11
                                rounded-xl
                                object-cover
                                border border-slate-200
                            "
                        />

                    ) : (

                        <div className="
                            w-11 h-11
                            rounded-xl
                            bg-slate-100
                            flex
                            items-center
                            justify-center
                        ">
                            <Package
                                size={19}
                                className="text-slate-400"
                            />
                        </div>

                    )}

                    <div className="min-w-0">

                        <p className="
                            font-semibold
                            text-slate-900
                            truncate
                            max-w-[220px]
                        ">
                            {product.name}
                        </p>

                        <p className="
                            text-xs
                            text-slate-400
                            mt-0.5
                        ">
                            Product #{product.id}
                        </p>

                    </div>

                </div>

            </td>


            {/* Barcode */}
            <td className="px-4 py-4">

                <span className="
                    inline-flex
                    px-2.5 py-1
                    rounded-lg
                    bg-slate-50
                    border border-slate-100
                    font-mono
                    text-xs
                    text-slate-600
                ">
                    {product.barcode}
                </span>

            </td>


            {/* Category */}
            <td className="px-4 py-4">

                <span className="
                    inline-flex
                    px-2.5 py-1
                    rounded-full
                    bg-slate-100
                    text-slate-600
                    text-xs
                    font-medium
                ">
                    {product.category || "Uncategorized"}
                </span>

            </td>


            {/* Price */}
            <td className="px-4 py-4">

                <span className="
                    font-semibold
                    text-slate-900
                    whitespace-nowrap
                ">
                    Rs. {Number(
                    product.sellingPrice
                ).toLocaleString()}
                </span>

            </td>


            {/* Stock */}
            <td className="px-4 py-4">

                <div className="flex flex-col gap-1.5">

                    <span className={`
                        font-bold
                        ${
                        isOutOfStock
                            ? "text-red-600"
                            : isLowStock
                                ? "text-orange-600"
                                : "text-slate-700"
                    }
                    `}>
                        {stock}
                    </span>

                    <span className={`
                        w-fit
                        px-2
                        py-0.5
                        rounded-full
                        border
                        text-[11px]
                        font-semibold
                        ${stockStatus.className}
                    `}>
                        {stockStatus.label}
                    </span>

                </div>

            </td>


            {/* Actions */}
            <td className="px-4 py-4">

                <div className="flex justify-end items-center gap-2">

                    <button
                        type="button"
                        onClick={() => onEdit(product)}
                        title="Edit product"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            w-9 h-9
                            rounded-lg
                            bg-emerald-50
                            text-emerald-700
                            hover:bg-emerald-100
                            transition
                        "
                    >
                        <Edit3 size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onPrintLabel(product)}
                        title="Print label"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            w-9 h-9
                            rounded-lg
                            bg-slate-100
                            text-slate-700
                            hover:bg-slate-200
                            transition
                        "
                    >
                        <Printer size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(product)}
                        title="Delete product"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            w-9 h-9
                            rounded-lg
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                            transition
                        "
                    >
                        <Trash2 size={16} />
                    </button>

                </div>

            </td>

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
            className={`
                flex
                items-center
                justify-center
                gap-2
                py-3
                text-xs
                font-semibold
                transition-colors
                ${
                danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-50"
            }
            `}
        >
            <Icon size={15} />
            {label}
            <ChevronRight
                size={13}
                className="text-slate-300"
            />
        </button>
    );
}

export default ProductRow;