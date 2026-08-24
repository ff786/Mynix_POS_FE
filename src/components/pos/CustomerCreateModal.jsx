import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Search, User, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { createCustomer, searchCustomers } from "@/services/customerApi";

function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
}

function isExactPhoneMatch(first, second) {
    const a = normalizePhone(first);
    const b = normalizePhone(second);
    if (!a || !b) return false;
    return a === b;
}

function CustomerCreateModal({ open, initialSearch = "", onClose, onCreated, onExistingCustomerSelect }) {
    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] = useState(initialSearch || "");
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [existingCustomers, setExistingCustomers] = useState([]);
    const [searchError, setSearchError] = useState("");
    const inputRef = useRef(null);
    const requestIdRef = useRef(0);

    // Sync initial search.
    useEffect(() => {
        if (!open) return;

        setContactNumber(initialSearch || "");
        setExistingCustomers([]);
        setSearchError("");
    }, [open, initialSearch]);

    // Search existing customers.
    useEffect(() => {
        if (!open) return;

        const value = contactNumber.trim();
        const digits = normalizePhone(value);

        if (digits.length < 3) {
            setExistingCustomers([]);
            setSearching(false);
            setSearchError("");
            return;
        }

        const timeout = setTimeout(async () => {
            const currentRequest = ++requestIdRef.current;

            try {
                setSearching(true);
                setSearchError("");

                const data = await searchCustomers(value);

                // Ignore stale responses.
                if (currentRequest !== requestIdRef.current) return;

                const activeCustomers = Array.isArray(data)
                    ? data.filter(customer => customer.active !== false)
                    : [];

                setExistingCustomers(activeCustomers);
            } catch (error) {
                if (currentRequest !== requestIdRef.current) return;

                console.error("Existing customer search error:", error);
                setExistingCustomers([]);
                setSearchError("Unable to check existing customers.");
            } finally {
                if (currentRequest === requestIdRef.current) setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [contactNumber, open]);

    const exactMatch = existingCustomers.find(customer =>
        isExactPhoneMatch(customer.contactNumber, contactNumber)
    );

    function handleSubmit(event) {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedContact = contactNumber.trim();

        if (!trimmedName) {
            toast.error("Customer name is required.");
            return;
        }

        if (!trimmedContact) {
            toast.error("Contact number is required.");
            return;
        }

        // Prevent duplicate contacts.
        if (exactMatch) {
            toast.error("This contact number already belongs to an existing customer. Select that customer below.");
            return;
        }

        createNewCustomer(trimmedName, trimmedContact);
    }

    async function createNewCustomer(trimmedName, trimmedContact) {
        try {
            setLoading(true);

            const customer = await createCustomer({
                name: trimmedName,
                contactNumber: trimmedContact,
            });

            toast.success("Customer created successfully.");
            resetForm();
            onCreated(customer);
        } catch (error) {
            console.error("Customer creation error:", error);

            const message = error.response?.data?.message ?? "Unable to create customer.";

            // Handle backend duplicate protection.
            if (message.toLowerCase().includes("already") || message.toLowerCase().includes("exist")) {
                toast.error("This contact number already belongs to a customer. Please select the existing customer.");
            } else {
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    }

    function handleExistingCustomer(selectedCustomer) {
        if (loading) return;

        toast.success(`${selectedCustomer.name} selected.`);
        resetForm();

        if (onExistingCustomerSelect) {
            onExistingCustomerSelect(selectedCustomer);
            return;
        }

        // Keep compatibility with existing callers.
        onCreated(selectedCustomer);
    }

    function handleClose() {
        if (loading) return;

        resetForm();
        onClose();
    }

    function resetForm() {
        setName("");
        setContactNumber("");
        setExistingCustomers([]);
        setSearching(false);
        setSearchError("");
    }

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] ${open ? "flex" : "hidden"}`}>
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <UserPlus size={20} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-semibold text-slate-900">Create Customer</h2>
                            <p className="text-xs text-slate-500">Add this customer to the sale</p>
                        </div>
                    </div>

                    <button type="button" onClick={handleClose} disabled={loading} aria-label="Close customer creation dialog" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 p-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Customer Name
                        </label>

                        <input
                            id="customer-name"
                            type="text"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            placeholder="Enter customer name"
                            autoFocus
                            disabled={loading}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="customer-contact" className="mb-1.5 block text-sm font-medium text-slate-700">
                            Contact Number
                        </label>

                        <div className="relative">
                            <input
                                id="customer-contact"
                                ref={inputRef}
                                type="tel"
                                value={contactNumber}
                                onChange={event => setContactNumber(event.target.value)}
                                placeholder="0771234567"
                                disabled={loading}
                                autoComplete="tel"
                                className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition focus:ring-2 ${exactMatch ? "border-emerald-400 bg-emerald-50/30 focus:border-emerald-500 focus:ring-emerald-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"} disabled:bg-slate-50`}
                            />

                            {searching && (
                                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                                    <Loader2 size={17} className="animate-spin text-slate-400" />
                                </div>
                            )}
                        </div>

                        <p className="mt-1.5 text-xs text-slate-400">
                            We'll automatically check whether this number already belongs to a customer.
                        </p>

                        {contactNumber.trim() && (
                            <div className="mt-2">
                                {searching && (
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                                        <Loader2 size={14} className="animate-spin" />
                                        Checking existing customers...
                                    </div>
                                )}

                                {!searching && searchError && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                                        {searchError}
                                    </div>
                                )}

                                {!searching && !searchError && exactMatch && (
                                    <div className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
                                        <div className="border-b border-emerald-100 px-4 py-2.5">
                                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                                                Existing customer found
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleExistingCustomer(exactMatch)}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-emerald-100/70 active:bg-emerald-100"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                                <User size={17} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-slate-900">
                                                    {exactMatch.name}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {exactMatch.contactNumber}
                                                </p>
                                            </div>

                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                                                <Check size={16} />
                                            </div>
                                        </button>

                                        <div className="border-t border-emerald-100 px-4 py-2.5">
                                            <p className="text-[11px] font-medium leading-5 text-emerald-700">
                                                This number is already registered. Select the customer above to continue the sale.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!searching && !searchError && !exactMatch && existingCustomers.length > 0 && (
                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                                            <Search size={13} className="text-slate-400" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                                                Matching customers
                                            </p>
                                        </div>

                                        <div className="max-h-48 overflow-y-auto">
                                            {existingCustomers.map(customer => (
                                                <button
                                                    key={customer.id}
                                                    type="button"
                                                    onClick={() => handleExistingCustomer(customer)}
                                                    className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                        <User size={15} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-slate-900">
                                                            {customer.name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            {customer.contactNumber}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || Boolean(exactMatch)}
                            className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {loading ? "Creating..." : exactMatch ? "Select Existing Customer" : "Create & Select"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CustomerCreateModal;
