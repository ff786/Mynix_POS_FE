import { useEffect, useState } from "react";
import { Search, UserRound, X } from "lucide-react";
import { searchCustomers } from "@/services/customerApi";
import { toast } from "sonner";

function CustomerSelector({ customer, onSelect, onClear }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setResults(await searchCustomers(query.trim()));
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to search customers."
                );
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (customer) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <UserRound size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">
                            {customer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {customer.contactNumber}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClear}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-3 flex justify-between border-t border-emerald-100 pt-3">
                    <span className="text-xs text-slate-500">
                        Outstanding
                    </span>

                    <span className="text-sm font-bold text-amber-600">
                        Rs.{" "}
                        {Number(customer.outstanding || 0).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-5">
            <div className="mb-3">
                <h3 className="font-semibold">
                    Customer
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                    Search by name or contact number
                </p>
            </div>

            <div className="relative">
                <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search customer..."
                    className="
                        w-full h-11 pl-10 pr-4 rounded-xl
                        border border-slate-200 bg-slate-50
                        text-sm outline-none
                        focus:bg-white
                        focus:border-emerald-400
                        focus:ring-2 focus:ring-emerald-100
                    "
                />
            </div>

            {loading && (
                <p className="text-xs text-center text-slate-400 py-4">
                    Searching...
                </p>
            )}

            {!loading && results.length > 0 && (
                <div className="mt-2 border rounded-xl overflow-hidden divide-y">
                    {results.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                onSelect(item);
                                setQuery("");
                                setResults([]);
                            }}
                            className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50"
                        >
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                <UserRound size={17} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {item.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {item.contactNumber}
                                </p>
                            </div>

                            <span className="text-xs font-semibold">
                                Rs.{" "}
                                {Number(item.outstanding || 0).toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {!loading &&
                query.trim() &&
                results.length === 0 && (
                    <p className="text-xs text-center text-slate-400 py-4">
                        No customer found.
                    </p>
                )}
        </div>
    );
}

export default CustomerSelector;
