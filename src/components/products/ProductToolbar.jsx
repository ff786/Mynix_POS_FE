import {
    Plus,
    Search,
    X,
} from "lucide-react";

function ProductToolbar({
                            search,
                            setSearch,
                            onAdd,
                            isAdmin = false,
                        }) {

    return (
        <div className="mb-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Products
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                        {isAdmin
                            ? "Manage your inventory, pricing and product labels."
                            : "Browse products, prices, categories and available stock."
                        }
                    </p>

                </div>


                {isAdmin && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="hidden items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] sm:flex"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                )}

            </div>


            <div className="mt-5 flex flex-col gap-3">

                <div className="relative w-full">

                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder={
                            isAdmin
                                ? "Search by product name or barcode..."
                                : "Search product name or barcode..."
                        }
                        autoComplete="off"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-left text-sm text-slate-900 outline-none shadow-sm transition placeholder:text-left placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                        >
                            <X size={17} />
                        </button>
                    )}

                </div>


                {isAdmin && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:hidden"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                )}

            </div>

        </div>
    );
}

export default ProductToolbar;