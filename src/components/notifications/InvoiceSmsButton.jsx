import { useState } from "react";
import { MessageSquare } from "lucide-react";

import SmsModal from "./SmsModal";

import {
    buildInvoiceSms,
} from "@/utils/smsMessages";

function InvoiceSmsButton({
                              sale,
                          }) {

    const [open, setOpen] =
        useState(false);

    if (
        !sale?.customerContactNumber ||
        !sale?.customerName
    ) {
        return null;
    }

    const message =
        buildInvoiceSms({
            customerName:
            sale.customerName,
            invoiceNumber:
            sale.invoiceNumber,
            amount:
            sale.grandTotal,
            outstanding:
            sale.customerOutstanding,
        });

    const customer = {
        name:
        sale.customerName,
        contactNumber:
        sale.customerContactNumber,
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            >
                <MessageSquare size={15} />
                Send Invoice SMS
            </button>

            <SmsModal
                open={open}
                onClose={() =>
                    setOpen(false)
                }
                customer={customer}
                title="Send Invoice SMS"
                message={message}
            />
        </>
    );
}

export default InvoiceSmsButton;