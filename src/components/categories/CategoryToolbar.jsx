import {
    Plus,
    Search,
} from "lucide-react";

function CategoryToolbar({
                             search,
                             setSearch,
                             onAdd,
                         }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* Heading */}
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                    C
                                </span>
                            </div>
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                Categories
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Organize and manage your product categories
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search + Add */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-72 lg:w-80">
                        <Search
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full h-11 border border-slate-200 rounded-xl bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                    </div>

                    {/* Add */}
                    <button
                        type="button"
                        onClick={onAdd}
                        className="w-full sm:w-auto h-11 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition whitespace-nowrap"
                    >
                        <Plus size={17} />
                        Add Category
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryToolbar;