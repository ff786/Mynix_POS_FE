import { useEffect, useState } from "react";

import CategoryToolbar from "@/components/categories/CategoryToolbar";
import CategoryTable from "@/components/categories/CategoryTable";
import CategoryModal from "@/components/categories/CategoryModal";

import DeleteCategoryDialog from "@/components/categories/DeleteCategoryDialog";

import {
    getCategories,
    deleteCategory,
} from "@/services/categoryApi";

import { toast } from "sonner";


function Categories() {

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [modalOpen, setModalOpen] =
        useState(false);

    const [selectedCategory, setSelectedCategory] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [categoryToDelete, setCategoryToDelete] =
        useState(null);


    useEffect(() => {
        loadCategories();
    }, []);


    async function loadCategories() {

        try {

            const data =
                await getCategories();

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


    const filteredCategories =
        categories.filter(category =>
            category.name
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );


    function handleEdit(category) {

        setSelectedCategory(category);

        setModalOpen(true);

    }


    function handleAdd() {

        setSelectedCategory(null);

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


    if (loading) {

        return (
            <div className="p-6">
                Loading categories...
            </div>
        );

    }


    return (

        <div className="space-y-5">

            <CategoryToolbar
                search={search}
                setSearch={setSearch}
                onAdd={handleAdd}
            />


            <CategoryTable
                categories={filteredCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


            <CategoryModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                category={selectedCategory}
                onSuccess={loadCategories}
            />


            <DeleteCategoryDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                product={categoryToDelete}
                onConfirm={confirmDelete}
            />

        </div>

    );
}

export default Categories;