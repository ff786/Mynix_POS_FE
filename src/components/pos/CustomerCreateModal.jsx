import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { toast } from "sonner";

import { createCustomer } from "@/services/customerApi";

function CustomerCreateModal({
                                 open,
                                 initialSearch = "",
                                 onClose,
                                 onCreated,
                             }) {
    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] =
        useState(initialSearch || "");

    const [loading, setLoading] = useState(false);

    if (!open) {
        return null;
    }

    async function handleSubmit(event) {
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

        try {
            setLoading(true);

            const customer = await createCustomer({
                name: trimmedName,
                contactNumber: trimmedContact,
            });

            toast.success(
                "Customer created successfully."
            );

            setName("");
            setContactNumber("");

            onCreated(customer);
        } catch (error) {
            toast.error(
                error.response?.data?.message ??
                "Unable to create customer."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        if (loading) return;

        setName("");
        setContactNumber("");

        onClose();
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    bg-white
                    shadow-2xl
                    overflow-hidden
                "
            >

                {/* HEADER */}
                <div className="flex items-center justify-between border-b px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <UserPlus size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Create Customer
                            </h2>

                            <p className="text-xs text-slate-500">
                                Add this customer to the sale
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5"
                >

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Enter customer name"
                            autoFocus
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                            "
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Contact Number
                        </label>

                        <input
                            type="tel"
                            value={contactNumber}
                            onChange={(event) =>
                                setContactNumber(
                                    event.target.value
                                )
                            }
                            placeholder="0771234567"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                            "
                        />

                        <p className="mt-1.5 text-xs text-slate-400">
                            Contact number must be unique.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="
                                flex-1
                                rounded-xl
                                border
                                border-slate-200
                                py-3
                                text-sm
                                font-semibold
                                text-slate-600
                                hover:bg-slate-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1
                                rounded-xl
                                bg-emerald-600
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-emerald-700
                                disabled:cursor-not-allowed
                                disabled:bg-slate-300
                            "
                        >
                            {loading
                                ? "Creating..."
                                : "Create & Select"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CustomerCreateModal;