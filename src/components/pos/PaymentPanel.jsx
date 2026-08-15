import { Banknote, CreditCard, ArrowRightLeft } from "lucide-react";

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
        value: "ACCOUNT_TRANSFER",
        label: "Account Transfer",
        icon: ArrowRightLeft,
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
        <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="mb-6">
                <h3 className="font-semibold text-lg">
                    Payment
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                    Select payment method
                </p>
            </div>

            <div className="space-y-3">

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
                                w-full flex items-center gap-3
                                px-4 py-3 rounded-lg border
                                transition
                                ${
                                selected
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                            }
                            `}
                        >

                            <Icon size={20} />

                            <span className="font-medium">
                                {method.label}
                            </span>

                            {selected && (
                                <span className="ml-auto text-emerald-600">
                                    ✓
                                </span>
                            )}

                        </button>
                    );

                })}

            </div>

            <button
                type="button"
                onClick={onCompleteSale}
                disabled={disabled}
                className="
                    w-full mt-8
                    bg-emerald-600
                    hover:bg-emerald-700
                    disabled:bg-slate-300
                    disabled:cursor-not-allowed
                    text-white
                    rounded-lg
                    py-4
                    font-semibold
                    transition
                "
            >
                {loading
                    ? "PROCESSING..."
                    : "COMPLETE SALE"
                }
            </button>

            {cart.length === 0 && (
                <p className="text-xs text-center text-slate-400 mt-3">
                    Add products to the cart to complete the sale.
                </p>
            )}

        </div>
    );
}

export default PaymentPanel;