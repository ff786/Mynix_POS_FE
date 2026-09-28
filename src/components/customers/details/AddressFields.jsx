import { DISTRICTS } from "@/constants/districts";

export const fieldClass =
    "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";

/** Address inputs shared by the customer page and New Sale's delivery panel. */
function AddressFields({ value, onChange, showLabel = true }) {
    const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });

    return (
        <div className="grid gap-2.5">
            {showLabel && (
                <input value={value.label ?? ""} onChange={set("label")} maxLength={40} placeholder="Name, e.g. Home" aria-label="Address name" className={fieldClass} />
            )}
            <input value={value.addressLine1 ?? ""} onChange={set("addressLine1")} maxLength={200} placeholder="Address" aria-label="Address" className={fieldClass} />
            <input value={value.addressLine2 ?? ""} onChange={set("addressLine2")} maxLength={200} placeholder="Apartment, landmark (optional)" aria-label="Apartment, landmark" className={fieldClass} />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <input value={value.city ?? ""} onChange={set("city")} maxLength={100} placeholder="City" aria-label="City" className={fieldClass} />
                <select value={value.district ?? ""} onChange={set("district")} aria-label="District" className={fieldClass}>
                    <option value="">District…</option>
                    {DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <input value={value.postalCode ?? ""} onChange={set("postalCode")} maxLength={20} placeholder="Postal code" aria-label="Postal code" className={fieldClass} />
            </div>
        </div>
    );
}

export default AddressFields;
