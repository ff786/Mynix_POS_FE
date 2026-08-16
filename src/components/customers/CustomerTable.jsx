import {
    Pencil,
    MoreHorizontal,
    Phone,
    Wallet,
} from "lucide-react";

function CustomerTable({
    customers,
    onEdit,
    onDeactivate,
}) {

    return (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="border-b bg-slate-50">

                        <tr>

                            <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                Customer
                            </th>

                            <th className="px-5 py-4 text-left font-semibold text-slate-600">
                                Contact
                            </th>

                            <th className="px-5 py-4 text-right font-semibold text-slate-600">
                                Outstanding
                            </th>

                            <th className="px-5 py-4 text-center font-semibold text-slate-600">
                                Status
                            </th>

                            <th className="px-5 py-4 text-right font-semibold text-slate-600">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y">

                        {customers.map(customer => {

                            const outstanding =
                                Number(customer.outstanding || 0);

                            return (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-slate-50/70"
                                >

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-600">
                                                {customer.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {customer.name}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    Customer #{customer.id}
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-2 text-slate-600">

                                            <Phone size={14} />

                                            {customer.contactNumber}

                                        </div>

                                    </td>

                                    <td className="px-5 py-4 text-right">

                                        <div className="flex items-center justify-end gap-2">

                                            <Wallet
                                                size={15}
                                                className={
                                                    outstanding > 0
                                                        ? "text-amber-500"
                                                        : "text-emerald-500"
                                                }
                                            />

                                            <span
                                                className={
                                                    outstanding > 0
                                                        ? "font-semibold text-amber-600"
                                                        : "font-semibold text-emerald-600"
                                                }
                                            >
                                                Rs.{" "}
                                                {outstanding.toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </span>

                                        </div>

                                    </td>

                                    <td className="px-5 py-4 text-center">

                                        <span
                                            className={
                                                customer.active
                                                    ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                                                    : "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                                            }
                                        >
                                            {customer.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </td>

                                    <td className="px-5 py-4">

                                        <div className="flex justify-end gap-2">

                                            <button
                                                type="button"
                                                onClick={() => onEdit(customer)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {customer.active && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDeactivate(customer)
                                                    }
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    title="Deactivate"
                                                >
                                                    <MoreHorizontal size={17} />
                                                </button>
                                            )}

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}

                        {customers.length === 0 && (
                            <tr>

                                <td
                                    colSpan="5"
                                    className="px-5 py-12 text-center text-sm text-slate-400"
                                >
                                    No customers found.
                                </td>

                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default CustomerTable;
