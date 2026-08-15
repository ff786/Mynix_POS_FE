import { useEffect, useState } from "react";

import ProductToolbar from "../components/products/ProductToolbar";
import ProductTable from "../components/products/ProductTable";

import ProductModal from "@/components/products/ProductModal.jsx";
import PrintLabelModal from "@/components/products/PrintLabelModal";
import DeleteDialog from "../components/products/DeleteDialog";

import { getProducts, deleteProduct } from "../services/productApi";
import { toast } from "sonner";


function Products() {


    // PRODUCTS
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // SEARCH / FILTER
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");


    // PRODUCT MODAL
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    // DELETE
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);


    // LABEL PRINTING
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [printLabelOpen, setPrintLabelOpen] =
        useState(false);

    const [productsToPrint, setProductsToPrint] =
        useState([]);

    useEffect(() => {
        loadProducts();
    }, []);


    async function loadProducts() {

        try {

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load products."
            );

        } finally {

            setLoading(false);

        }
    }

    // SEARCH + DATE FILTER
    const filteredProducts = products.filter((product) => {

        const searchValue =
            search.toLowerCase().trim();

        const matchesSearch =
            product.name
                ?.toLowerCase()
                .includes(searchValue) ||

            product.barcode
                ?.toLowerCase()
                .includes(searchValue);


        if (!dateFilter) {
            return matchesSearch;
        }


        // Make sure createdAt exists
        if (!product.createdAt) {
            return false;
        }


        const productDate =
            new Date(product.createdAt)
                .toISOString()
                .split("T")[0];


        return (
            matchesSearch &&
            productDate === dateFilter
        );

    });

    function toggleProductSelection(product) {

        setSelectedProducts((previous) => {

            const exists =
                previous.some(
                    item =>
                        item.id === product.id
                );


            if (exists) {

                return previous.filter(
                    item =>
                        item.id !== product.id
                );

            }


            return [
                ...previous,
                product
            ];

        });

    }

    function toggleSelectAll() {

        const allSelected =
            filteredProducts.length > 0 &&
            filteredProducts.every(
                product =>
                    selectedProducts.some(
                        selected =>
                            selected.id === product.id
                    )
            );
        if (allSelected) {

            setSelectedProducts(previous =>
                previous.filter(
                    selected =>
                        !filteredProducts.some(
                            product =>
                                product.id === selected.id
                        )
                )
            );

            return;
        }

        setSelectedProducts(previous => {

            const existingIds =
                new Set(
                    previous.map(
                        product =>
                            product.id
                    )
                );


            const newProducts =
                filteredProducts.filter(
                    product =>
                        !existingIds.has(
                            product.id
                        )
                );


            return [
                ...previous,
                ...newProducts
            ];

        });

    }



    // DELETE PRODUCT
    async function handleDelete() {

        if (!productToDelete) {
            return;
        }


        try {

            await deleteProduct(
                productToDelete.id
            );


            toast.success(
                "Product deleted successfully."
            );


            setDeleteOpen(false);

            setProductToDelete(null);


            // Remove deleted product from
            // selected labels if necessary

            setSelectedProducts(previous =>
                previous.filter(
                    product =>
                        product.id !==
                        productToDelete.id
                )
            );


            await loadProducts();


        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to delete product."
            );

        }

    }



    // OPEN SINGLE PRODUCT LABEL
    function handlePrintLabel(product) {

        setProductsToPrint([
            product
        ]);

        setPrintLabelOpen(true);

    }



    // OPEN MULTIPLE PRODUCT LABELS
    function handlePrintSelected() {
        if (selectedProducts.length === 0) {
            toast.error(
                "Please select at least one product."
            );
            return;
        }
        setProductsToPrint(
            selectedProducts
        );
        setPrintLabelOpen(true);
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading products...
            </div>
        );
    }

    return (

        <div className="space-y-5">


            {/*
                TOOLBAR
             */}

            <ProductToolbar
                search={search}
                setSearch={setSearch}
                onAdd={() => {

                    setSelectedProduct(null);

                    setModalOpen(true);

                }}
            />

            <div className="flex items-center justify-between gap-4">
                {/* DATE FILTER */}
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) =>
                            setDateFilter(
                                e.target.value
                            )
                        }
                        className="
                            border
                            rounded-lg
                            px-4
                            py-2.5
                            bg-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-500
                        "
                    />
                    {dateFilter && (
                        <button
                            type="button"
                            onClick={() =>
                                setDateFilter("")
                            }
                            className="
                                text-sm
                                text-slate-500
                                hover:text-slate-900
                            "
                        >
                            Clear Date
                        </button>
                    )}
                </div>

                {/* PRINT SELECTED */}
                {selectedProducts.length > 0 && (
                    <button
                        type="button"
                        onClick={handlePrintSelected}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            px-4
                            py-2.5
                            rounded-lg
                            font-medium
                            transition
                        "
                    >Print Selected Labels
                        <span
                            className="
                                bg-white/20
                                px-2
                                py-0.5
                                rounded-full
                                text-sm
                            "
                        >
                            {selectedProducts.length}
                        </span>
                    </button>
                )}
            </div>


            {/*PRODUCT TABLE*/}
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
                onPrintLabel={handlePrintLabel}
                selectedProducts={selectedProducts}
                onSelect={toggleProductSelection}
                onSelectAll={toggleSelectAll}
            />

            {/*ADD / EDIT PRODUCT*/}
            <ProductModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                product={selectedProduct}
                onSuccess={loadProducts}
            />
            {/*PRINT LABEL MODAL*/}
            <PrintLabelModal
                open={printLabelOpen}
                onOpenChange={(open) => {
                    setPrintLabelOpen(open);
                    // Clear print selection
                    // when modal closes
                    if (!open) {
                        setProductsToPrint([]);
                    }
                }}
                products={productsToPrint}
            />


            {/*DELETE CONFIRMATION*/}
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