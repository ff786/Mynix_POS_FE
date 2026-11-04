import { useEffect, useMemo, useState } from "react";
import { Pencil, X, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

function EditSaleModal({open, sale, onClose, onSave,}) {

    const [form, setForm] = useState({
        discount: "",
        deliveryFee: "",
        paymentMethod: "CASH",
        items: [],
    });

    const [original, setOriginal] = useState(null);
    const [saving, setSaving] = useState(false);

    /*
     * Load sale into the form whenever
     * the selected sale changes.
     */
    useEffect(() => {
        if (!sale) {
            return;
        }

        const initialForm = {
            discount: sale.discount ?? 0,
            deliveryFee: sale.deliveryFee ?? 0,
            paymentMethod:
                sale.paymentMethod || "CASH",
            items: (sale.items || []).map((item) => ({
                id: item.id,
                productName: item.productName || "",
                barcode: item.barcode || "",
                quantity: item.quantity ?? 1,
                unitPrice: item.unitPrice ?? 0,
            })),
        };

        setForm(initialForm);
        setOriginal(JSON.stringify(initialForm));
    }, [sale]);

    /*
     * Check if values have changed.
     */
    const hasChanges = useMemo(() => {
        if (!original) return false;
        return original !== JSON.stringify(form);
    }, [form, original]);

    /*
     * Calculate preview totals.
     */
    const totals = useMemo(() => {
        const subtotal = form.items.reduce(
            (total, item) => {
                const quantity =
                    Number(item.quantity) || 0;
                const unitPrice =
                    Number(item.unitPrice) || 0;
                return total + quantity * unitPrice;
            },
            0
        );

        const discount =
            Number(form.discount) || 0;
        const deliveryFee =
            Number(form.deliveryFee) || 0;

        const grandTotal = Math.max(
            0,
            subtotal - discount + deliveryFee
        );

        return {
            subtotal,
            discount,
            deliveryFee,
            grandTotal,
        };
    }, [form.items, form.discount, form.deliveryFee]);

    /*
     * Get original totals for comparison.
     */
    const originalTotals = useMemo(() => {
        if (!original) return null;

        const parsed = JSON.parse(original);
        const subtotal = parsed.items.reduce(
            (total, item) => {
                const quantity =
                    Number(item.quantity) || 0;
                const unitPrice =
                    Number(item.unitPrice) || 0;
                return total + quantity * unitPrice;
            },
            0
        );

        const discount =
            Number(parsed.discount) || 0;
        const deliveryFee =
            Number(parsed.deliveryFee) || 0;

        const grandTotal = Math.max(
            0,
            subtotal - discount + deliveryFee
        );

        return { subtotal, discount, deliveryFee, grandTotal };
    }, [original]);

    function handleRemoveItem(itemId) {
        setForm((current) => ({
            ...current,
            items: current.items.filter(
                (item) => item.id !== itemId
            ),
        }));
    }

    if (!open || !sale) {
        return null;
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleItemChange(itemId, field, value) {
        setForm((current) => ({
            ...current,
            items: current.items.map((item) =>
                item.id === itemId
                    ? { ...item, [field]: value }
                    : item
            ),
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const discount =
            Number(form.discount || 0);
        const deliveryFee =
            Number(form.deliveryFee || 0);

        if (discount < 0) {
            toast.error(
                "Discount cannot be negative."
            );
            return;
        }

        if (deliveryFee < 0) {
            toast.error(
                "Delivery fee cannot be negative."
            );
            return;
        }

        if (form.items.length === 0) {
            toast.error(
                "A sale must contain at least one product."
            );
            return;
        }

        for (const item of form.items) {
            const quantity = Number(item.quantity);
            const unitPrice = Number(item.unitPrice);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                toast.error(
                    `Invalid quantity for ${item.productName}.`
                );
                return;
            }

            if (
                Number.isNaN(unitPrice) ||
                unitPrice < 0
            ) {
                toast.error(
                    `Invalid price for ${item.productName}.`
                );
                return;
            }

            if (!item.id) {
                toast.error(
                    `Missing item ID for ${item.productName}.`
                );
                return;
            }
        }

        try {
            setSaving(true);

            const payload = {
                discount,
                deliveryFee,
                paymentMethod: form.paymentMethod,
                items: form.items.map((item) => ({
                    id: item.id,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice),
                })),
            };

            await onSave(sale.invoiceNumber, payload);
            onClose();
        } catch (error) {
            // Parent handles the error toast
        } finally {
            setSaving(false);
        }
    }

    const grandTotalChanged =
        originalTotals &&
        totals.grandTotal !== originalTotals.grandTotal;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    if (!saving) {
                        onClose();
                    }
                }
            }}
        >
            <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh]">

                {/* FIXED HEADER */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:h-10 sm:w-10">
                            <Pencil
                                size={18}
                                className="text-blue-600"
                            />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                                Edit Sale
                            </h2>
                            <p className="truncate font-mono text-xs text-slate-400">
                                {sale.invoiceNumber}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 sm:h-10 sm:w-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* SCROLLABLE BODY */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                        <div className="space-y-4 sm:space-y-6">

                            {/* INVOICE & CUSTOMER */}
                            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-5">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                            Invoice #
                                        </p>
                                        <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                                            {sale.invoiceNumber}
                                        </p>
                                    </div>
                                    <div className="border-t border-slate-200/50" />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                            Customer
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {sale.customerName ||
                                                "Walk-in Customer"}
                                        </p>
                                        {sale.customerContactNumber && (
                                            <p className="mt-1 text-xs text-slate-600">
                                                {
                                                    sale.customerContactNumber
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SALE ITEMS */}
                            <div>
                                <div className="mb-3 flex items-baseline justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                                        Sale Items
                                    </label>
                                    <span className="text-xs text-slate-400">
                                        {form.items.length}{" "}
                                        item{form.items.length !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {form.items.map((item) => {
                                        const quantity =
                                            Number(
                                                item.quantity
                                            ) || 0;
                                        const unitPrice =
                                            Number(
                                                item.unitPrice
                                            ) || 0;
                                        const lineTotal =
                                            quantity * unitPrice;

                                        return (
                                            <div
                                                key={item.id}
                                                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">

                                                    <div className="min-w-0">
                                                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                                                            {item.productName}
                                                        </p>

                                                        {item.barcode && (
                                                            <p className="mt-1 font-mono text-xs text-slate-500">
                                                                {item.barcode}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveItem(item.id)
                                                        }
                                                        disabled={saving}
                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        title="Remove product"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>

                                                <div className="p-4 sm:p-4">
                                                    <div className="space-y-3">
                                                        {/* MOBILE: STACKED */}
                                                        <div className="block space-y-3 sm:hidden">
                                                            <div>
                                                                <label className="mb-2 block text-xs font-semibold text-slate-600">
                                                                    Qty
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    step="1"
                                                                    value={
                                                                        item.quantity
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleItemChange(
                                                                            item.id,
                                                                            "quantity",
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        saving
                                                                    }
                                                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-2 block text-xs font-semibold text-slate-600">
                                                                    Unit Price
                                                                </label>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                                                                        Rs.
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.01"
                                                                        value={
                                                                            item.unitPrice
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            handleItemChange(
                                                                                item.id,
                                                                                "unitPrice",
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            saving
                                                                        }
                                                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                                                                <span className="text-xs font-semibold text-slate-600">
                                                                    Line Total
                                                                </span>
                                                                <span className="text-base font-bold text-emerald-700">
                                                                    Rs.{" "}
                                                                    {lineTotal.toLocaleString(
                                                                        "en-LK",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* DESKTOP: GRID */}
                                                        <div className="hidden gap-3 sm:grid sm:grid-cols-3">
                                                            <div>
                                                                <label className="mb-2 block text-xs font-semibold text-slate-600">
                                                                    Quantity
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    step="1"
                                                                    value={
                                                                        item.quantity
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleItemChange(
                                                                            item.id,
                                                                            "quantity",
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        saving
                                                                    }
                                                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="mb-2 block text-xs font-semibold text-slate-600">
                                                                    Unit Price
                                                                </label>
                                                                <div className="relative">
                                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                                                                        Rs.
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.01"
                                                                        value={
                                                                            item.unitPrice
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            handleItemChange(
                                                                                item.id,
                                                                                "unitPrice",
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            saving
                                                                        }
                                                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="mb-2 block text-xs font-semibold text-slate-600">
                                                                    Line Total
                                                                </label>
                                                                <div className="flex h-11 items-center justify-between rounded-xl bg-emerald-50 px-3 font-semibold text-emerald-700">
                                                                    <span className="text-xs">
                                                                        Rs.
                                                                    </span>
                                                                    <span>
                                                                        {lineTotal.toLocaleString(
                                                                            "en-LK",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* PAYMENT METHOD */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-600">
                                    Payment Method
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={form.paymentMethod}
                                    onChange={handleChange}
                                    disabled={saving || form.paymentMethod === "ONLINE"}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11"
                                >
                                    <option value="CASH">
                                        Cash
                                    </option>
                                    <option value="CARD">
                                        Card
                                    </option>
                                    <option value="BANK_DEPOSIT">
                                        Bank Deposit
                                    </option>
                                    <option value="CREDIT">
                                        Credit
                                    </option>
                                    <option value="CHEQUE">
                                        Cheque
                                    </option>
                                    {/* Website payments: shown for those sales, never selectable otherwise. */}
                                    {form.paymentMethod === "ONLINE" && (
                                        <option value="ONLINE">
                                            Online (OnePay)
                                        </option>
                                    )}
                                </select>
                            </div>

                            {/* DISCOUNT & DELIVERY */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <MoneyField
                                    label="Discount"
                                    name="discount"
                                    value={form.discount}
                                    onChange={handleChange}
                                    disabled={saving}
                                />
                                <MoneyField
                                    label="Delivery Fee"
                                    name="deliveryFee"
                                    value={form.deliveryFee}
                                    onChange={handleChange}
                                    disabled={saving}
                                />
                            </div>

                            {/* FINANCIAL SUMMARY */}
                            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 sm:p-5">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">
                                            Subtotal
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            Rs.{" "}
                                            {totals.subtotal.toLocaleString(
                                                "en-LK",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">
                                            Discount
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            −Rs.{" "}
                                            {totals.discount.toLocaleString(
                                                "en-LK",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">
                                            Delivery Fee
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            +Rs.{" "}
                                            {totals.deliveryFee.toLocaleString(
                                                "en-LK",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <div className="border-t-2 border-slate-200 pt-3" />

                                    <div
                                        className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                                            grandTotalChanged
                                                ? "bg-orange-100"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900">
                                                Grand Total
                                            </span>
                                            {grandTotalChanged && (
                                                <AlertCircle
                                                    size={14}
                                                    className="text-orange-600"
                                                />
                                            )}
                                        </div>
                                        <span
                                            className={`text-lg font-bold ${
                                                grandTotalChanged
                                                    ? "text-orange-700"
                                                    : "text-emerald-700"
                                            }`}
                                        >
                                            Rs.{" "}
                                            {totals.grandTotal.toLocaleString(
                                                "en-LK",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* WARNING */}
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-4">
                                <p className="text-xs leading-5 text-amber-800">
                                    💡 <span className="font-medium">Price changes</span> may trigger an SMS notification to the customer.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* FIXED FOOTER/ACTIONS */}
                    <div className="flex flex-shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:px-5 sm:py-2.5"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                form.items.length === 0 ||
                                !hasChanges
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-2.5"
                        >
                            <Pencil size={16} />
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function MoneyField({
                        label,
                        name,
                        value,
                        onChange,
                        disabled,
                    }) {
    return (
        <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-600">
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    Rs.
                </span>
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    min="0"
                    step="0.01"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11"
                />
            </div>
        </div>
    );
}

export default EditSaleModal;