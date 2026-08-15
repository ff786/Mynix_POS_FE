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


function ProductForm({
                         product,
                         onSuccess,
                         onClose,
                     }) {

    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        buyingPrice: "",
        sellingPrice: "",
        stockQuantity: "",
        minimumStock: "",
        imageUrl: "",
    });


    useEffect(() => {

        if (product) {

            setForm({
                name: product.name ?? "",
                categoryId: product.categoryId ?? "",
                buyingPrice: product.buyingPrice ?? "",
                sellingPrice: product.sellingPrice ?? "",
                stockQuantity: product.stockQuantity ?? "",
                minimumStock: product.minimumStock ?? "",
                imageUrl: product.imageUrl ?? "",
            });

        } else {

            setForm({
                name: "",
                categoryId: "",
                buyingPrice: "",
                sellingPrice: "",
                stockQuantity: "",
                minimumStock: "",
                imageUrl: "",
            });

        }

    }, [product]);


    useEffect(() => {

        loadCategories();

    }, []);


    async function loadCategories() {

        try {

            const data = await getCategories();

            setCategories(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load categories."
            );

        }

    }


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


    async function handleSubmit() {

        if (!form.name.trim()) {

            toast.error(
                "Product name is required."
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

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-5
            ">


                {/* Product Name */}
                <FormField
                    label="Product Name"
                    required
                >

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Digital Pocket Scale"
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


                {/* Image URL */}
                <div className="sm:col-span-2">

                    <FormField
                        label="Product Image URL"
                    >

                        <input
                            name="imageUrl"
                            type="url"
                            value={form.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/product-image.jpg"
                            className={inputClasses}
                        />

                    </FormField>

                    <p className="
                        text-xs
                        text-slate-400
                        mt-2
                    ">
                        Optional. Paste a publicly accessible image URL.
                    </p>

                </div>

            </div>


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


function FormField({
                       label,
                       required,
                       children,
                   }) {

    return (

        <div>

            <label className="
                block
                mb-2
                text-sm
                font-semibold
                text-slate-700
            ">

                {label}

                {required && (
                    <span className="text-red-500 ml-1">
                        *
                    </span>
                )}

            </label>

            {children}

        </div>
    );
}


const inputClasses = `
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


export default ProductForm;