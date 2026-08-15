import { Search } from "lucide-react";

function SalesToolbar({ search, setSearch }) {

    return (
        <div className="bg-white border rounded-xl p-5 mb-6">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-xl font-semibold">
                        Sales History
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        View and manage previous transactions
                    </p>
                </div>

                <div className="relative w-80">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search invoice number..."
                        className="w-full border rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                </div>

            </div>

        </div>
    );
}

export default SalesToolbar;