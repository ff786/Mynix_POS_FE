import { useEffect, useMemo, useState } from "react";
import { Layers3, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import CategoryToolbar from "@/components/categories/CategoryToolbar";
import CategoryTable from "@/components/categories/CategoryTable";
import CategoryModal from "@/components/categories/CategoryModal";
import DeleteCategoryDialog from "@/components/categories/DeleteCategoryDialog";

import {
    getCategories,
    deleteCategory,
} from "@/services/categoryApi";


function Categories() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);


    useEffect(() => {
        loadCategories();
    }, []);


    async function loadCategories() {

        try {

            setLoading(true);

            const data = await getCategories();

            setCategories(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load categories."
            );

        } finally {

            setLoading(false);

        }
    }


    const filteredCategories = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return categories;
        }

        return categories.filter(category => {

            const name =
                category.name?.toLowerCase() || "";

            const description =
                category.description?.toLowerCase() || "";

            return (
                name.includes(query) ||
                description.includes(query)
            );

        });

    }, [categories, search]);


    function handleAdd() {

        setSelectedCategory(null);
        setModalOpen(true);

    }


    function handleEdit(category) {

        setSelectedCategory(category);
        setModalOpen(true);

    }


    function handleDelete(category) {

        setCategoryToDelete(category);
        setDeleteOpen(true);

    }


    async function confirmDelete() {

        if (!categoryToDelete) {
            return;
        }

        try {

            await deleteCategory(
                categoryToDelete.id
            );

            toast.success(
                "Category deleted successfully."
            );

            setDeleteOpen(false);
            setCategoryToDelete(null);

            await loadCategories();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete category."
            );

        }

    }


    function clearSearch() {
        setSearch("");
    }


    if (loading) {

        return (

            <div className="w-full max-w-[1600px] mx-auto space-y-6">

                {/* Header skeleton */}
                <div className="
                    h-32
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    animate-pulse
                " />

                {/* Table skeleton */}
                <div className="
                    h-[420px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    animate-pulse
                " />

            </div>

        );

    }


    return (

        <div className="
            w-full
            max-w-[1600px]
            mx-auto
            space-y-5
        ">

            {/* Toolbar */}
            <CategoryToolbar
                search={search}
                setSearch={setSearch}
                onAdd={handleAdd}
            />


            {/* Results bar */}
            <div className="
                flex
                items-center
                justify-between
                gap-3
                px-1
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-500
                ">

                    <div className="
                        w-8
                        h-8
                        rounded-lg
                        bg-emerald-50
                        flex
                        items-center
                        justify-center
                    ">

                        <Layers3
                            size={16}
                            className="text-emerald-600"
                        />

                    </div>

                    <span>

                        <span className="
                            font-semibold
                            text-slate-700
                        ">
                            {filteredCategories.length}
                        </span>{" "}
                        {filteredCategories.length === 1
                            ? "category"
                            : "categories"}

                    </span>

                </div>


                {search && (

                    <button
                        type="button"
                        onClick={clearSearch}
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            sm:text-sm
                            font-medium
                            text-slate-500
                            hover:text-slate-900
                            transition
                        "
                    >

                        Clear search

                        <X size={14} />

                    </button>

                )}

            </div>


            {/* Category content */}
            <CategoryTable
                categories={filteredCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


            {/* Add/Edit modal */}
            <CategoryModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                category={selectedCategory}
                onSuccess={loadCategories}
            />


            {/* Delete modal */}
            <DeleteCategoryDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                category={categoryToDelete}
                onConfirm={confirmDelete}
            />

        </div>

    );
}

export default Categories;