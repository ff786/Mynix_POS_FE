import { useEffect, useState } from "react";
import {
    MessageSquare,
    Send,
    X,
    Copy,
} from "lucide-react";
import { toast } from "sonner";

import { sendCustomerSms } from "@/services/smsApi";

function SmsModal({
                      open,
                      onClose,
                      customer,
                      title = "Send SMS",
                      message = "",
                  }) {

    const [smsMessage, setSmsMessage] =
        useState("");

    const [sending, setSending] =
        useState(false);

    useEffect(() => {

        if (open) {
            setSmsMessage(message);
        }

    }, [open, message]);

    if (!open) {
        return null;
    }

    const handleSend = async () => {

        if (!customer?.contactNumber) {
            toast.error(
                "Customer does not have a contact number."
            );
            return;
        }

        if (!smsMessage.trim()) {
            toast.error(
                "SMS message cannot be empty."
            );
            return;
        }

        try {

            setSending(true);

            await sendCustomerSms({
                phoneNumber:
                customer.contactNumber,
                message:
                    smsMessage.trim(),
            });

            toast.success(
                "SMS composer opened."
            );

            onClose();

        } catch (error) {

            toast.error(
                error.message ||
                "Unable to prepare SMS."
            );

        } finally {

            setSending(false);

        }
    };

    const copyMessage = async () => {

        await navigator.clipboard.writeText(
            smsMessage
        );

        toast.success(
            "Message copied."
        );
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                            <MessageSquare
                                size={19}
                                className="text-emerald-600"
                            />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                {title}
                            </h2>

                            <p className="text-xs text-slate-500">
                                {customer?.name}
                                {" · "}
                                {customer?.contactNumber}
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={sending}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>

                </div>

                <div className="space-y-4 p-5">

                    <div>

                        <div className="mb-2 flex items-center justify-between">

                            <label className="text-sm font-medium text-slate-700">
                                Message
                            </label>

                            <span className="text-xs text-slate-400">
                                {smsMessage.length}/320
                            </span>

                        </div>

                        <textarea
                            value={smsMessage}
                            onChange={(event) =>
                                setSmsMessage(
                                    event.target.value
                                )
                            }
                            maxLength={320}
                            rows={7}
                            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                        On mobile, this will open the device's SMS composer with the customer number and message pre-filled.
                    </div>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={copyMessage}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            <Copy size={16} />
                            Copy
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={
                                sending ||
                                !smsMessage.trim()
                            }
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300"
                        >
                            <Send size={16} />

                            {sending
                                ? "Opening..."
                                : "Send SMS"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SmsModal;