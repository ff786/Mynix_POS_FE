import { useState } from "react";
import { X, Banknote, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

import { recordCustomerPayment } from "@/services/customerApi";

function CustomerPaymentModal({
                                  open,
                                  customer,
                                  onClose,
                                  onSaved,
                              }) {

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("Customer payment received");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [saving, setSaving] = useState(false);

    if (!open || !customer) {
        return null;
    }

    const outstanding =
        Number(customer.outstanding || 0);

    const paymentAmount =
        Number(amount || 0);

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!paymentAmount || paymentAmount <= 0) {
            toast.error("Enter a valid payment amount.");
            return;
        }

        if (paymentAmount > outstanding) {
            toast.error(
                "Payment cannot exceed the customer's outstanding balance."
            );
            return;
        }

        try {

            setSaving(true);

            await recordCustomerPayment(
                customer.id,
                {
                    amount: paymentAmount,
                    paymentMethod,
                    description:
                        description.trim() ||
                        "Customer payment received",
                }
            );

            toast.success(
                "Customer payment recorded successfully."
            );

            setAmount("");
            setDescription("Customer payment received");
            setPaymentMethod("CASH");

            await onSaved();

            onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to record payment."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleClose = () => {

        if (saving) {
            return;
        }

        setAmount("");
        setDescription("Customer payment received");
        setPaymentMethod("CASH");

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Record Payment
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Record a payment against this customer's outstanding balance.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={saving}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5"
                >

                    {/* Customer */}
                    <div className="rounded-xl bg-slate-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Customer
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                            {customer.name}
                        </p>

                        <p className="text-xs text-slate-500">
                            {customer.contactNumber}
                        </p>

                    </div>

                    {/* Outstanding */}
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                            Current Outstanding
                        </p>

                        <p className="mt-1 text-2xl font-bold text-amber-700">
                            Rs.{" "}
                            {outstanding.toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </p>

                    </div>

                    {/* Amount */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Payment Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            placeholder="0.00"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-semibold outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            autoFocus
                        />

                    </div>

                    {/* Payment Method */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Payment Method
                        </label>

                        <div className="grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setPaymentMethod("CASH")
                                }
                                className={`
                                    flex items-center justify-center gap-2
                                    rounded-xl border px-4 py-3
                                    text-sm font-semibold
                                    transition
                                    ${
                                    paymentMethod === "CASH"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }
                                `}
                            >
                                <Banknote size={18} />
                                Cash
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setPaymentMethod("BANK_DEPOSIT")
                                }
                                className={`
                                    flex items-center justify-center gap-2
                                    rounded-xl border px-4 py-3
                                    text-sm font-semibold
                                    transition
                                    ${
                                    paymentMethod === "BANK_DEPOSIT"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }
                                `}
                            >
                                <ArrowRightLeft size={18} />
                                Bank Deposit
                            </button>

                        </div>

                    </div>

                    {/* Description */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <input
                            type="text"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Customer payment received"
                            maxLength={255}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />

                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={saving}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                !paymentAmount ||
                                outstanding <= 0
                            }
                            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {saving
                                ? "Recording..."
                                : "Record Payment"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CustomerPaymentModal;