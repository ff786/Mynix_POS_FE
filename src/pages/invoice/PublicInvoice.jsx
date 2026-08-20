import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Printer,
} from "lucide-react";

import Receipt from "@/components/receipt/Receipt";
import { getPublicInvoice } from "@/services/publicInvoiceApi";

function PublicInvoice() {
    const { token } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [expired, setExpired] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadInvoice() {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getPublicInvoice(token);

                setInvoice(data);
            } catch (error) {

                console.error(
                    "Public invoice error:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "This invoice could not be found.";

                setError(message);

                setExpired(
                    message
                        .toLowerCase()
                        .includes("expired")
                );

            } finally {
                setLoading(false);
            }
        }

        if (token) {
            loadInvoice();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-50
            ">
                <div className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-slate-500
                ">
                    <Loader2
                        size={20}
                        className="animate-spin"
                    />
                    Loading invoice...
                </div>
            </div>
        );
    }

    if (!invoice || error) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-50
                px-4
            ">
                <div className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                ">
                    <div className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-50
                    ">
                        <AlertCircle
                            size={28}
                            className="text-red-500"
                        />
                    </div>

                    <h1 className=" mt-5 text-xl font-bold text-slate-900 ">
                        {expired
                            ? "Invoice Link Expired"
                            : "Invoice Unavailable"}
                    </h1>
                    <p className="mt-1 text-xs leading-4 text-slate-500">
                        {expired
                            ? "This invoice link was available for 3 days and is no longer accessible."
                            : error || "Unable to load this invoice."}
                    </p>
                    <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-center">
                        <p className="text-xs font-medium text-slate-500">For assistance</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-800">Inquiries, 0778843815</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="
            min-h-screen
            bg-slate-100
            py-5
            sm:py-10
        ">

            {/* Header */}

            <header className="
                mx-auto
                flex
                w-full
                max-w-2xl
                items-center
                justify-between
                gap-3
                px-4
                print:hidden
            ">

                <div className="min-w-0">

                    <p className="
                        text-xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    ">
                        MYNIX POS
                    </p>

                    <p className="
                        mt-0.5
                        text-xs
                        text-slate-500
                    ">
                        Customer Invoice
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="
                        inline-flex
                        min-h-10
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        bg-emerald-600
                        px-4
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-emerald-700
                    "
                >
                    <Printer size={16} />
                    Print
                </button>

            </header>

            {/* Invoice */}

            <main className="
                mx-auto
                mt-5
                w-full
                max-w-2xl
                px-3
                sm:px-4
            ">

                <div
                    id="public-invoice"
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                        sm:p-8
                        print:border-0
                        print:p-0
                        print:shadow-none
                        print:rounded-none
                    "
                >
                    <Receipt sale={invoice} />
                </div>

                <div className="
                    mt-4
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-xs
                    text-slate-400
                    print:hidden
                ">
                    <CheckCircle2
                        size={14}
                        className="text-emerald-500"
                    />
                    Official MYNIX invoice
                </div>

            </main>

        </div>
    );
}

export default PublicInvoice;