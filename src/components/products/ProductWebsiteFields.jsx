import { Globe } from "lucide-react";

import FormField from "./FormField";
import FormSection from "./FormSection";
import { inputClasses } from "../../constants/productForm";


/** Website visibility, the detailed description and the product photo. */
function ProductWebsiteFields({
                                  form,
                                  onChange,
                                  onToggleWebsite,
                              }) {

    return (

        <FormSection
            icon={Globe}
            title="Website"
            description="What customers see on the product page at mynix.lk."
            action={
                <WebsiteSwitch
                    checked={form.showOnWebsite}
                    onChange={onToggleWebsite}
                />
            }
        >

            {!form.showOnWebsite && (
                <p className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
                    Hidden from the website. It stays available in the POS, but customers can&apos;t see or order it online.
                </p>
            )}

            <div className="space-y-5">

                <FormField
                    label="Detailed Description"
                    htmlFor="product-description"
                    hint={
                        <>
                            Leave a blank line to start a new paragraph. Start a line with &quot;- &quot; for a bullet point.
                            <span className="float-right tabular-nums">
                                {form.description.length.toLocaleString()} / 10,000
                            </span>
                        </>
                    }
                >

                    <textarea
                        id="product-description"
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        rows={8}
                        maxLength={10000}
                        placeholder={"What it is, who it's for and why it's good.\n\n- 10x magnification\n- Triplet lens, chrome housing"}
                        className={`${inputClasses} h-auto py-3 leading-relaxed`}
                    />

                </FormField>


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <FormField
                        label="Product Image URL"
                        htmlFor="product-image"
                        hint="Optional. Paste a publicly accessible https image link."
                    >

                        <input
                            id="product-image"
                            name="imageUrl"
                            type="url"
                            value={form.imageUrl}
                            onChange={onChange}
                            placeholder="https://example.com/product-image.jpg"
                            className={inputClasses}
                        />

                    </FormField>


                    <FormField
                        label="Image Description (Alt Text)"
                        htmlFor="product-image-alt"
                        hint="Describe the photo for Google Images and screen readers. Blank uses the full name."
                    >

                        <input
                            id="product-image-alt"
                            name="imageAlt"
                            value={form.imageAlt}
                            onChange={onChange}
                            maxLength={160}
                            placeholder="e.g. MYNIX 10x triplet loupe with chrome housing"
                            className={inputClasses}
                        />

                    </FormField>

                </div>

            </div>

        </FormSection>
    );
}


function WebsiteSwitch({
                           checked,
                           onChange,
                       }) {

    return (

        <label className="flex shrink-0 cursor-pointer items-center gap-2.5">

            <span className="text-sm font-medium text-slate-600">
                {checked ? "Shown" : "Hidden"}
            </span>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label="Show on website"
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                    checked ? "bg-emerald-600" : "bg-slate-300"
                }`}
            >
                <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        checked ? "left-[22px]" : "left-0.5"
                    }`}
                />
            </button>

        </label>
    );
}

export default ProductWebsiteFields;
