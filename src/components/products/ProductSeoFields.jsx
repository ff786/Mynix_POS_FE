import { RotateCcw, Search } from "lucide-react";

import FormField from "./FormField";
import FormSection from "./FormSection";
import {
    inputClasses,
    SEO_DESCRIPTION_IDEAL,
    SEO_DESCRIPTION_MAX,
    SEO_TITLE_IDEAL,
    SEO_TITLE_MAX,
    WEBSITE_URL,
} from "../../constants/productForm";


/** Per-product search engine settings, with a preview of the Google result. */
function ProductSeoFields({
                              form,
                              slug,
                              slugIsAuto,
                              isNew,
                              onChange,
                              onSlugChange,
                              onSlugReset,
                          }) {

    const displayName = form.fullName.trim() || form.name.trim() || "Product name";
    const previewTitle = form.seoTitle.trim() || `${displayName} · MYNIX Gemology`;
    const previewDescription =
        form.seoDescription.trim() ||
        summarise(form.description) ||
        "Add a description so search engines have something to show here.";
    const host = WEBSITE_URL.replace(/^https?:\/\//, "");

    return (

        <FormSection
            icon={Search}
            title="Search Engine Optimisation (SEO)"
            description="How this product appears on Google. Leave fields blank to use the full name and description."
        >

            <div className="space-y-5">

                {/* Google preview */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Google preview
                    </p>

                    <p className="truncate text-xs text-slate-600">
                        {host} › products › {slug}
                    </p>

                    <p className="mt-1 line-clamp-1 text-lg leading-snug text-blue-800">
                        {previewTitle}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {previewDescription}
                    </p>

                </div>


                <FormField
                    label="Page Address"
                    htmlFor="product-slug"
                    hint={
                        isNew
                            ? "Made from the full name. Use lowercase letters, numbers and hyphens."
                            : "Changing this breaks links people have already shared or bookmarked."
                    }
                >

                    <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">

                        <span className="hidden items-center border-r border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 sm:flex">
                            {host}/products/
                        </span>

                        <input
                            id="product-slug"
                            value={slug}
                            onChange={(e) => onSlugChange(e.target.value)}
                            maxLength={120}
                            autoCapitalize="none"
                            spellCheck={false}
                            className="h-11 min-w-0 flex-1 bg-white px-3.5 font-mono text-sm text-slate-900 outline-none"
                        />

                        {!slugIsAuto && (
                            <button
                                type="button"
                                onClick={onSlugReset}
                                title="Make it from the full name again"
                                className="flex items-center gap-1.5 border-l border-slate-200 px-3 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            >
                                <RotateCcw size={14} />
                                Auto
                            </button>
                        )}

                    </div>

                </FormField>


                <FormField
                    label="SEO Title"
                    htmlFor="product-seo-title"
                    hint={
                        <Counter
                            text="The blue link in search results. Put the most important words first."
                            length={form.seoTitle.length}
                            ideal={SEO_TITLE_IDEAL}
                            max={SEO_TITLE_MAX}
                        />
                    }
                >

                    <input
                        id="product-seo-title"
                        name="seoTitle"
                        value={form.seoTitle}
                        onChange={onChange}
                        maxLength={SEO_TITLE_MAX}
                        placeholder={`${displayName} · MYNIX Gemology`}
                        className={inputClasses}
                    />

                </FormField>


                <FormField
                    label="Meta Description"
                    htmlFor="product-seo-description"
                    hint={
                        <Counter
                            text="The two lines under the link. Say what it is and why to buy it here."
                            length={form.seoDescription.length}
                            ideal={SEO_DESCRIPTION_IDEAL}
                            max={SEO_DESCRIPTION_MAX}
                        />
                    }
                >

                    <textarea
                        id="product-seo-description"
                        name="seoDescription"
                        value={form.seoDescription}
                        onChange={onChange}
                        rows={3}
                        maxLength={SEO_DESCRIPTION_MAX}
                        placeholder="e.g. Professional 10x triplet loupe for gem grading. Cash on delivery across Sri Lanka."
                        className={`${inputClasses} h-auto py-3 leading-relaxed`}
                    />

                </FormField>


                <FormField
                    label="Keywords"
                    htmlFor="product-seo-keywords"
                    hint="Separate with commas, e.g. gem loupe, 10x loupe, jeweller's loupe sri lanka. Google doesn't rank on these, but other search engines and site search can use them."
                >

                    <input
                        id="product-seo-keywords"
                        name="seoKeywords"
                        value={form.seoKeywords}
                        onChange={onChange}
                        maxLength={255}
                        className={inputClasses}
                    />

                </FormField>

            </div>

        </FormSection>
    );
}


function Counter({
                     text,
                     length,
                     ideal,
                     max,
                 }) {

    const colour =
        length === 0
            ? "text-slate-400"
            : length <= ideal
                ? "text-emerald-600"
                : "text-amber-600";

    return (
        <span className="flex justify-between gap-4">
            <span>{text}</span>
            <span className={`shrink-0 tabular-nums ${colour}`}>
                {length} / {max}
            </span>
        </span>
    );
}


/** The first ~155 characters of the description, as search engines would show it. */
function summarise(description) {

    const text = description
        .replace(/^\s*-\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim();

    return text.length > SEO_DESCRIPTION_IDEAL
        ? `${text.slice(0, SEO_DESCRIPTION_IDEAL - 1).replace(/\s+\S*$/, "")}…`
        : text;
}

export default ProductSeoFields;
