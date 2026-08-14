import { useEffect, useState } from "react";
import { createProduct, updateProduct } from "../../services/productApi";
import { getCategories } from "../../services/categoryApi";
import {toast} from "sonner";

function ProductForm({ product, onSuccess, onClose }) {
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
                name: product.name,
                categoryId: product.categoryId || "",
                buyingPrice: product.buyingPrice,
                sellingPrice: product.sellingPrice,
                stockQuantity: product.stockQuantity,
                minimumStock: product.minimumStock,
                imageUrl: product.imageUrl || ""
            });
        } else {
            setForm({
                name: "",
                categoryId: "",
                buyingPrice: "",
                sellingPrice: "",
                stockQuantity: "",
                minimumStock: "",
                imageUrl: ""
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

            if (product?.categoryId) {
                setForm((prev) => ({
                    ...prev,
                    categoryId: product.categoryId,
                }));
            }
        } catch (err) {
            console.error(err);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit() {
        if (!form.name.trim()) {
            toast.error("Product name is required.");
            return;
        }

        if (!form.categoryId) {
            toast.error("Please select a category.");
            return;
        }

        if (Number(form.sellingPrice) < Number(form.buyingPrice)) {
            toast.error("Selling price must be greater than buying price.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...form,
                categoryId: Number(form.categoryId),
                buyingPrice: Number(form.buyingPrice),
                sellingPrice: Number(form.sellingPrice),
                stockQuantity: Number(form.stockQuantity),
                minimumStock: Number(form.minimumStock),
            };

            if (product) {
                await updateProduct(product.id, payload);
            } else {
                await createProduct(payload);
                toast.success(
                    product
                        ? "Product updated successfully."
                        : "Product created successfully."
                );
            }

            onSuccess();
            onClose();

        } catch (err) {
            console.error(err);
            toast.error("Failed to save product.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-2 gap-5">

                <div>
                    <label className="block mb-2 font-medium">
                        Product Name
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Category
                    </label>

                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="">Select Category</option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Buying Price
                    </label>

                    <input
                        type="number"
                        name="buyingPrice"
                        value={form.buyingPrice}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Selling Price
                    </label>

                    <input
                        type="number"
                        name="sellingPrice"
                        value={form.sellingPrice}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Opening Stock
                    </label>

                    <input
                        type="number"
                        name="stockQuantity"
                        value={form.stockQuantity}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Minimum Stock
                    </label>

                    <input
                        type="number"
                        name="minimumStock"
                        value={form.minimumStock}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block mb-2 font-medium">
                        Image URL (Optional)
                    </label>

                    <input
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

            </div>

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onClose}
                    className="border px-5 py-2 rounded-lg"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Product"}
                </button>

            </div>

        </div>
    );
}

export default ProductForm;