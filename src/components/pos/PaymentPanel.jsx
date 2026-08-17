import {
    Banknote,
    CreditCard,
    ArrowRightLeft,
    ScrollText,
    HandCoins,
    Check,
} from "lucide-react";

const paymentMethods = [
    {
        value: "CASH",
        label: "Cash",
        icon: Banknote,
    },
    {
        value: "CARD",
        label: "Card",
        icon: CreditCard,
    },
    {
        value: "BANK_DEPOSIT",
        label: "Bank Deposit",
        icon: ArrowRightLeft,
    },
    {
        value: "CREDIT",
        label: "Credit",
        icon: HandCoins,
    },
    {
        value: "CHEQUE",
        label: "Cheque",
        icon: ScrollText,
    },
];

function PaymentPanel({
                          cart,
                          paymentMethod,
                          setPaymentMethod,
                          onCompleteSale,
                          loading,
                      }) {
    const disabled = cart.length === 0 || loading;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    Payment
                </h3>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Select how the customer is paying
                </p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-1 sm:gap-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const selected =
                        paymentMethod === method.value;

                    return (
                        <button
                            key={method.value}
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                setPaymentMethod(method.value)
                            }
                            className={`
                                relative flex min-h-[72px] items-center gap-3
                                rounded-xl border px-3 text-left transition-all
                                active:scale-[0.98] sm:min-h-[58px] sm:px-4
                                ${
                                selected
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }
                            `}
                        >
                            <div
                                className={`
                                    flex h-9 w-9 shrink-0 items-center
                                    justify-center rounded-lg
                                    ${
                                    selected
                                        ? "bg-emerald-100"
                                        : "bg-slate-100"
                                }
                                `}
                            >
                                <Icon
                                    size={18}
                                    className={
                                        selected
                                            ? "text-emerald-600"
                                            : "text-slate-500"
                                    }
                                />
                            </div>

                            <span className="text-sm font-semibold">
                                {method.label}
                            </span>

                            {selected && (
                                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                                    <Check size={12} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Payment */}
            <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                Payment:

                <span className="ml-1 font-semibold text-slate-800">
                    {
                        paymentMethods.find(
                            (method) =>
                                method.value === paymentMethod
                        )?.label
                    }
                </span>
            </div>

            {/* Complete Sale */}
            <button
                type="button"
                onClick={onCompleteSale}
                disabled={disabled}
                className="
                    mt-4 flex min-h-12 w-full items-center justify-center
                    rounded-xl bg-emerald-600 px-4 text-sm font-bold
                    text-white shadow-sm transition hover:bg-emerald-700
                    active:scale-[0.99] disabled:cursor-not-allowed
                    disabled:bg-slate-300
                "
            >
                {loading
                    ? "PROCESSING..."
                    : "COMPLETE SALE"}
            </button>

            {cart.length === 0 && (
                <p className="mt-3 text-center text-xs text-slate-400">
                    Add products to the cart first.
                </p>
            )}
        </section>
    );
}

export default PaymentPanel;