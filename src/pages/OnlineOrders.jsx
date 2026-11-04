import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Globe,
    MapPin,
    Phone,
    Printer,
    RefreshCw,
    ShieldAlert,
    Search,
    StickyNote,
    X,
} from "lucide-react";

import { toast } from "sonner";

import {
    getOnlineOrders,
    getPaymentAlerts,
    markPaymentAlertHandled,
    updateOnlineOrder,
} from "../services/onlineOrderApi";

/*
 * Orders placed on the MYNIX website. Each one is already a POS sale
 * (stock taken, invoice issued); here staff pack, dispatch and close it.
 */

const TABS = [
    { status: "PLACED", label: "New" },
    { status: "PACKED", label: "Packed" },
    { status: "DISPATCHED", label: "Dispatched" },
    { status: "DELIVERED", label: "Delivered" },
    { status: "CANCELLED", label: "Cancelled" },
    { status: "ALL", label: "All" },
];

const STATUS_STYLES = {
    PLACED: "bg-amber-50 text-amber-700 ring-amber-200",
    PACKED: "bg-slate-100 text-slate-700 ring-slate-300",
    DISPATCHED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    DELIVERED: "bg-green-50 text-green-700 ring-green-200",
    CANCELLED: "bg-slate-100 text-slate-500 ring-slate-200",
};

const CHANNEL_LABELS = { WEBSITE: "Website", PHONE: "Phone", WHATSAPP: "WhatsApp" };

const PAYMENT_LABELS = {
    CASH_ON_DELIVERY: "Cash on delivery",
    ONLINE: "Paid online",
    BANK_TRANSFER: "Paid by bank transfer",
};

