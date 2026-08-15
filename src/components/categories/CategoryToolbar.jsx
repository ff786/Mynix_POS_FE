function CategoryToolbar({
                             search,
                             setSearch,
                             onAdd,
                         }) {

    return (

        <div className="
            bg-white
            rounded-xl
            border
            shadow-sm
            p-5
            flex
            items-center
            justify-between
            gap-4
        ">

            <div>

                <h2 className="text-xl font-semibold">
                    Categories
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Manage your product categories
                </p>

            </div>


            <div className="flex items-center gap-3">

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search categories..."
                    className="
                        w-64
                        border
                        rounded-lg
                        px-4
                        py-2.5
                        outline-none
                        focus:ring-2
                        focus:ring-emerald-500
                    "
                />


                <button
                    onClick={onAdd}
                    className="
                        bg-emerald-600
                        hover:bg-emerald-700
                        text-white
                        px-5
                        py-2.5
                        rounded-lg
                        font-medium
                        transition
                    "
                >
                    + Add Category
                </button>

            </div>

        </div>
    );
}

export default CategoryToolbar;