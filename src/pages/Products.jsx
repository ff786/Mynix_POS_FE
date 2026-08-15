import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Printer, X } from "lucide-react";
import { toast } from "sonner";

import ProductToolbar from "../components/products/ProductToolbar";
import ProductTable from "../components/products/ProductTable";
import ProductModal from "../components/products/ProductModal";
import DeleteDialog from "../components/products/DeleteDialog";
import PrintLabelModal from "../components/products/PrintLabelModal";

import {
    getProducts,
    deleteProduct,
} from "../services/productApi";


function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [selectedProducts, setSelectedProducts] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [printLabelOpen, setPrintLabelOpen] = useState(false);
    const [productsToPrint, setProductsToPrint] = useState([]);


    useEffect(() => {
        loadProducts();
    }, []);


    async function loadProducts() {

        try {

            setLoading(true);

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            console.error(error);

            toast.error("Failed to load products.");

        } finally {

            setLoading(false);

        }
    }


    /*
     * Search + date filtering
     */
    const filteredProducts = useMemo(() => {

        const normalizedSearch =
            search.trim().toLowerCase();

        return products.filter((product) => {

            const matchesSearch =
                !normalizedSearch ||
                product.name
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                product.barcode
                    ?.toLowerCase()
                    .includes(normalizedSearch);

            if (!dateFilter) {
                return matchesSearch;
            }

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

    }, [products, search, dateFilter]);


    /*
     * Selection
     */
    function toggleProductSelection(product) {

        setSelectedProducts((previous) => {

            const exists = previous.some(
                item => item.id === product.id
            );

            if (exists) {

                return previous.filter(
                    item => item.id !== product.id
                );

            }

            return [
                ...previous,
                product,
            ];

        });

    }


    /*
     * Select / deselect all currently filtered products
     */
    function toggleSelectAll() {

        if (filteredProducts.length === 0) {
            return;
        }

        const allSelected =
            filteredProducts.every(product =>
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

        } else {

            setSelectedProducts(previous => {

                const existingIds =
                    new Set(
                        previous.map(
                            product => product.id
                        )
                    );

                const newProducts =
                    filteredProducts.filter(
                        product =>
                            !existingIds.has(product.id)
                    );

                return [
                    ...previous,
                    ...newProducts,
                ];

            });

        }

    }


    /*
     * Open Add Product
     */
    function handleAddProduct() {

        setSelectedProduct(null);
        setModalOpen(true);

    }


    /*
     * Open Edit Product
     */
    function handleEditProduct(product) {

        setSelectedProduct(product);
        setModalOpen(true);

    }


    /*
     * Open Delete Confirmation
     */
    function handleDeleteProduct(product) {

        setProductToDelete(product);
        setDeleteOpen(true);

    }


    /*
     * Delete
     */
    async function handleDelete() {

        if (!productToDelete) {
            return;
        }

        try {

            await deleteProduct(productToDelete.id);

            toast.success(
                "Product deleted successfully."
            );

            setDeleteOpen(false);
            setProductToDelete(null);

            /*
             * Remove it from selection as well.
             */
            setSelectedProducts(previous =>
                previous.filter(
                    product =>
                        product.id !== productToDelete.id
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


    /*
     * Print one product
     */
    function handlePrintProduct(product) {

        setProductsToPrint([product]);
        setPrintLabelOpen(true);

    }


    /*
     * Print all selected products
     */
    function handlePrintSelected() {

        if (selectedProducts.length === 0) {

            toast.error(
                "Please select at least one product."
            );

            return;
        }

        setProductsToPrint(
            [...selectedProducts]
        );

        setPrintLabelOpen(true);

    }


    /*
     * Clear selection
     */
    function clearSelection() {

        setSelectedProducts([]);

    }


    if (loading) {

        return (
            <div className="space-y-6">

                <div className="
                    h-8
                    w-40
                    rounded-lg
                    bg-slate-200
                    animate-pulse
                " />

                <div className="
                    h-12
                    w-full
                    rounded-xl
                    bg-slate-100
                    animate-pulse
                " />

                <div className="
                    h-96
                    w-full
                    rounded-2xl
                    bg-slate-100
                    animate-pulse
                " />

            </div>
        );

    }


    return (

        <div className="w-full max-w-[1600px] mx-auto">

            {/* Header + Search */}
            <ProductToolbar
                search={search}
                setSearch={setSearch}
                onAdd={handleAddProduct}
            />


            {/* Filters */}
            <div className="
                mb-4
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-600
                ">

                    <div className="
                        w-8 h-8
                        rounded-lg
                        bg-slate-100
                        flex
                        items-center
                        justify-center
                    ">
                        <SlidersHorizontal
                            size={16}
                            className="text-slate-500"
                        />
                    </div>

                    <span className="font-medium">
                        Filter by date
                    </span>

                </div>


                <div className="flex items-center gap-2">

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) =>
                            setDateFilter(
                                e.target.value
                            )
                        }
                        className="
                            h-10
                            border border-slate-200
                            rounded-xl
                            px-3
                            text-sm
                            bg-white
                            text-slate-700
                            outline-none
                            shadow-sm
                            focus:border-emerald-500
                            focus:ring-4
                            focus:ring-emerald-500/10
                        "
                    />

                    {dateFilter && (

                        <button
                            type="button"
                            onClick={() =>
                                setDateFilter("")
                            }
                            className="
                                h-10
                                px-3
                                rounded-xl
                                text-sm
                                font-medium
                                text-slate-500
                                hover:text-slate-900
                                hover:bg-slate-100
                                transition
                            "
                        >
                            <span className="hidden sm:inline">
                                Clear
                            </span>

                            <X
                                size={16}
                                className="sm:hidden"
                            />
                        </button>

                    )}

                </div>

            </div>


            {/* Selection toolbar */}
            {selectedProducts.length > 0 && (

                <div className="
                    mb-4
                    rounded-2xl
                    border border-emerald-100
                    bg-emerald-50
                    p-3
                    sm:p-4
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            w-9 h-9
                            rounded-xl
                            bg-emerald-100
                            flex
                            items-center
                            justify-center
                        ">
                            <Printer
                                size={17}
                                className="text-emerald-700"
                            />
                        </div>

                        <div>

                            <p className="
                                text-sm
                                font-semibold
                                text-emerald-900
                            ">
                                {selectedProducts.length} product
                                {selectedProducts.length !== 1
                                    ? "s"
                                    : ""} selected
                            </p>

                            <p className="
                                text-xs
                                text-emerald-700/70
                            ">
                                Ready to print product labels
                            </p>

                        </div>

                    </div>


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <button
                            type="button"
                            onClick={clearSelection}
                            className="
                                flex-1
                                sm:flex-none
                                px-4
                                py-2.5
                                rounded-xl
                                bg-white
                                border border-emerald-200
                                text-sm
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                                transition
                            "
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={handlePrintSelected}
                            className="
                                flex-1
                                sm:flex-none
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                text-sm
                                font-semibold
                                shadow-sm
                                transition
                            "
                        >
                            <Printer size={16} />

                            Print Labels
                        </button>

                    </div>

                </div>

            )}


            {/* Results information */}
            <div className="
                flex
                items-center
                justify-between
                mb-3
                px-1
            ">

                <p className="
                    text-xs
                    sm:text-sm
                    text-slate-400
                ">
                    Showing{" "}
                    <span className="
                        font-semibold
                        text-slate-600
                    ">
                        {filteredProducts.length}
                    </span>{" "}
                    of{" "}
                    <span className="
                        font-semibold
                        text-slate-600
                    ">
                        {products.length}
                    </span>{" "}
                    products
                </p>

            </div>


            {/* Product Table / Mobile Cards */}
            <ProductTable
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onPrintLabel={handlePrintProduct}
                selectedProducts={selectedProducts}
                onSelect={toggleProductSelection}
                onSelectAll={toggleSelectAll}
            />


            {/* Product Modal */}
            <ProductModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                product={selectedProduct}
                onSuccess={loadProducts}
            />


            {/* Delete Modal */}
            <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                product={productToDelete}
                onConfirm={handleDelete}
            />


            {/* Print Labels */}
            <PrintLabelModal
                open={printLabelOpen}
                onOpenChange={(value) => {

                    setPrintLabelOpen(value);

                    if (!value) {
                        setProductsToPrint([]);
                    }

                }}
                products={productsToPrint}
            />

        </div>
    );
}

export default Products;