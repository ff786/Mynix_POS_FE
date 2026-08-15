import {
    ReceiptText,
    Search,
} from "lucide-react";

function SalesToolbar({
                          search,
                          setSearch,
                      }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* Heading */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <ReceiptText size={20} className="text-emerald-600" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            Sales History
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Review previous transactions and receipts
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-80">
                    <Search
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search invoice or payment..."
                        className="w-full h-11 border border-slate-200 rounded-xl bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                </div>
            </div>
        </div>
    );
}

export default SalesToolbar;