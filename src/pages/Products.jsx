import { useEffect, useState } from "react";
import ProductToolbar from "../components/products/ProductToolbar";
import ProductTable from "../components/products/ProductTable";
import { getProducts } from "../services/productApi";

import ProductModal from "@/components/products/ProductModal.jsx";
import { deleteProduct } from "../services/productApi";
import DeleteDialog from "../components/products/DeleteDialog";
import {toast} from "sonner";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = products.filter(product => {
        const query = search.toLowerCase();
        return (
            product.name?.toLowerCase().includes(query) ||
            product.barcode?.toLowerCase().includes(query)
        );

    });

    if (loading) {
        return <div>Loading products...</div>;
    }

    async function handleDelete() {
        try {
            await deleteProduct(productToDelete.id);
            toast.success("Product deleted successfully.");
            setDeleteOpen(false);
            setProductToDelete(null);
            loadProducts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product.");
        }
    }

    return (

        <div>

            <ProductToolbar
                search={search}
                setSearch={setSearch}
                onAdd={() => {
                    setSelectedProduct(null);
                    setModalOpen(true);
                }}
            />
            <ProductTable
                products={filteredProducts}
                onEdit={(product) => {
                    setSelectedProduct(product);
                    setModalOpen(true);
                }}
                onDelete={(product) => {
                    setProductToDelete(product);
                    setDeleteOpen(true);
                }}
            />
            <ProductModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                product={selectedProduct}
                onSuccess={loadProducts}
            />
            <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                product={productToDelete}
                onConfirm={handleDelete}
            />

        </div>

    );

}

export default Products;