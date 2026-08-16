import { useEffect, useState } from "react";
import { X, UserRound, Phone } from "lucide-react";
import {
    createCustomer,
    updateCustomer,
} from "@/services/customerApi";
import { toast } from "sonner";

function CustomerModal({
    open,
    onClose,
    customer,
    onSaved,
}) {

    const [form, setForm] = useState({
        name: "",
        contactNumber: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (customer) {
            setForm({
                name: customer.name || "",
                contactNumber: customer.contactNumber || "",
            });
        } else {
            setForm({
                name: "",
                contactNumber: "",
            });
        }

    }, [customer, open]);

    if (!open) {
        return null;
    }

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!form.name.trim()) {
            toast.error("Customer name is required.");
            return;
        }

        if (!form.contactNumber.trim()) {
            toast.error("Contact number is required.");
            return;
        }

        try {

            setLoading(true);

            let saved;

            if (customer) {
                saved = await updateCustomer(
                    customer.id,
                    {
                        name: form.name.trim(),
                        contactNumber: form.contactNumber.trim(),
                    }
                );

                toast.success("Customer updated successfully.");
            } else {
                saved = await createCustomer({
                    name: form.name.trim(),
                    contactNumber: form.contactNumber.trim(),
                });

                toast.success("Customer created successfully.");
            }

            onSaved(saved);
            onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to save customer."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b px-5 py-4">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {customer
                                ? "Edit Customer"
                                : "Add Customer"}
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                            Customer information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={19} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-5 space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Customer Name
                        </label>

                        <div className="relative">

                            <UserRound
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter customer name"
                                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />

                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Contact Number
                        </label>

                        <div className="relative">

                            <Phone
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                name="contactNumber"
                                value={form.contactNumber}
                                onChange={handleChange}
                                placeholder="0777774514"
                                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />

                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : customer
                                    ? "Update Customer"
                                    : "Create Customer"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CustomerModal;
