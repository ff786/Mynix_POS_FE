import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import AddressFields from "./AddressFields";
import {
    deleteAddress,
    getAddresses,
    makeDefaultAddress,
    saveAddress,
} from "@/services/customerAddressApi";

const EMPTY = { label: "Home", addressLine1: "", addressLine2: "", city: "", district: "", postalCode: "" };

/** The customer's saved delivery addresses (also used for phone / WhatsApp orders and on the website). */
function CustomerAddresses({ customerId }) {
    const [addresses, setAddresses] = useState([]);
    const [editing, setEditing] = useState(null); // null | "new" | address id
    const [draft, setDraft] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;
        getAddresses(customerId)
            .then((data) => active && setAddresses(data))
            .catch(() => active && toast.error("Couldn't load addresses."));
        return () => {
            active = false;
        };
    }, [customerId]);

    const reload = async () => setAddresses(await getAddresses(customerId));

    const start = (address) => {
        setEditing(address ? address.id : "new");
        setDraft(address ? { ...EMPTY, ...address } : EMPTY);
    };

    const save = async () => {
        if (!draft.addressLine1.trim() || !draft.city.trim() || !draft.district) {
            toast.error("Fill in the address, city and district.");
            return;
        }
        setSaving(true);
        try {
            await saveAddress(customerId, { ...draft, makeDefault: false }, editing === "new" ? undefined : editing);
            await reload();
            setEditing(null);
            toast.success("Address saved.");
        } catch (error) {
            toast.error(error?.response?.data?.message ?? "Couldn't save the address.");
        } finally {
            setSaving(false);
        }
    };

    const act = async (fn, success) => {
        try {
            await fn();
            await reload();
            toast.success(success);
        } catch (error) {
            toast.error(error?.response?.data?.message ?? "Something went wrong.");
        }
    };

    const form = (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <AddressFields value={draft} onChange={setDraft} />
            <div className="flex gap-2">
                <button type="button" onClick={save} disabled={saving}
                    className="min-h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                    {saving ? "Saving…" : "Save address"}
                </button>
                <button type="button" onClick={() => setEditing(null)}
                    className="min-h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    Cancel
                </button>
            </div>
        </div>
    );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Delivery addresses</h2>
                    <p className="text-xs text-slate-500">Used for phone / WhatsApp delivery orders and on the website.</p>
                </div>
                {editing === null && addresses.length < 10 && (
                    <button type="button" onClick={() => start(null)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                        <Plus size={15} /> Add
                    </button>
                )}
            </div>

            <div className="mt-4 space-y-3">
                {addresses.length === 0 && editing === null && (
                    <p className="text-sm text-slate-400">No saved addresses yet.</p>
                )}
                {addresses.map((a) =>
                    editing === a.id ? (
                        <div key={a.id}>{form}</div>
                    ) : (
                        <div key={a.id} className="flex gap-3 rounded-2xl border border-slate-100 p-4">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    {a.label}
                                    {a.defaultAddress && (
                                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Default</span>
                                    )}
                                </p>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    {[a.addressLine1, a.addressLine2, `${a.city}, ${a.district}`, a.postalCode].filter(Boolean).join(" · ")}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold">
                                    <button type="button" onClick={() => start(a)} className="text-slate-600 hover:text-slate-900">Edit</button>
                                    {!a.defaultAddress && (
                                        <button type="button" onClick={() => act(() => makeDefaultAddress(customerId, a.id), "Default address updated.")}
                                            className="text-slate-600 hover:text-slate-900">Make default</button>
                                    )}
                                    <button type="button"
                                        onClick={() => window.confirm(`Remove "${a.label}"?`) && act(() => deleteAddress(customerId, a.id), "Address removed.")}
                                        className="text-red-500 hover:text-red-700">Remove</button>
                                </div>
                            </div>
                        </div>
                    )
                )}
                {editing === "new" && form}
            </div>
        </section>
    );
}

export default CustomerAddresses;
