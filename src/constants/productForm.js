/** The public website, for product page links and the search preview. */
export const WEBSITE_URL = (import.meta.env.VITE_WEBSITE_URL ?? "https://mynix.lk").replace(/\/+$/, "");

/** Search engines show about this much before cutting off. */
export const SEO_TITLE_IDEAL = 60;
export const SEO_TITLE_MAX = 70;
export const SEO_DESCRIPTION_IDEAL = 155;
export const SEO_DESCRIPTION_MAX = 170;

export const EMPTY_PRODUCT_FORM = {
    name: "",
    fullName: "",
    categoryId: "",
    buyingPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    minimumStock: "",
    imageUrl: "",
    imageAlt: "",
    description: "",
    showOnWebsite: true,
    slug: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    variantGroupId: "",
    variantLabel: "",
};

export const inputClasses = `
    w-full
    h-11
    border
    border-slate-200
    rounded-xl
    px-3.5
    text-sm
    bg-white
    text-slate-900
    outline-none
    shadow-sm
    transition
    focus:border-emerald-500
    focus:ring-4
    focus:ring-emerald-500/10
`;
