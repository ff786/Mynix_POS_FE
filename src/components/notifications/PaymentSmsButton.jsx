import { useState } from "react";
import { MessageSquare } from "lucide-react";

import SmsModal from "./SmsModal";

import {
    buildPaymentSms,
} from "@/utils/smsMessages";

function PaymentSmsButton({
                              customer,
                              payment,
                          }) {

    const [open, setOpen] =
        useState(false);

    if (
        !customer?.contactNumber ||
        !payment
    ) {
        return null;
    }

    const message =
        buildPaymentSms({
            customerName:
            customer.name,
            amount:
            payment.amount,
            paymentMethod:
            payment.paymentMethod,
            outstanding:
            payment.remainingOutstanding,
        });

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            >
                <MessageSquare size={14} />
                Send SMS
            </button>

            <SmsModal
                open={open}
                onClose={() =>
                    setOpen(false)
                }
                customer={customer}
                title="Send Payment SMS"
                message={message}
            />
        </>
    );
}

export default PaymentSmsButton;