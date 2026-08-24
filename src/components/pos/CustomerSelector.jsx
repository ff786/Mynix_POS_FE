import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Search, User, UserPlus, X } from "lucide-react";
import CustomerCreateModal from "./CustomerCreateModal";
import { searchCustomers } from "@/services/customerApi";

function CustomerSelector({ customer, onSelect, onClear, showError = false }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const inputRef = useRef(null);

    // Search customers.
    useEffect(() => {
        const value = query.trim();

        if (!value) {
            setResults([]);
            setSearching(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setSearching(true);

                const data = await searchCustomers(value);

                setResults(
                    Array.isArray(data)
                        ? data.filter(item => item.active !== false)
                        : []
                );
            } catch (error) {
                console.error("Customer search error:", error);
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    function handleSelect(selectedCustomer) {
        onSelect(selectedCustomer);
        setQuery("");
        setResults([]);
    }

    function handleClear() {
        onClear();
        setQuery("");
        setResults([]);
        inputRef.current?.focus();
    }

    function handleCustomerCreated(newCustomer) {
        handleSelect(newCustomer);
        setCreateOpen(false);
    }

    function handleExistingCustomer(existingCustomer) {
        handleSelect(existingCustomer);
        setCreateOpen(false);
    }

    const outstanding = Number(customer?.outstanding || 0);

    return (
        <>
            <div className={`rounded-xl border bg-white p-4 shadow-sm ${showError && !customer ? "border-red-400 ring-2 ring-red-100" : "border-slate-200"}`}>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900">Customer</h3>

                        {showError && !customer && (
                            <p className="mt-1 text-sm font-medium text-red-600">
                                Please select a customer before completing the sale.
                            </p>
                        )}

                        {!showError || customer ? (
                            <p className="mt-1 text-sm text-slate-500">
                                Select a customer for this sale
                            </p>
                        ) : null}
                    </div>

                    {customer && (
                        <button type="button" onClick={handleClear} aria-label="Clear selected customer" className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                            <X size={17} />
                        </button>
                    )}
                </div>

                {/* Selected customer */}
                {customer ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <User size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate font-semibold text-slate-900">{customer.name}</p>
                                    <Check size={16} className="shrink-0 text-emerald-600" />
                                </div>

                                <p className="text-xs text-slate-500">{customer.contactNumber}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-3">
                            <span className="text-xs text-slate-500">Outstanding</span>

                            <span className={outstanding > 0 ? "text-sm font-semibold text-amber-600" : "text-sm font-semibold text-emerald-600"}>
                                Rs.{" "}
                                {outstanding.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>
                ) : (
                    /* Search */
                    <div className="relative">
                        <div className="relative">
                            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={event => {
                                    const value = event.target.value;
                                    setQuery(value);

                                    if (!value.trim()) setResults([]);
                                }}
                                placeholder="Search name or phone..."
                                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />

                            {searching && (
                                <Loader2 size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />
                            )}
                        </div>

                        {query.trim() && (
                            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                {searching && (
                                    <div className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-slate-400">
                                        <Loader2 size={15} className="animate-spin" />
                                        Searching...
                                    </div>
                                )}

                                {!searching && results.length > 0 && (
                                    <div className="max-h-56 overflow-y-auto">
                                        {results.map(result => (
                                            <button key={result.id} type="button" onClick={() => handleSelect(result)} className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                    <User size={16} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{result.name}</p>
                                                    <p className="text-xs text-slate-500">{result.contactNumber}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {!searching && results.length === 0 && (
                                    <div className="p-4">
                                        <div className="mb-3 text-center">
                                            <p className="text-sm font-medium text-slate-700">No customer found</p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Create a new customer to continue this sale.
                                            </p>
                                        </div>

                                        <button type="button" onClick={() => setCreateOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                                            <UserPlus size={17} />
                                            Create Customer
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {!query.trim() && (
                            <button type="button" onClick={() => setCreateOpen(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700">
                                <UserPlus size={17} />
                                Create New Customer
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Customer modal */}
            <CustomerCreateModal
                open={createOpen}
                initialSearch={query}
                onClose={() => setCreateOpen(false)}
                onCreated={handleCustomerCreated}
                onExistingCustomerSelect={handleExistingCustomer}
            />
        </>
    );
}

export default CustomerSelector;
