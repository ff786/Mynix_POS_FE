import { useEffect, useState } from "react";
import { MessageSquareWarning } from "lucide-react";

import { getSmsStatus } from "../../services/smsStatusApi";

const when = (value) =>
    value
        ? new Date(value).toLocaleString("en-LK", {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : null;

/*
 * Red banner on every page while text messages keep failing (for example an
 * expired text.lk plan). Sales still go through, so without this nobody
 * notices that customers get no codes, invoices or order updates.
 */
function SmsStatusBanner() {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        let active = true;
        const fetchStatus = () =>
            getSmsStatus()
                .then((data) => active && setStatus(data))
                .catch(() => undefined); // the banner is an extra; pages report their own errors

        fetchStatus();
        const timer = setInterval(fetchStatus, 60_000);
        return () => {
            active = false;
            clearInterval(timer);
        };
    }, []);

    if (!status?.failing) return null;

    const lastSent = when(status.lastSuccessAt);

    return (
        <section
            role="alert"
            className="mb-5 rounded-2xl border border-red-300 bg-red-50 p-4 shadow-sm sm:p-5"
        >
            <div className="flex items-center gap-2 text-red-800">
                <MessageSquareWarning size={20} className="shrink-0" />
                <h2 className="text-base font-bold">Text messages are NOT being sent</h2>
            </div>
            <p className="mt-1 text-sm text-red-700">
                The last {status.consecutiveFailures} messages failed, since {when(status.failingSince)}.
                Customers are not getting verification codes, invoices or order updates, so new
                customers can't verify their phone to order on the website.
                Check the text.lk plan and balance.
            </p>
            {status.lastFailureReason && (
                <p className="mt-2 break-words text-xs text-red-700">
                    Latest error: <span className="font-mono">{status.lastFailureReason}</span>
                </p>
            )}
            <p className="mt-1 text-xs text-red-600">
                {lastSent ? `Last message sent: ${lastSent}.` : "No message has been sent since the server last started."}
                {" "}This clears by itself once a message goes through.
            </p>
        </section>
    );
}

export default SmsStatusBanner;