const STATUS_LABELS = {
    PLACED: "New",
    PACKED: "Packed",
    DISPATCHED: "Dispatched",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const money = (amount) =>
    `Rs. ${Number(amount ?? 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const dateTime = (value) =>
    value
        ? new Date(value).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

const addressLines = (order) =>
    [
        order.addressLine1,
        order.addressLine2,
        [order.city, order.district].filter(Boolean).join(", "),
        order.postalCode,
    ].filter(Boolean);

/*
 * Packing slip in a new window. Customer details come from the website, so
 * they are inserted as text (never as HTML).
 */
function printPackingSlip(order) {
    const slip = window.open("", "_blank", "width=420,height=640");
    if (!slip) {
        toast.error("Allow pop-ups to print the packing slip.");
        return;
    }
    const doc = slip.document;
    doc.title = `Packing slip ${order.invoiceNumber}`;
    const style = doc.createElement("style");
    style.textContent = `
        body { font: 13px/1.45 system-ui, sans-serif; margin: 24px; color: #111; }
        h1 { font-size: 16px; margin: 0 0 4px; } h2 { font-size: 12px; text-transform: uppercase;
        letter-spacing: .08em; color: #666; margin: 18px 0 6px; } .big { font-size: 15px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; } td { padding: 4px 0; border-bottom: 1px solid #eee; }
        td:last-child { text-align: right; } .total { font-size: 15px; font-weight: 700; margin-top: 10px; }
        .note { background: #fff7e6; padding: 8px; border-radius: 6px; }`;
    doc.head.appendChild(style);

    const add = (tag, text, className) => {
        const el = doc.createElement(tag);
        if (text != null) el.textContent = text;
        if (className) el.className = className;
        doc.body.appendChild(el);
        return el;
    };

    add("h1", `MYNIX — ${order.invoiceNumber}`);
    add("div", `Placed ${dateTime(order.placedAt)}`);
    add("h2", "Deliver to");
    add("div", order.customerName, "big");
    add("div", order.customerPhone);
    addressLines(order).forEach((line) => add("div", line));
    if (order.deliveryNotes) {
        add("h2", "Notes");
        add("div", order.deliveryNotes, "note");
    }
    add("h2", "Items");
    const table = add("table");
    (order.items ?? []).forEach((item) => {
        const row = table.insertRow();
        row.insertCell().textContent = `${item.quantity} × ${item.name}`;
        row.insertCell().textContent = item.barcode ?? "";
    });
    add(
        "div",
        order.paymentMethod === "CASH_ON_DELIVERY"
            ? `COLLECT CASH: ${money(order.grandTotal)}`
            : `PAID — ${money(order.grandTotal)} (no cash to collect)`,
        "total"
    );

    slip.focus();
    slip.print();
}

const ACTIONS = {
    pack: { label: "Mark packed", tone: "primary" },
    dispatch: { label: "Mark dispatched", tone: "primary" },
    deliver: { label: "Delivered", tone: "success" },
    cancel: { label: "Cancel order", tone: "danger" },
};

function actionsFor(order) {
    switch (order.status) {
        case "PLACED":
            return ["pack", "dispatch", "cancel"];
        case "PACKED":
            return ["dispatch", "cancel"];
        case "DISPATCHED":
            return ["deliver", "cancel"];
        default:
            return [];
    }
}

function confirmationFor(action, order) {
    if (action === "deliver") {
        return order.paymentMethod === "CASH_ON_DELIVERY"
            ? `Mark ${order.invoiceNumber} delivered and record ${money(order.grandTotal)} cash collected from ${order.customerName}?`
            : `Mark ${order.invoiceNumber} delivered?`;
    }
    if (action === "cancel") {
        return `Cancel ${order.invoiceNumber}? The sale is removed and the items go back into stock.` +
            (order.paymentMethod === "ONLINE" ? " Online payments must be refunded in OnePay." : "") +
            (order.paymentMethod === "BANK_TRANSFER" ? " Refund the bank transfer to the customer." : "");
    }
    return null;
}

function OrderCard({ order, busy, onAction }) {
    const lines = addressLines(order);

    return (
        <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-mono text-sm font-bold text-slate-900">
                        {order.invoiceNumber}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                        {dateTime(order.placedAt)} · {CHANNEL_LABELS[order.channel] ?? "Website"}
                    </p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[order.status] ?? ""}`}
                >
                    {STATUS_LABELS[order.status] ?? order.status}
                </span>
            </header>

            <div className="mt-4 space-y-1.5">
                <p className="font-semibold text-slate-800">
                    {order.customerName}
                </p>
                <a
                    href={`tel:${order.customerPhone}`}
                    className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline"
                >
                    <Phone size={14} />
                    {order.customerPhone}
                </a>
                {order.customerEmail && (
                    <p className="truncate text-xs text-slate-400">
                        {order.customerEmail}
                    </p>
                )}
                <div className="flex gap-1.5 pt-1 text-sm text-slate-600">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <div>
                        {lines.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </div>
                </div>
                {order.deliveryNotes && (
                    <div className="mt-2 flex gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        <StickyNote size={14} className="mt-0.5 shrink-0" />
                        <p className="whitespace-pre-line">{order.deliveryNotes}</p>
                    </div>
                )}
            </div>

            {order.items?.length > 0 && (
                <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100">
                    {order.items.map((item) => (
                        <li
                            key={`${item.barcode}-${item.name}`}
                            className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                        >
                            <span className="min-w-0 text-slate-700">
                                <span className="font-semibold">{item.quantity} ×</span>{" "}
                                {item.name}
                                <span className="block text-xs text-slate-400">
                                    {item.barcode}
                                </span>
                            </span>
                            <span className="shrink-0 tabular-nums text-slate-600">
                                {money(item.lineTotal)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-500">
                    {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </span>
                <span className="font-bold tabular-nums text-slate-900">
                    {order.status === "CANCELLED" ? "—" : money(order.grandTotal)}
                </span>
            </div>

            {order.statusUpdatedBy && (
                <p className="mt-2 text-xs text-slate-400">
                    Updated by {order.statusUpdatedBy} · {dateTime(order.statusUpdatedAt)}
                </p>
            )}

            {order.status !== "CANCELLED" && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {actionsFor(order).map((action) => {
                        const { label, tone } = ACTIONS[action];
                        const tones = {
                            primary: "bg-slate-900 text-white hover:bg-slate-800",
                            success: "bg-emerald-600 text-white hover:bg-emerald-700",
                            danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
                        };
                        return (
                            <button
                                key={action}
                                type="button"
                                disabled={busy}
                                onClick={() => onAction(order, action)}
                                className={`min-h-10 rounded-xl px-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
                            >
                                {action === "deliver" && order.paymentMethod === "CASH_ON_DELIVERY"
                                    ? "Delivered & paid"
                                    : label}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => printPackingSlip(order)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        <Printer size={14} />
                        Packing slip
                    </button>
                </div>
            )}
        </article>
    );
}

