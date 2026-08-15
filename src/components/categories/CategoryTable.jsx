import CategoryRow from "./CategoryRow";


function CategoryTable({
                           categories,
                           onEdit,
                           onDelete,
                       }) {

    if (categories.length === 0) {

        return (

            <div className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                shadow-sm
                px-6
                py-16
                sm:py-20
                text-center
            ">

                <div className="
                    mx-auto
                    w-16
                    h-16
                    rounded-2xl
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    text-2xl
                    mb-5
                ">
                    📂
                </div>


                <h3 className="
                    text-base
                    sm:text-lg
                    font-semibold
                    text-slate-800
                ">
                    No categories found
                </h3>


                <p className="
                    text-sm
                    text-slate-400
                    mt-1.5
                    max-w-sm
                    mx-auto
                ">
                    Try changing your search or create
                    a new category to get started.
                </p>

            </div>

        );

    }


    return (

        <div>

            {/* ========================= */}
            {/* DESKTOP TABLE              */}
            {/* ========================= */}

            <div className="
                hidden
                md:block
                bg-white
                rounded-2xl
                border
                border-slate-200
                shadow-sm
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                        <tr className="
                            border-b
                            border-slate-200
                            bg-slate-50/80
                        ">

                            <th className="
                                text-left
                                px-6
                                py-4
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Category
                            </th>

                            <th className="
                                text-left
                                px-6
                                py-4
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Status
                            </th>

                            <th className="
                                text-left
                                px-6
                                py-4
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Products
                            </th>

                            <th className="
                                text-right
                                px-6
                                py-4
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Actions
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {categories.map(category => (

                            <CategoryRow
                                key={category.id}
                                category={category}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ========================= */}
            {/* MOBILE CARDS               */}
            {/* ========================= */}

            <div className="
                md:hidden
                space-y-3
            ">

                {categories.map(category => (

                    <CategoryRow
                        key={category.id}
                        category={category}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        mobile
                    />

                ))}

            </div>

        </div>

    );
}

export default CategoryTable;