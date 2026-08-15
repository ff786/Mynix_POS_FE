import {
    Edit3,
    Trash2,
    Package,
    ChevronRight,
} from "lucide-react";

function CategoryRow({
                         category,
                         onEdit,
                         onDelete,
                         mobile = false,
                     }) {
    /* ========================= */
    /* MOBILE CARD                */
    /* ========================= */

    if (mobile) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 active:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-3">
                    {/* Category info */}
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <Package size={18} className="text-emerald-600" />
                        </div>

                        <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                                {category.name}
                            </p>

                            {category.description ? (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {category.description}
                                </p>
                            ) : (
                                <p className="text-xs text-slate-400 mt-1">
                                    No description
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <StatusBadge active={category.active} />
                </div>

                {/* Bottom information */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Package size={14} />
                        <span>Products</span>
                        <span className="font-semibold text-slate-700">—</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(category)}
                            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition"
                            aria-label="Edit category"
                        >
                            <Edit3 size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(category)}
                            className="w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                            aria-label="Delete category"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ========================= */
    /* DESKTOP TABLE ROW         */
    /* ========================= */

    return (
        <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition">
            {/* Category */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Package size={17} className="text-emerald-600" />
                    </div>

                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                            {category.name}
                        </p>

                        {category.description && (
                            <p className="text-xs text-slate-400 mt-1 max-w-md truncate">
                                {category.description}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-5">
                <StatusBadge active={category.active} />
            </td>

            {/* Products */}
            <td className="px-6 py-5">
                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <Package size={15} />
                    <span>—</span>
                </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition"
                    >
                        <Edit3 size={14} />
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(category)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

function StatusBadge({ active }) {
    return active ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Inactive
        </span>
    );
}

export default CategoryRow;