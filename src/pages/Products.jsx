import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Printer, X } from "lucide-react";
import { toast } from "sonner";

import ProductToolbar from "../components/products/ProductToolbar";
import ProductTable from "../components/products/ProductTable";
import ProductModal from "../components/products/ProductModal";
import DeleteDialog from "../components/products/DeleteDialog";
import PrintLabelModal from "../components/products/PrintLabelModal";

import { getProducts, deleteProduct } from "../services/productApi";
import { useAuth } from "@/context/AuthContext";

function Products() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const [searchParams, setSearchParams] =
        useSearchParams();

    const stockFilter =
        searchParams.get("stock");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
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
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load products:", error);
            toast.error("Failed to load products.");
        } finally {
            setLoading(false);
        }
    }

    const categories = useMemo(() => {
        const values = products
            .map((product) => product.category?.trim())
            .filter(Boolean);

        return ["ALL", ...Array.from(new Set(values)).sort()];
    }, [products]);

    const filteredProducts = useMemo(() => {

        const normalizedSearch =
            search.trim().toLowerCase();

        return products.filter(product => {

            const name =
                product.name
                    ?.toLowerCase() || "";
            const barcode =
                product.barcode
                    ?.toLowerCase() || "";
            const category =
                product.category
                    ?.toLowerCase() || "";
            const stock =
                Number(
                    product.stockQuantity
                ) || 0;
            const minimumStock =
                Number(
                    product.minimumStock
                ) || 0;

            /* SEARCH */
            const matchesSearch =
                !normalizedSearch ||
                name.includes(
                    normalizedSearch
                ) ||
                barcode.includes(
                    normalizedSearch
                );

            /* CATEGORY */
            const matchesCategory =
                categoryFilter === "ALL" ||
                category ===
                categoryFilter.toLowerCase();

            /* LOW STOCK */
            const matchesStock =
                stockFilter !== "low" ||
                stock <= minimumStock;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStock
            );

        });

    }, [
        products,
        search,
        categoryFilter,
        stockFilter,
    ]);

    function toggleProductSelection(product) {
        if (!isAdmin) return;

        setSelectedProducts((previous) => {
            const exists = previous.some((item) => item.id === product.id);

            if (exists) {
                return previous.filter((item) => item.id !== product.id);
            }

            return [...previous, product];
        });
    }

    function toggleSelectAll() {
        if (!isAdmin || filteredProducts.length === 0) return;

        const allSelected = filteredProducts.every((product) =>
            selectedProducts.some((selected) => selected.id === product.id)
        );

        if (allSelected) {
            setSelectedProducts((previous) =>
                previous.filter(
                    (selected) =>
                        !filteredProducts.some(
                            (product) => product.id === selected.id
                        )
                )
            );
        } else {
            setSelectedProducts((previous) => {
                const existingIds = new Set(
                    previous.map((product) => product.id)
                );

                const newProducts = filteredProducts.filter(
                    (product) => !existingIds.has(product.id)
                );

                return [...previous, ...newProducts];
            });
        }
    }

    function handleAddProduct() {
        if (!isAdmin) return;

        setSelectedProduct(null);
        setModalOpen(true);
    }

    function handleEditProduct(product) {
        if (!isAdmin) return;

        setSelectedProduct(product);
        setModalOpen(true);
    }

    function handleDeleteProduct(product) {
        if (!isAdmin) return;

        setProductToDelete(product);
        setDeleteOpen(true);
    }

    async function handleDelete() {
        if (!isAdmin || !productToDelete) return;

        try {
            await deleteProduct(productToDelete.id);

            toast.success("Product deleted successfully.");

            setDeleteOpen(false);
            setSelectedProducts((previous) =>
                previous.filter(
                    (product) => product.id !== productToDelete.id
                )
            );
            setProductToDelete(null);

            await loadProducts();
        } catch (error) {
            console.error("Delete product error:", error);
            toast.error("Failed to delete product.");
        }
    }

    function handlePrintProduct(product) {
        if (!isAdmin) return;

        setProductsToPrint([product]);
        setPrintLabelOpen(true);
    }

    function handlePrintSelected() {
        if (!isAdmin) return;

        if (selectedProducts.length === 0) {
            toast.error("Please select at least one product.");
            return;
        }

        setProductsToPrint([...selectedProducts]);
        setPrintLabelOpen(true);
    }

    function clearSelection() {
        setSelectedProducts([]);
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
                <div className="h-96 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <ProductToolbar
                search={search}
                setSearch={setSearch}
                onAdd={isAdmin ? handleAddProduct : undefined}
                isAdmin={isAdmin}
            />

            {/* Filters */}
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                        <SlidersHorizontal size={16} className="text-slate-500" />
                    </div>
                    <span className="font-medium">Category</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="h-9 min-w-[180px] rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none shadow-sm transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === "ALL"
                                    ? "All Categories"
                                    : category}
                            </option>
                        ))}
                    </select>

                    {categoryFilter !== "ALL" && (
                        <button
                            type="button"
                            onClick={() => setCategoryFilter("ALL")}
                            className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            Clear
                            <X size={15} />
                        </button>
                    )}
                </div>
            </div>

            {/* Admin Selection Toolbar */}
            {isAdmin && selectedProducts.length > 0 && (
                <div className="mb-3 flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                            <Printer size={16} className="text-emerald-700" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-emerald-900">
                                {selectedProducts.length} product
                                {selectedProducts.length !== 1 ? "s" : ""} selected
                            </p>
                            <p className="text-xs text-emerald-700/70">
                                Ready to print labels
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={handlePrintSelected}
                            className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:flex-none"
                        >
                            Print Labels
                        </button>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-xs text-slate-400 sm:text-sm">
                    Showing{" "}
                    <span className="font-semibold text-slate-600">
                        {filteredProducts.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-600">
                        {products.length}
                    </span>{" "}
                    products
                </p>

                {!isAdmin && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        View only
                    </span>
                )}
            </div>

            {/* Products */}
            <ProductTable
                products={filteredProducts}
                onEdit={isAdmin ? handleEditProduct : undefined}
                onDelete={isAdmin ? handleDeleteProduct : undefined}
                onPrintLabel={isAdmin ? handlePrintProduct : undefined}
                selectedProducts={isAdmin ? selectedProducts : []}
                onSelect={isAdmin ? toggleProductSelection : undefined}
                onSelectAll={isAdmin ? toggleSelectAll : undefined}
                isAdmin={isAdmin}
            />

            {/* Admin Modals */}
            {isAdmin && (
                <>
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
                </>
            )}
        </div>
    );
}

export default Products;