function ConfirmModal({ message, busy, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <p className="text-sm leading-6 text-slate-700">{message}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className="min-h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        {busy ? "Saving…" : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/*
 * Red banner: a customer paid online but their order could not be placed
 * (for example the item sold out). The money is taken, so staff must contact
 * them to fix the order or refund it in OnePay, then mark the alert handled.
 */
function PaymentAlerts({ alerts, onHandled }) {
    if (alerts.length === 0) return null;

    return (
        <section
            role="alert"
            className="rounded-2xl border border-red-300 bg-red-50 p-4 shadow-sm sm:p-5"
        >
            <div className="flex items-center gap-2 text-red-800">
                <ShieldAlert size={20} />
                <h2 className="text-base font-bold">
                    {alerts.length === 1
                        ? "A customer paid online but their order was NOT placed"
                        : `${alerts.length} customers paid online but their orders were NOT placed`}
                </h2>
            </div>
            <p className="mt-1 text-sm text-red-700">
                Contact each customer: place the order for them, or refund the payment in the OnePay portal.
                Then mark it handled.
            </p>
            <ul className="mt-3 space-y-2">
                {alerts.map((alert) => (
                    <li
                        key={alert.id}
                        className="flex flex-col gap-2 rounded-xl border border-red-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="text-sm text-slate-800">
                            <p className="font-semibold">
                                {alert.customerName} · {alert.customerPhone}
                                <span className="ml-2 font-bold text-red-700">{money(alert.amount)}</span>
                            </p>
                            <p className="text-xs text-slate-500">
                                OnePay transaction <span className="font-mono">{alert.transactionId}</span>
                                {alert.reason ? ` · ${alert.reason}` : ""}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onHandled(alert)}
                            className="shrink-0 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                        >
                            Mark handled
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function OnlineOrders() {
    const [orders, setOrders] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [tab, setTab] = useState("PLACED");
    const [search, setSearch] = useState("");
    const [busy, setBusy] = useState(false);
    const [pending, setPending] = useState(null); // { order, action }

    const load = useCallback(async (manual = false) => {
        if (manual) setRefreshing(true);
        try {
            setOrders(await getOnlineOrders());
        } catch {
            toast.error("Couldn't load online orders.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        const fetchOrders = () =>
            getOnlineOrders()
                .then((data) => active && setOrders(data))
                .catch(() => active && toast.error("Couldn't load online orders."))
                .finally(() => active && setLoading(false));

        const fetchAlerts = () =>
            getPaymentAlerts()
                .then((data) => active && setAlerts(data))
                .catch(() => undefined); // the banner is an extra; the orders list reports errors itself

        fetchOrders();
        fetchAlerts();
        // New website orders and payment alerts show up without reloading the page.
        const timer = setInterval(() => {
            fetchOrders();
            fetchAlerts();
        }, 60_000);
        return () => {
            active = false;
            clearInterval(timer);
        };
    }, []);

    const counts = useMemo(() => {
        const result = { ALL: orders.length };
        orders.forEach((o) => {
            result[o.status] = (result[o.status] ?? 0) + 1;
        });
        return result;
    }, [orders]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return orders.filter(
            (o) =>
                (tab === "ALL" || o.status === tab) &&
                (!q ||
                    [o.invoiceNumber, o.customerName, o.customerPhone, o.city]
                        .filter(Boolean)
                        .some((v) => v.toLowerCase().includes(q)))
        );
    }, [orders, tab, search]);

    const run = async (order, action) => {
        setBusy(true);
        try {
            const updated = await updateOnlineOrder(order.invoiceNumber, action);
            setOrders((current) =>
                current.map((o) => (o.invoiceNumber === updated.invoiceNumber ? updated : o))
            );
            toast.success(`${order.invoiceNumber}: ${STATUS_LABELS[updated.status] ?? updated.status}`);
            setPending(null);
        } catch (error) {
            toast.error(error?.response?.data?.message ?? "Couldn't update the order.");
        } finally {
            setBusy(false);
        }
    };

    const handleAlert = async (alert) => {
        try {
            await markPaymentAlertHandled(alert.id);
            setAlerts((current) => current.filter((item) => item.id !== alert.id));
            toast.success("Marked as handled.");
        } catch {
            toast.error("Couldn't update the alert. Try again.");
        }
    };

    const onAction = (order, action) => {
        if (confirmationFor(action, order)) setPending({ order, action });
        else run(order, action);
    };

    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-5">
            <PaymentAlerts alerts={alerts} onHandled={handleAlert} />
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                            <Globe size={20} className="text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Online Orders
                            </h1>
                            <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                                Orders from the website — pack, dispatch and mark them delivered.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => load(true)}
                        disabled={refreshing}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {TABS.map(({ status, label }) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setTab(status)}
                                className={`min-h-10 rounded-xl px-3.5 text-sm font-semibold transition ${
                                    tab === status
                                        ? "bg-slate-900 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {label}
                                <span className={`ml-1.5 tabular-nums ${tab === status ? "text-white/60" : "text-slate-400"}`}>
                                    {counts[status] ?? 0}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="relative lg:w-80">
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search invoice, name, phone or city…"
                            className="min-h-11 w-full rounded-xl border border-slate-200 pl-10 pr-9 text-sm outline-none focus:border-emerald-400"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                aria-label="Clear search"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {loading ? (
                <p className="px-1 text-sm text-slate-400">Loading orders…</p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500">
                    {tab === "PLACED" && !search
                        ? "No new website orders right now."
                        : "No orders match."}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {visible.map((order) => (
                        <OrderCard
                            key={order.invoiceNumber}
                            order={order}
                            busy={busy}
                            onAction={onAction}
                        />
                    ))}
                </div>
            )}

            {pending && (
                <ConfirmModal
                    message={confirmationFor(pending.action, pending.order)}
                    busy={busy}
                    onConfirm={() => run(pending.order, pending.action)}
                    onClose={() => setPending(null)}
                />
            )}
        </div>
    );
}

export default OnlineOrders;
