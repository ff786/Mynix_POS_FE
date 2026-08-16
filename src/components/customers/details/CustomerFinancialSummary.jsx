import {
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
} from "lucide-react";

function CustomerFinancialSummary({
                                      customer,
                                      transactions = [],
                                  }) {
    // Credit sales increase outstanding.
    const creditSales = transactions
        .filter(item => item.type === "CREDIT_SALE")
        .reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

    // Only actual payments reduce outstanding.
    const payments = transactions
        .filter(item => item.type === "PAYMENT")
        .reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

    // Backend outstanding is the source of truth.
    const outstanding = Number(
        customer.outstanding || 0
    );

    const cards = [
        {
            label: "Outstanding",
            value: outstanding,
            icon: Wallet,
            className:
                outstanding > 0
                    ? "text-amber-600 bg-amber-50"
                    : "text-emerald-600 bg-emerald-50",
        },
        {
            label: "Credit Sales",
            value: creditSales,
            icon: ArrowUpRight,
            className: "text-red-600 bg-red-50",
        },
        {
            label: "Payments",
            value: payments,
            icon: ArrowDownLeft,
            className: "text-emerald-600 bg-emerald-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map(card => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="rounded-2xl border bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    {card.label}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    Rs.{" "}
                                    {card.value.toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </p>
                            </div>

                            <div
                                className={`rounded-xl p-3 ${card.className}`}
                            >
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CustomerFinancialSummary;