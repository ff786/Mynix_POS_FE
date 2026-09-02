import { useEffect, useMemo, useState } from "react";
import { Pencil, X } from "lucide-react";
import { toast } from "sonner";

function EditSaleModal({
                           open,
                           sale,
                           onClose,
                           onSave,
                       }) {
    const [form, setForm] = useState({
        discount: "",
        deliveryFee: "",
        paymentMethod: "CASH",
        items: [],
    });

    const [saving, setSaving] = useState(false);

    /*
     * Load sale into the form whenever
     * the selected sale changes.
     */
    useEffect(() => {
        if (!sale) {
            return;
        }

        setForm({
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
        });
    }, [sale]);


    /*
     * Calculate preview totals.
     *
     * Backend will calculate these again
     * when the request is submitted.
     */
    const totals = useMemo(() => {
        const subtotal = form.items.reduce(
            (total, item) => {
                const quantity =
                    Number(item.quantity) || 0;

                const unitPrice =
                    Number(item.unitPrice) || 0;

                return (
                    total +
                    quantity * unitPrice
                );
            },
            0
        );

        const discount =
            Number(form.discount) || 0;

        const deliveryFee =
            Number(form.deliveryFee) || 0;

        const grandTotal = Math.max(
            0,
            subtotal -
            discount +
            deliveryFee
        );

        return {
            subtotal,
            discount,
            deliveryFee,
            grandTotal,
        };
    }, [
        form.items,
        form.discount,
        form.deliveryFee,
    ]);


    if (!open || !sale) {
        return null;
    }


    /*
     * Update discount, delivery fee,
     * and payment method.
     */
    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }


    /*
     * Update individual item.
     */
    function handleItemChange(
        itemId,
        field,
        value
    ) {
        setForm((current) => ({
            ...current,

            items: current.items.map(
                (item) =>
                    item.id === itemId
                        ? {
                            ...item,
                            [field]: value,
                        }
                        : item
            ),
        }));
    }


    /*
     * Validate and save.
     */
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


        /*
         * Validate sale items.
         */
        for (const item of form.items) {
            const quantity =
                Number(item.quantity);

            const unitPrice =
                Number(item.unitPrice);


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


            /*
             * Only send values that the backend
             * actually needs.
             *
             * subtotal and grandTotal are NOT
             * sent because the backend calculates them.
             */
            const payload = {
                discount,
                deliveryFee,

                paymentMethod:
                form.paymentMethod,

                items: form.items.map(
                    (item) => ({
                        id: item.id,
                        quantity:
                            Number(item.quantity),
                        unitPrice:
                            Number(item.unitPrice),
                    })
                ),
            };


            await onSave(
                sale.invoiceNumber,
                payload
            );


            onClose();

        } catch (error) {
            /*
             * Parent handles the error toast.
             */
        } finally {
            setSaving(false);
        }
    }


    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
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
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <Pencil
                                size={18}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Edit Sale
                            </h2>

                            <p className="mt-0.5 font-mono text-xs text-slate-400">
                                {sale.invoiceNumber}
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>


                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5"
                >

                    {/* CUSTOMER */}
                    <div className="rounded-xl bg-slate-50 px-4 py-3">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Customer
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                            {sale.customerName ||
                                "Walk-in Customer"}
                        </p>

                        {sale.customerContactNumber && (
                            <p className="mt-0.5 text-xs text-slate-400">
                                {
                                    sale.customerContactNumber
                                }
                            </p>
                        )}

                    </div>


                    {/* ITEMS */}
                    <div>

                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Sale Items
                            </label>

                            <span className="text-xs text-slate-400">
                                Edit price or quantity
                            </span>
                        </div>


                        <div className="space-y-3">

                            {form.items.map(
                                (item) => {

                                    const quantity =
                                        Number(
                                            item.quantity
                                        ) || 0;

                                    const unitPrice =
                                        Number(
                                            item.unitPrice
                                        ) || 0;

                                    const lineTotal =
                                        quantity *
                                        unitPrice;


                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-slate-200 bg-white p-4"
                                        >

                                            {/* PRODUCT INFO */}
                                            <div className="mb-3">

                                                <p className="text-sm font-semibold text-slate-800">
                                                    {
                                                        item.productName
                                                    }
                                                </p>

                                                <p className="mt-0.5 font-mono text-xs text-slate-400">
                                                    {
                                                        item.barcode
                                                    }
                                                </p>

                                            </div>


                                            {/* INPUTS */}
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
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
                                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </div>


                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                                        Unit Price
                                                    </label>

                                                    <div className="relative">

                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
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
                                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                                        />

                                                    </div>
                                                </div>


                                                <div>
                                                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                                        Line Total
                                                    </label>

                                                    <div className="flex h-11 items-center rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-800">
                                                        Rs.{" "}
                                                        {lineTotal.toLocaleString(
                                                            "en-LK",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>


                    {/* PAYMENT */}
                    <div>

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                            Payment Method
                        </label>

                        <select
                            name="paymentMethod"
                            value={
                                form.paymentMethod
                            }
                            onChange={
                                handleChange
                            }
                            disabled={saving}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                        </select>

                    </div>


                    {/* DISCOUNT + DELIVERY */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <MoneyField
                            label="Discount"
                            name="discount"
                            value={
                                form.discount
                            }
                            onChange={
                                handleChange
                            }
                            disabled={saving}
                        />

                        <MoneyField
                            label="Delivery Fee"
                            name="deliveryFee"
                            value={
                                form.deliveryFee
                            }
                            onChange={
                                handleChange
                            }
                            disabled={saving}
                        />

                    </div>


                    {/* TOTALS */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                                Subtotal
                            </span>

                            <span className="font-semibold text-slate-800">
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


                        <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                                Discount
                            </span>

                            <span className="font-semibold text-slate-800">
                                - Rs.{" "}
                                {totals.discount.toLocaleString(
                                    "en-LK",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </span>
                        </div>


                        <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                                Delivery Fee
                            </span>

                            <span className="font-semibold text-slate-800">
                                + Rs.{" "}
                                {totals.deliveryFee.toLocaleString(
                                    "en-LK",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </span>
                        </div>


                        <div className="my-3 border-t border-slate-200" />


                        <div className="flex items-center justify-between">

                            <span className="text-sm font-bold text-slate-700">
                                Grand Total
                            </span>

                            <span className="text-lg font-bold text-emerald-700">
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


                    {/* WARNING */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

                        <p className="text-xs leading-5 text-amber-700">
                            Editing a sale changes the
                            recorded financial values.
                            Price changes may trigger
                            an SMS notification to the
                            customer.
                        </p>

                    </div>


                    {/* ACTIONS */}
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                saving ||
                                form.items.length === 0
                            }
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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


/*
 * Reusable money input.
 */
function MoneyField({label, name, value, onChange, disabled,}) {

    return (
        <div>

            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {label}
            </label>

            <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
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
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

            </div>

        </div>
    );
}


export default EditSaleModal;