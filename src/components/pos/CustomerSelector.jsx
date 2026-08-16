import { useEffect, useRef, useState } from "react";
import {
    Search,
    User,
    UserPlus,
    X,
    Check,
} from "lucide-react";

import CustomerCreateModal from "./CustomerCreateModal";
import { searchCustomers } from "@/services/customerApi";

function CustomerSelector({
                              customer,
                              onSelect,
                              onClear,
                          }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const [searching, setSearching] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        const value = query.trim();

        if (!value) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(
            async () => {
                try {
                    setSearching(true);

                    const data =
                        await searchCustomers(value);

                    setResults(
                        Array.isArray(data)
                            ? data.filter(
                                item => item.active !== false
                            )
                            : []
                    );
                } catch {
                    setResults([]);
                } finally {
                    setSearching(false);
                }
            },
            300
        );

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
        onSelect(newCustomer);

        setQuery("");
        setResults([]);

        setCreateOpen(false);
    }

    return (
        <>
            <div className="rounded-xl border bg-white p-4 shadow-sm">

                <div className="mb-4 flex items-center justify-between">

                    <div>
                        <h3 className="font-semibold text-lg">
                            Customer
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Select a customer for this sale
                        </p>
                    </div>

                    {customer && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={17} />
                        </button>
                    )}

                </div>

                {/* SELECTED CUSTOMER */}
                {customer ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <User size={19} />
                            </div>

                            <div className="min-w-0 flex-1">

                                <div className="flex items-center gap-2">

                                    <p className="truncate font-semibold text-slate-900">
                                        {customer.name}
                                    </p>

                                    <Check
                                        size={16}
                                        className="shrink-0 text-emerald-600"
                                    />

                                </div>

                                <p className="text-xs text-slate-500">
                                    {customer.contactNumber}
                                </p>

                            </div>

                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-3">

                            <span className="text-xs text-slate-500">
                                Outstanding
                            </span>

                            <span
                                className={
                                    Number(
                                        customer.outstanding || 0
                                    ) > 0
                                        ? "text-sm font-semibold text-amber-600"
                                        : "text-sm font-semibold text-emerald-600"
                                }
                            >
                                Rs.{" "}
                                {Number(
                                    customer.outstanding || 0
                                ).toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </span>

                        </div>

                    </div>
                ) : (
                    <div className="relative">

                        <div className="relative">

                            <Search
                                size={17}
                                className="
                                    absolute
                                    left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={event =>
                                    setQuery(
                                        event.target.value
                                    )
                                }
                                placeholder="Search name or phone..."
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    py-3
                                    pl-10
                                    pr-4
                                    text-sm
                                    outline-none
                                    focus:border-emerald-500
                                    focus:ring-2
                                    focus:ring-emerald-100
                                "
                            />

                        </div>

                        {/* RESULTS */}
                        {query.trim() && (
                            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

                                {searching && (
                                    <div className="px-4 py-4 text-center text-sm text-slate-400">
                                        Searching...
                                    </div>
                                )}

                                {!searching &&
                                    results.length > 0 && (
                                        <div className="max-h-56 overflow-y-auto">

                                            {results.map(
                                                result => (
                                                    <button
                                                        type="button"
                                                        key={
                                                            result.id
                                                        }
                                                        onClick={() =>
                                                            handleSelect(
                                                                result
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            w-full
                                                            items-center
                                                            gap-3
                                                            border-b
                                                            border-slate-100
                                                            px-4
                                                            py-3
                                                            text-left
                                                            last:border-b-0
                                                            hover:bg-slate-50
                                                        "
                                                    >
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                            <User
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">

                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {
                                                                    result.name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {
                                                                    result.contactNumber
                                                                }
                                                            </p>

                                                        </div>
                                                    </button>
                                                )
                                            )}

                                        </div>
                                    )}

                                {!searching &&
                                    results.length ===
                                    0 && (
                                        <div className="p-4">

                                            <div className="mb-3 text-center">

                                                <p className="text-sm font-medium text-slate-700">
                                                    No customer found
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Create a new customer
                                                    to continue this sale.
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCreateOpen(
                                                        true
                                                    )
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    bg-emerald-600
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    hover:bg-emerald-700
                                                "
                                            >
                                                <UserPlus
                                                    size={17}
                                                />

                                                Create Customer
                                            </button>

                                        </div>
                                    )}
                            </div>
                        )}

                        {/* QUICK CREATE */}
                        {!query.trim() && (
                            <button
                                type="button"
                                onClick={() =>
                                    setCreateOpen(true)
                                }
                                className="
                                    mt-3
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                    hover:border-emerald-400
                                    hover:bg-emerald-50
                                    hover:text-emerald-700
                                "
                            >
                                <UserPlus size={17} />
                                Create New Customer
                            </button>
                        )}

                    </div>
                )}

            </div>

            <CustomerCreateModal
                open={createOpen}
                initialSearch={query}
                onClose={() =>
                    setCreateOpen(false)
                }
                onCreated={
                    handleCustomerCreated
                }
            />
        </>
    );
}

export default CustomerSelector;