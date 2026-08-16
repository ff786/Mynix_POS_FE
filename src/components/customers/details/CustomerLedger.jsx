import {
    ArrowDownLeft,
    ArrowUpRight,
    Receipt,
} from "lucide-react";

function CustomerLedger({ transactions = [] }) {

    const formatAmount = (amount) =>
        Number(amount || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

    const getType = (type) => {

        switch (type) {

            case "CREDIT_SALE":
                return {
                    label: "Credit Sale",
                    icon: ArrowUpRight,
                    className:
                        "bg-red-50 text-red-600",
                    direction: "debit",
                };

            case "PAYMENT":
                return {
                    label: "Payment",
                    icon: ArrowDownLeft,
                    className:
                        "bg-emerald-50 text-emerald-600",
                    direction: "credit",
                };

            case "CHEQUE_PAYMENT":
                return {
                    label: "Cheque Payment",
                    icon: ArrowDownLeft,
                    className:
                        "bg-blue-50 text-blue-600",
                    direction: "credit",
                };

            default:
                return {
                    label: type,
                    icon: Receipt,
                    className:
                        "bg-slate-100 text-slate-600",
                    direction: "credit",
                };
        }
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm">

            <div className="border-b px-5 py-4">

                <h2 className="font-semibold text-slate-900">
                    Customer Ledger
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Complete transaction history
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-slate-50">

                        <tr>

                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                Transaction
                            </th>

                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                Description
                            </th>

                            <th className="px-5 py-3 text-left font-medium text-slate-500">
                                Date
                            </th>

                            <th className="px-5 py-3 text-right font-medium text-slate-500">
                                Amount
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y">

                        {transactions.map(transaction => {

                            const meta =
                                getType(transaction.type);

                            const Icon = meta.icon;

                            return (
                                <tr
                                    key={transaction.id}
                                    className="hover:bg-slate-50"
                                >

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.className}`}
                                            >
                                                <Icon size={16} />
                                            </div>

                                            <span className="font-medium">
                                                {meta.label}
                                            </span>

                                        </div>

                                    </td>

                                    <td className="px-5 py-4 text-slate-500">
                                        {transaction.description || "—"}
                                    </td>

                                    <td className="px-5 py-4 text-slate-500">
                                        {transaction.createdAt
                                            ? new Date(
                                                transaction.createdAt
                                            ).toLocaleString()
                                            : "—"}
                                    </td>

                                    <td
                                        className={`px-5 py-4 text-right font-semibold ${
                                            meta.direction === "debit"
                                                ? "text-red-600"
                                                : "text-emerald-600"
                                        }`}
                                    >
                                        {meta.direction === "debit"
                                            ? "+"
                                            : "-"}
                                        Rs.{" "}
                                        {formatAmount(
                                            transaction.amount
                                        )}
                                    </td>

                                </tr>
                            );
                        })}

                        {transactions.length === 0 && (
                            <tr>

                                <td
                                    colSpan="4"
                                    className="px-5 py-12 text-center text-sm text-slate-400"
                                >
                                    No transactions recorded yet.
                                </td>

                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default CustomerLedger;
