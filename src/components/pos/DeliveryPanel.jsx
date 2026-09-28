import { useEffect, useState } from "react";
import { MessageCircle, Phone, Truck } from "lucide-react";
import AddressFields, { fieldClass } from "@/components/customers/details/AddressFields";
import { getAddresses } from "@/services/customerAddressApi";


/**
 * "Deliver this order" for orders taken by phone or WhatsApp: the sale then
 * shows in Online Orders to pack, dispatch and deliver.
 */
function DeliveryPanel({ customer, delivery, onChange, onToggle }) {
    const [addresses, setAddresses] = useState([]);
    const customerId = customer?.id;

    // Load the customer's saved addresses and start on the default one.
    useEffect(() => {
        if (!customerId) return undefined;
        let active = true;
        getAddresses(customerId)
            .then((list) => {
                if (!active) return;
                setAddresses(list);
                onChange((d) => ({ ...d, savedAddressId: list[0]?.id ?? null }));
            })
            .catch(() => active && setAddresses([]));
        return () => {
            active = false;
        };
    }, [customerId, onChange]);

    const set = (patch) => onChange((d) => ({ ...d, ...patch }));
    const saved = customerId ? addresses : [];

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <label className={`flex items-center gap-3 ${customer ? "cursor-pointer" : "opacity-60"}`}>
                <input
                    type="checkbox"
                    checked={delivery.enabled}
                    disabled={!customer}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="h-4 w-4 accent-slate-900"
                />
                <Truck size={18} className="text-slate-500" />
                <span>
                    <span className="block text-sm font-bold text-slate-900">Deliver this order</span>
                    <span className="block text-xs text-slate-500">
                        {customer ? "Phone or WhatsApp order — track it in Online Orders." : "Select the customer first."}
                    </span>
                </span>
            </label>

            {delivery.enabled && customer && (
                <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: "PHONE", label: "Phone", icon: Phone },
                            { value: "WHATSAPP", label: "WhatsApp", icon: MessageCircle },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => set({ channel: value })}
                                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
                                    delivery.channel === value
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <Icon size={16} /> {label}
                            </button>
                        ))}
                    </div>

                    {saved.length > 0 && (
                        <select
                            value={delivery.savedAddressId ?? "new"}
                            onChange={(e) => set({ savedAddressId: e.target.value === "new" ? null : Number(e.target.value) })}
                            aria-label="Deliver to"
                            className={fieldClass}
                        >
                            {saved.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.label} — {a.addressLine1}, {a.city}
                                </option>
                            ))}
                            <option value="new">A new address…</option>
                        </select>
                    )}

                    {delivery.savedAddressId === null && (
                        <div className="space-y-2.5">
                            <AddressFields value={delivery.address} onChange={(address) => set({ address })} />
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={delivery.saveAddress}
                                    onChange={(e) => set({ saveAddress: e.target.checked })}
                                    className="accent-slate-900"
                                />
                                Save to {customer.name}&apos;s addresses
                            </label>
                        </div>
                    )}

                    <textarea
                        value={delivery.notes}
                        onChange={(e) => set({ notes: e.target.value })}
                        rows={2}
                        maxLength={500}
                        placeholder="Delivery notes (optional)"
                        aria-label="Delivery notes"
                        className={`${fieldClass} py-2.5`}
                    />
                </div>
            )}
        </section>
    );
}

export default DeliveryPanel;
