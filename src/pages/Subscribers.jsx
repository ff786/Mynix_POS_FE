import { useEffect, useMemo, useState } from "react";
import { Download, Mail, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
    deleteSubscriber,
    getSubscribers,
} from "../services/newsletterApi";

/*
 * People who joined the newsletter on the MYNIX website (admins only).
 */

const dateTime = (value) =>
    value
        ? new Date(value).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

/* A cell starting with = + - @ could run as a formula in Excel; prefix it. */
const csvCell = (value) => {
    const text = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
};

function Subscribers() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        let active = true;
        getSubscribers()
            .then((data) => active && setSubscribers(data))
            .catch(() => active && toast.error("Couldn't load subscribers."))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, []);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q ? subscribers.filter((s) => s.email.includes(q)) : subscribers;
    }, [subscribers, search]);

    const exportCsv = () => {
        const rows = [["Email", "Subscribed"], ...subscribers.map((s) => [s.email, dateTime(s.subscribedAt)])];
        const blob = new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `mynix-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const remove = async (subscriber) => {
        if (!window.confirm(`Remove ${subscriber.email} from the newsletter?`)) return;
        setRemoving(subscriber.id);
        try {
            await deleteSubscriber(subscriber.id);
            setSubscribers((current) => current.filter((s) => s.id !== subscriber.id));
            toast.success("Subscriber removed.");
        } catch {
            toast.error("Couldn't remove the subscriber.");
        } finally {
            setRemoving(null);
        }
    };

    return (
        <div className="mx-auto w-full max-w-[1200px] space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                            <Mail size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Newsletter Subscribers
                            </h1>
                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                                {subscribers.length} {subscribers.length === 1 ? "person has" : "people have"} joined
                                from the website.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={exportCsv}
                        disabled={subscribers.length === 0}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
                <div className="relative mt-5 lg:w-80">
                    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search email…"
                        className="min-h-11 w-full rounded-xl border border-slate-200 pl-10 pr-9 text-sm outline-none focus:border-emerald-400"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </section>

            {loading ? (
                <p className="px-1 text-sm text-slate-400">Loading…</p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500">
                    {subscribers.length === 0 ? "No sign-ups yet." : "No subscribers match."}
                </div>
            ) : (
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {visible.map((s) => (
                        <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                            <div className="min-w-0">
                                <a href={`mailto:${s.email}`} className="block truncate text-sm font-medium text-slate-800 hover:underline">
                                    {s.email}
                                </a>
                                <p className="text-xs text-slate-400">{dateTime(s.subscribedAt)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(s)}
                                disabled={removing === s.id}
                                aria-label={`Remove ${s.email}`}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Subscribers;
