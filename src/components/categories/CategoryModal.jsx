import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Layers3 } from "lucide-react";

import {
    createCategory,
    updateCategory,
} from "@/services/categoryApi";

import { toast } from "sonner";

function CategoryModal({
                           open,
                           onOpenChange,
                           category,
                           onSuccess,
                       }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (category) {
            setName(category.name || "");
            setDescription(category.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [category, open]);

    async function handleSubmit() {
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName) {
            toast.error("Category name is required.");
            return;
        }

        if (trimmedName.length > 100) {
            toast.error("Category name cannot exceed 100 characters.");
            return;
        }

        if (trimmedDescription.length > 255) {
            toast.error("Description cannot exceed 255 characters.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: trimmedName,
                description: trimmedDescription,
            };

            if (category) {
                await updateCategory(category.id, payload);
                toast.success("Category updated successfully.");
            } else {
                await createCategory(payload);
                toast.success("Category created successfully.");
            }

            await onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to save category."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-1rem)] max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl p-5 sm:p-6">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Layers3 size={18} className="text-emerald-600" />
                        </div>

                        <div>
                            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
                                {category ? "Edit Category" : "Add Category"}
                            </DialogTitle>

                            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                {category ? "Update your category details." : "Create a category for your products."}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-5 mt-3">
                    {/* Name */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                            Category Name
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Gem Instruments"
                            autoFocus
                            maxLength={100}
                            className="w-full h-11 border border-slate-200 rounded-xl bg-white px-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <div className="flex justify-end mt-1">
                            <span className="text-[11px] text-slate-400">
                                {name.length}/100
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                            Description
                            <span className="text-slate-400 font-normal ml-1">
                                Optional
                            </span>
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe this category..."
                            rows={4}
                            maxLength={255}
                            className="w-full border border-slate-200 rounded-xl bg-white px-3.5 py-3 text-sm outline-none resize-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <div className="flex justify-end mt-1">
                            <span className="text-[11px] text-slate-400">
                                {description.length}/255
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving || !name.trim()}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50 transition"
                        >
                            {saving
                                ? "Saving..."
                                : category
                                    ? "Update Category"
                                    : "Add Category"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CategoryModal;