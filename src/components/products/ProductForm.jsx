import { useEffect, useState } from "react";

import {
    createProduct,
    updateProduct,
} from "../../services/productApi";

import {
    getCategories,
} from "../../services/categoryApi";

import {
    toast,
} from "sonner";

import { Package } from "lucide-react";

import FormField from "./FormField";
import FormSection from "./FormSection";
import ProductSeoFields from "./ProductSeoFields";
import ProductWebsiteFields from "./ProductWebsiteFields";
import {
    EMPTY_PRODUCT_FORM,
    inputClasses,
} from "../../constants/productForm";
import {
    isValidSlug,
    slugify,
} from "../../utils/slug";


function ProductForm({
                         product,
                         onSuccess,
                         onClose,
                     }) {

    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);

    // ProductModal remounts this form per product, so the initial state is enough.
    const [form, setForm] = useState(() => toForm(product));

    // New products take their page address from the full name until staff edit it.
    const [slugTouched, setSlugTouched] = useState(false);

    const isNew = !product;
    const slugIsAuto = isNew && !slugTouched;
    const slug = slugIsAuto
        ? slugify(form.fullName || form.name)
        : form.slug;


    useEffect(() => {

        getCategories()
            .then(setCategories)
            .catch(error => {

                console.error(error);

                toast.error(
                    "Failed to load categories."
                );

            });

    }, []);


    function handleChange(e) {

        const {
            name,
            value,
        } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value,
        }));

    }


    function handleSlugChange(value) {

        setSlugTouched(true);

        setForm(previous => ({
            ...previous,
            slug: value
                .toLowerCase()
                .replace(/\s+/g, "-"),
        }));

    }


    function handleSlugReset() {

        setSlugTouched(false);

        setForm(previous => ({
            ...previous,
            slug: slugify(previous.fullName || previous.name),
        }));

    }


    async function handleSubmit() {

        if (!form.name.trim()) {

            toast.error(
                "Short name is required."
            );

            return;
        }


        if (!slugIsAuto && !isValidSlug(slug)) {

            toast.error(
                "Page address can only use lowercase letters, numbers and single hyphens."
            );

            return;
        }


        if (!form.categoryId) {

            toast.error(
                "Please select a category."
            );

            return;
        }


        if (
            form.buyingPrice === "" ||
            Number(form.buyingPrice) < 0
        ) {

            toast.error(
                "Please enter a valid buying price."
            );

            return;
        }


        if (
            form.sellingPrice === "" ||
            Number(form.sellingPrice) < 0
        ) {

            toast.error(
                "Please enter a valid selling price."
            );

            return;
        }


        if (
            Number(form.sellingPrice) <
            Number(form.buyingPrice)
        ) {

            toast.error(
                "Selling price must be greater than or equal to buying price."
            );

            return;
        }


        if (
            form.stockQuantity === "" ||
            Number(form.stockQuantity) < 0
        ) {

            toast.error(
                "Please enter a valid stock quantity."
            );

            return;
        }


        if (
            form.minimumStock === "" ||
            Number(form.minimumStock) < 0
        ) {

            toast.error(
                "Please enter a valid minimum stock."
            );

            return;
        }


        try {

            setSaving(true);

            const payload = {

                name: form.name.trim(),

                categoryId:
                    Number(form.categoryId),

                buyingPrice:
                    Number(form.buyingPrice),

                sellingPrice:
                    Number(form.sellingPrice),

                stockQuantity:
                    Number(form.stockQuantity),

                minimumStock:
                    Number(form.minimumStock),

                imageUrl:
                    form.imageUrl.trim() || null,

                fullName:
                    form.fullName.trim() || null,

                description:
                    form.description.trim() || null,

                showOnWebsite:
                    form.showOnWebsite,

                // Blank lets the server choose a free address from the full name.
                slug:
                    slugIsAuto ? null : slug,

                seoTitle:
                    form.seoTitle.trim() || null,

                seoDescription:
                    form.seoDescription.trim() || null,

                seoKeywords:
                    form.seoKeywords.trim() || null,

                imageAlt:
                    form.imageAlt.trim() || null,

            };


            if (product) {

                await updateProduct(
                    product.id,
                    payload
                );

                toast.success(
                    "Product updated successfully."
                );

            } else {

                await createProduct(payload);

                toast.success(
                    "Product created successfully."
                );

            }


            await onSuccess();

            onClose();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ??
                "Failed to save product."
            );

        } finally {

            setSaving(false);

        }

    }


    return (

        <div className="space-y-6">

            <FormSection
                icon={Package}
                title="Product Details"
                description="Names, prices and stock."
            >

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-5
            ">


                {/* Short Name */}
                <FormField
                    label="Short Name (POS)"
                    htmlFor="product-name"
                    required
                    hint="Shown on POS screens and labels."
                >

                    <input
                        id="product-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        maxLength={150}
                        placeholder="e.g. Pocket Scale 200g"
                        className={inputClasses}
                    />

                </FormField>


                {/* Full Name */}
                <FormField
                    label="Full Name"
                    htmlFor="product-full-name"
                    hint="Shown on the website and printed on invoices. Blank uses the short name."
                >

                    <input
                        id="product-full-name"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        maxLength={255}
                        placeholder="e.g. MYNIX Digital Pocket Scale 200g × 0.01g"
                        className={inputClasses}
                    />

                </FormField>


                {/* Category */}
                <FormField
                    label="Category"
                    required
                >

                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className={inputClasses}
                    >

                        <option value="">
                            Select Category
                        </option>

                        {categories
                            .filter(
                                category =>
                                    category.active !== false
                            )
                            .map(category => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>

                            ))}

                    </select>

                </FormField>


                {/* Buying Price */}
                <FormField label="Buying Price">

                    <div className="relative">

                        <span className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-sm
                            text-slate-400
                        ">
                            Rs.
                        </span>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="buyingPrice"
                            value={form.buyingPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            className={`${inputClasses} pl-11`}
                        />

                    </div>

                </FormField>


                {/* Selling Price */}
                <FormField label="Selling Price">

                    <div className="relative">

                        <span className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-sm
                            text-slate-400
                        ">
                            Rs.
                        </span>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="sellingPrice"
                            value={form.sellingPrice}
                            onChange={handleChange}
                            placeholder="0.00"
                            className={`${inputClasses} pl-11`}
                        />

                    </div>

                </FormField>


                {/* Opening Stock */}
                <FormField label="Opening Stock">

                    <input
                        type="number"
                        min="0"
                        name="stockQuantity"
                        value={form.stockQuantity}
                        onChange={handleChange}
                        placeholder="0"
                        className={inputClasses}
                    />

                </FormField>


                {/* Minimum Stock */}
                <FormField label="Minimum Stock">

                    <input
                        type="number"
                        min="0"
                        name="minimumStock"
                        value={form.minimumStock}
                        onChange={handleChange}
                        placeholder="5"
                        className={inputClasses}
                    />

                </FormField>


            </div>

            </FormSection>


            <ProductWebsiteFields
                form={form}
                onChange={handleChange}
                onToggleWebsite={(showOnWebsite) =>
                    setForm(previous => ({
                        ...previous,
                        showOnWebsite,
                    }))
                }
            />


            <ProductSeoFields
                form={form}
                slug={slug}
                slugIsAuto={slugIsAuto}
                isNew={isNew}
                onChange={handleChange}
                onSlugChange={handleSlugChange}
                onSlugReset={handleSlugReset}
            />


            {/* Actions */}
            <div className="
                flex
                flex-col-reverse
                sm:flex-row
                sm:justify-end
                gap-3
                pt-4
                border-t
                border-slate-100
            ">

                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="
                        w-full
                        sm:w-auto
                        px-5
                        py-2.5
                        rounded-xl
                        border
                        border-slate-200
                        text-slate-600
                        font-medium
                        hover:bg-slate-50
                        disabled:opacity-50
                    "
                >
                    Cancel
                </button>


                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="
                        w-full
                        sm:w-auto
                        px-5
                        py-2.5
                        rounded-xl
                        bg-emerald-600
                        hover:bg-emerald-700
                        text-white
                        font-semibold
                        disabled:opacity-50
                    "
                >
                    {saving
                        ? "Saving..."
                        : product
                            ? "Update Product"
                            : "Save Product"
                    }
                </button>

            </div>

        </div>
    );
}


function toForm(product) {

    if (!product) {
        return EMPTY_PRODUCT_FORM;
    }

    return {
        name: product.name ?? "",
        fullName: product.fullName ?? product.name ?? "",
        categoryId: product.categoryId ?? "",
        buyingPrice: product.buyingPrice ?? "",
        sellingPrice: product.sellingPrice ?? "",
        stockQuantity: product.stockQuantity ?? "",
        minimumStock: product.minimumStock ?? "",
        imageUrl: product.imageUrl ?? "",
        imageAlt: product.imageAlt ?? "",
        description: product.description ?? "",
        showOnWebsite: product.showOnWebsite ?? true,
        slug: product.slug ?? "",
        seoTitle: product.seoTitle ?? "",
        seoDescription: product.seoDescription ?? "",
        seoKeywords: product.seoKeywords ?? "",
    };
}


export default ProductForm;