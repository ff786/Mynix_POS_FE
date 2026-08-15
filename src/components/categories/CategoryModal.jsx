import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

        if (category) {

            setName(category.name || "");
            setDescription(category.description || "");

        } else {

            setName("");
            setDescription("");

        }

    }, [category, open]);


    async function handleSubmit() {

        if (!name.trim()) {

            toast.error(
                "Category name is required."
            );

            return;
        }


        try {

            setSaving(true);

            const payload = {
                name: name.trim(),
                description: description.trim(),
            };


            if (category) {

                await updateCategory(
                    category.id,
                    payload
                );

                toast.success(
                    "Category updated successfully."
                );

            } else {

                await createCategory(payload);

                toast.success(
                    "Category created successfully."
                );

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

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-lg">

                <DialogHeader>

                    <DialogTitle className="text-xl">

                        {category
                            ? "Edit Category"
                            : "Add Category"}

                    </DialogTitle>

                </DialogHeader>


                <div className="space-y-5">

                    {/* NAME */}

                    <div>

                        <label className="block mb-2 text-sm font-medium">

                            Category Name

                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="e.g. Cue Equipment"
                            autoFocus
                            className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-3
                                outline-none
                                focus:ring-2
                                focus:ring-emerald-500
                            "
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div>

                        <label className="block mb-2 text-sm font-medium">

                            Description

                            <span className="text-slate-400 font-normal">
                                {" "}Optional
                            </span>

                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Describe this category..."
                            rows={4}
                            className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-3
                                outline-none
                                resize-none
                                focus:ring-2
                                focus:ring-emerald-500
                            "
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            className="
                                px-5
                                py-2.5
                                border
                                rounded-lg
                                hover:bg-slate-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving}
                            className="
                                px-5
                                py-2.5
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                rounded-lg
                                font-medium
                                disabled:opacity-50
                            "
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