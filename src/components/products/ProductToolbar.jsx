import {
    Plus,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

function ProductToolbar({
                            search,
                            setSearch,
                            onAdd,
                        }) {

    return (
        <div className="mb-6">

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        Products
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage your inventory, pricing and product labels.
                    </p>
                </div>

                {/* Desktop Add */}
                <button
                    type="button"
                    onClick={onAdd}
                    className="
                        hidden sm:flex
                        items-center justify-center gap-2
                        px-4 py-2.5
                        rounded-xl
                        bg-emerald-600
                        hover:bg-emerald-700
                        active:bg-emerald-800
                        text-white
                        font-semibold
                        text-sm
                        shadow-sm
                        transition-all
                        hover:shadow-md
                    "
                >
                    <Plus size={18} />
                    Add Product
                </button>

            </div>

            {/* Search / Actions */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">

                <div className="relative flex-1">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-3.5
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                            pointer-events-none
                        "
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by product name or barcode..."
                        className="
                            w-full
                            h-11
                            pl-10
                            pr-10
                            rounded-xl
                            border border-slate-200
                            bg-white
                            text-sm
                            text-slate-900
                            placeholder:text-slate-400
                            outline-none
                            shadow-sm
                            transition
                            focus:border-emerald-500
                            focus:ring-4
                            focus:ring-emerald-500/10
                        "
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                hover:text-slate-700
                            "
                        >
                            <X size={17} />
                        </button>
                    )}

                </div>

                {/* Mobile Add */}
                <button
                    type="button"
                    onClick={onAdd}
                    className="
                        sm:hidden
                        h-11
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-emerald-600
                        hover:bg-emerald-700
                        text-white
                        font-semibold
                        text-sm
                        shadow-sm
                    "
                >
                    <Plus size={18} />
                    Add Product
                </button>

            </div>

        </div>
    );
}

export default ProductToolbar;