import { useEffect, useState } from "react";
import { Layers, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import FormField from "./FormField";
import FormSection from "./FormSection";
import { inputClasses } from "../../constants/productForm";
import {
    createVariantGroup,
    deleteVariantGroup,
    getVariantGroups,
} from "../../services/variantGroupApi";


const OPTION_NAMES = ["Colour", "Size", "Grit", "Capacity", "Type"];


/**
 * Variable products. The website groups same-category, same-price products on
 * its own; a group chosen here overrides that (join different prices, or keep a
 * product separate by giving it a group of its own). Each option stays its own
 * product in the POS.
 */
function ProductVariantFields({
                                  productId,
                                  form,
                                  onChange,
                                  onGroupChange,
                              }) {

    const [groups, setGroups] = useState([]);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [draft, setDraft] = useState({ name: "", optionName: "Colour" });

    useEffect(() => {

        getVariantGroups()
            .then(setGroups)
            .catch(error => {

                console.error(error);

                toast.error(
                    "Failed to load variant groups."
                );

            });

    }, []);


    const group = groups.find(g => String(g.id) === String(form.variantGroupId));
    const siblings = (group?.products ?? []).filter(p => p.id !== productId);


    async function handleCreate() {

        if (!draft.name.trim()) {

            toast.error(
                "Enter a group name, e.g. Gem Box 2x2."
            );

            return;
        }

        try {

            setSaving(true);

            const created = await createVariantGroup({
                name: draft.name.trim(),
                optionName: draft.optionName.trim() || null,
            });

            setGroups(previous => [...previous, created]);
            onGroupChange(String(created.id));
            setCreating(false);
            setDraft({ name: "", optionName: "Colour" });

            toast.success(
                `Group "${created.name}" created.`
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ??
                "Failed to create the group."
            );

        } finally {

            setSaving(false);

        }

    }


    async function handleDelete() {

        const count = group.products.length;

        const confirmed = window.confirm(
            `Delete the group "${group.name}"?`
            + (count
                ? ` Its ${count} product${count === 1 ? "" : "s"} will stay in the POS and go back to automatic grouping.`
                : "")
        );

        if (!confirmed) return;

        try {

            setDeleting(true);

            await deleteVariantGroup(group.id);

            setGroups(previous => previous.filter(g => g.id !== group.id));
            onGroupChange("");

            toast.success(
                `Group "${group.name}" deleted.`
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ??
                "Failed to delete the group."
            );

        } finally {

            setDeleting(false);

        }

    }


    return (

        <FormSection
            icon={Layers}
            title="Variants"
            description="The website automatically shows products in the same category at the same price as one listing with options. Use a group here to override: join products with different prices, or give a product its own group to keep it separate."
            action={
                !creating && (
                    <button
                        type="button"
                        onClick={() => setCreating(true)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Plus size={15} />
                        New group
                    </button>
                )
            }
        >

            {creating && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">

                        <FormField
                            label="Group Name"
                            htmlFor="variant-group-name"
                            hint="The listing name on the website."
                        >

                            <input
                                id="variant-group-name"
                                value={draft.name}
                                onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
                                maxLength={150}
                                placeholder="e.g. Gem Box 2x2"
                                className={inputClasses}
                            />

                        </FormField>


                        <FormField
                            label="Options Are"
                            htmlFor="variant-option-name"
                            hint="What customers choose."
                        >

                            <input
                                id="variant-option-name"
                                list="variant-option-names"
                                value={draft.optionName}
                                onChange={(e) => setDraft(d => ({ ...d, optionName: e.target.value }))}
                                maxLength={40}
                                className={inputClasses}
                            />

                            <datalist id="variant-option-names">
                                {OPTION_NAMES.map(name => (
                                    <option key={name} value={name} />
                                ))}
                            </datalist>

                        </FormField>

                    </div>

                    <div className="mt-4 flex justify-end gap-2">

                        <button
                            type="button"
                            onClick={() => setCreating(false)}
                            disabled={saving}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={saving}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {saving ? "Creating..." : "Create group"}
                        </button>

                    </div>

                </div>
            )}


            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <FormField
                    label="Variant Group"
                    htmlFor="variant-group"
                >

                    <select
                        id="variant-group"
                        value={form.variantGroupId}
                        onChange={(e) => onGroupChange(e.target.value)}
                        className={inputClasses}
                    >

                        <option value="">
                            Automatic (same category and price)
                        </option>

                        {groups.map(g => (
                            <option
                                key={g.id}
                                value={g.id}
                            >
                                {g.name} · {g.optionName} ({g.products.length})
                            </option>
                        ))}

                    </select>

                </FormField>


                {group && (
                    <FormField
                        label={`${group.optionName} of This Product`}
                        htmlFor="variant-label"
                        required
                        hint="Shown on the website's option buttons."
                    >

                        <input
                            id="variant-label"
                            name="variantLabel"
                            value={form.variantLabel}
                            onChange={onChange}
                            maxLength={60}
                            placeholder={group.optionName === "Colour" ? "e.g. Black" : "e.g. 14.5x11.5cm"}
                            className={inputClasses}
                        />

                    </FormField>
                )}

            </div>


            {group && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">

                    <span className="text-slate-500">
                        {siblings.length
                            ? "Other options in this group:"
                            : "Only product in this group, so the website shows it on its own."}
                    </span>

                    {siblings.map(p => (
                        <span
                            key={p.id}
                            title={p.name}
                            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                            {p.variantLabel}
                        </span>
                    ))}

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        <Trash2 size={14} />
                        {deleting ? "Deleting..." : "Delete group"}
                    </button>

                </div>
            )}

        </FormSection>
    );
}

export default ProductVariantFields;
