import CategoryRow from "./CategoryRow";

function CategoryTable({
                           categories,
                           onEdit,
                           onDelete,
                       }) {

    return (

        <div className="
            bg-white
            rounded-xl
            shadow-sm
            border
            overflow-hidden
        ">

            <table className="w-full">

                <thead className="bg-slate-100">

                <tr>

                    <th className="text-left px-5 py-4">
                        Category
                    </th>

                    <th className="text-left px-5 py-4">
                        Status
                    </th>

                    <th className="text-left px-5 py-4">
                        Products
                    </th>

                    <th className="text-left px-5 py-4">
                        Actions
                    </th>

                </tr>

                </thead>


                <tbody>

                {categories.length === 0 ? (

                    <tr>

                        <td
                            colSpan="4"
                            className="
                                text-center
                                py-16
                                text-slate-400
                            "
                        >
                            No categories found.
                        </td>

                    </tr>

                ) : (

                    categories.map(category => (

                        <CategoryRow
                            key={category.id}
                            category={category}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />

                    ))

                )}

                </tbody>

            </table>

        </div>

    );

}

export default CategoryTable;