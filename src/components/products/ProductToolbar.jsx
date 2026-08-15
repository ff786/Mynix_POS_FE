import { Plus, Search } from "lucide-react";

function ProductToolbar({ search, setSearch, onAdd }) {
    return (
        <div className="flex items-center justify-between mb-6">

            <h1 className="text-3xl font-bold">
                Products
            </h1>

            <div className="flex items-center gap-4">

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-72"
                    />

                </div>

                <button
                    onClick={onAdd}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Product
                </button>

            </div>

        </div>
    );
}

export default ProductToolbar;