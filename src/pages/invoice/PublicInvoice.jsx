import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Loader2,
    Printer,
    ShieldCheck,
} from "lucide-react";

import Receipt from "@/components/receipt/Receipt";
import { getPublicInvoice } from "@/services/publicInvoiceApi";

function PublicInvoice() {
    const { token } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadInvoice() {
            if (!token) {
                if (active) {
                    setError("Invalid invoice link.");
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                setError("");
                setExpired(false);

                const data = await getPublicInvoice(token);

                if (!active) return;

                setInvoice(data);
            } catch (requestError) {
                console.error("Public invoice error:", requestError);

                if (!active) return;

                const message =
                    requestError?.response?.data?.message ||
                    "This invoice could not be found.";

                setInvoice(null);
                setError(message);
                setExpired(message.toLowerCase().includes("expired"));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadInvoice();

        return () => {
            active = false;
        };
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
                <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center">
                    <div className="w-full rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                            <Loader2 size={24} className="animate-spin text-emerald-600" />
                        </div>

                        <h1 className="mt-5 text-base font-bold text-slate-900">
                            Loading your invoice
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-400">
                            Please wait while we retrieve your receipt.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!invoice || error) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
                <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center">
                    <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-9">
                        <div
                            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                                expired ? "bg-amber-50" : "bg-red-50"
                            }`}
                        >
                            {expired ? (
                                <Clock3 size={30} className="text-amber-600" />
                            ) : (
                                <AlertCircle size={30} className="text-red-500" />
                            )}
                        </div>

                        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">
                            MYNIX
                        </p>

                        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                            {expired
                                ? "Invoice Link Expired"
                                : "Invoice Unavailable"}
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                            {expired
                                ? "This invoice link was available for 3 days and is no longer accessible."
                                : error || "Unable to load this invoice."}
                        </p>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                                <ShieldCheck size={15} className="text-emerald-500" />

                                <p className="text-xs font-semibold text-slate-600">
                                    Secure public invoice
                                </p>
                            </div>

                            <p className="mt-2 text-[11px] leading-5 text-slate-400">
                                Public invoice links are temporary for your security.
                            </p>
                        </div>

                        <div className="mt-4 rounded-2xl bg-white px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Need assistance?
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                                Inquiries, 0778843815
                            </p>
                        </div>

                        <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">
                            The Signature of Perfection
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-4 sm:py-8 print:bg-white print:py-0">
            <header className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-3 sm:px-4 print:hidden">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-base font-black text-white shadow-sm">
                        M
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                            MYNIX
                        </p>

                        <p className="text-[10px] text-slate-400 sm:text-xs">
                            Customer Invoice
                        </p>
                    </div>
                </div>

                {/*<button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/15 sm:px-4 sm:text-sm"
                >
                    <Printer size={16} />
                    Print
                </button>*/}
            </header>

            <main className="mx-auto mt-4 w-full max-w-2xl px-2 sm:mt-6 sm:px-4 print:mt-0 print:max-w-none print:px-0">
                <div
                    id="public-invoice"
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-7 print:rounded-none print:border-0 print:p-0 print:shadow-none"
                >
                    <Receipt sale={invoice} />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 print:hidden">
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-semibold text-slate-500">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        Official MYNIX invoice
                    </div>

                    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-semibold text-slate-500">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Secure customer link
                    </div>
                </div>

                <p className="mt-5 text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-300 print:hidden">
                    MYNIX — The Signature of Perfection
                </p>
            </main>
        </div>
    );
}

export default PublicInvoice;