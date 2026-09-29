/** Page address from a product name: "10x Magnifying Loupe" -> "10x-magnifying-loupe" (matches the backend). */
export function slugify(text) {
    const slug = (text ?? "")
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100)
        .replace(/-+$/, "");

    return slug || "product";
}

export const isValidSlug = (value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
