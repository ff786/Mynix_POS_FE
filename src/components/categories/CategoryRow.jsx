function CategoryRow({
                         category,
                         onEdit,
                         onDelete,
                     }) {

    return (

        <tr className="border-b hover:bg-slate-50">

            {/* CATEGORY */}

            <td className="px-5 py-4">

                <div>

                    <p className="font-semibold text-slate-900">
                        {category.name}
                    </p>

                    {category.description && (

                        <p className="text-sm text-slate-500 mt-1">
                            {category.description}
                        </p>

                    )}

                </div>

            </td>


            {/* STATUS */}

            <td className="px-5 py-4">

                {category.active ? (

                    <span className="
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        bg-emerald-100
                        text-emerald-700
                        text-xs
                        font-semibold
                    ">
                        Active
                    </span>

                ) : (

                    <span className="
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        bg-slate-100
                        text-slate-500
                        text-xs
                        font-semibold
                    ">
                        Inactive
                    </span>

                )}

            </td>


            {/* PRODUCTS */}

            <td className="px-5 py-4 text-slate-400">

                —

            </td>


            {/* ACTIONS */}

            <td className="px-5 py-4">

                <div className="flex gap-2">

                    <button
                        onClick={() =>
                            onEdit(category)
                        }
                        className="px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm transition-colors"
                    >
                        Edit
                    </button>


                    <button
                        onClick={() =>
                            onDelete(category)
                        }
                        className="px-3.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors"
                    >
                        Delete
                    </button>

                </div>

            </td>

        </tr>

    );

}

export default CategoryRow;