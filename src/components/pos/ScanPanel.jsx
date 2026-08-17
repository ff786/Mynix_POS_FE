import { useEffect, useRef, useState } from "react";
import {
    ScanBarcode,
    Search,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { scanBarcode } from "@/services/posApi.js";
import { getProducts } from "@/services/productApi.js";

function ScanPanel({ cart, setCart }) {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] =
        useState(false);
    const [scanning, setScanning] = useState(false);

    const inputRef = useRef(null);

    /*
     * Load products once.
     */
    useEffect(() => {
        async function loadProducts() {
            try {
                setLoadingProducts(true);

                const data = await getProducts();

                setProducts(
                    Array.isArray(data)
                        ? data.filter(
                            (product) =>
                                product.active !== false
                        )
                        : []
                );
            } catch (error) {
                console.error(
                    "Unable to load products:",
                    error
                );

                toast.error(
                    "Unable to load products."
                );
            } finally {
                setLoadingProducts(false);
            }
        }

        loadProducts();
    }, []);

    /*
     * Local product search.
     */
    const filteredProducts =
        query.trim().length > 0
            ? products
                .filter((product) => {
                    const search =
                        query.trim().toLowerCase();

                    return (
                        product.name
                            ?.toLowerCase()
                            .includes(search) ||
                        product.barcode
                            ?.toLowerCase()
                            .includes(search)
                    );
                })
                .slice(0, 8)
            : [];

    /*
     * Add product to cart.
     */
    function addProductToCart(product) {
        if (Number(product.stockQuantity) <= 0) {
            toast.error(
                `${product.name} is out of stock.`
            );

            return;
        }

        setCart((previous) => {
            const existing = previous.find(
                (item) =>
                    item.barcode === product.barcode
            );

            if (existing) {
                if (
                    existing.quantity >=
                    product.stockQuantity
                ) {
                    toast.error(
                        `Only ${product.stockQuantity} available in stock.`
                    );

                    return previous;
                }

                toast.success(
                    `${product.name} quantity increased`
                );

                return previous.map((item) =>
                    item.barcode === product.barcode
                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1,
                        }
                        : item
                );
            }

            toast.success(
                `${product.name} added`
            );

            return [
                ...previous,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });

        clearInput();
    }

    /*
     * Exact barcode scan.
     */
    async function handleKeyDown(event) {
        if (event.key !== "Enter") {
            return;
        }

        const value = query.trim();

        if (!value) {
            return;
        }

        const localProduct = products.find(
            (product) =>
                product.barcode
                    ?.toLowerCase() ===
                value.toLowerCase()
        );

        if (localProduct) {
            addProductToCart(localProduct);
            return;
        }

        try {
            setScanning(true);

            const product =
                await scanBarcode(value);

            addProductToCart(product);
        } catch (error) {
            console.error(
                "Barcode scan error:",
                error
            );

            toast.error(
                "Product barcode not found."
            );
        } finally {
            setScanning(false);

            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }

    function clearInput() {
        setQuery("");

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <ScanBarcode
                        size={21}
                        className="text-emerald-600"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Scan Product
                    </h2>

                    <p className="text-xs text-slate-500 sm:text-sm">
                        Scan barcode or search product
                    </p>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    ref={inputRef}
                    autoFocus
                    value={query}
                    onChange={(event) =>
                        setQuery(
                            event.target.value
                        )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Scan MNX- barcode or search product..."
                    autoComplete="off"
                    className="
                        min-h-12 w-full rounded-xl border
                        border-slate-300 bg-white pl-11 pr-11
                        text-base outline-none transition
                        focus:border-emerald-500
                        focus:ring-2 focus:ring-emerald-100
                        sm:min-h-14 sm:text-lg
                    "
                />

                {(scanning || loadingProducts) && (
                    <Loader2
                        size={19}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-emerald-500"
                    />
                )}

                {/* Dropdown */}
                {query.trim() &&
                    !scanning &&
                    filteredProducts.length > 0 && (
                        <div className="
                            absolute left-0 right-0 z-50 mt-2
                            max-h-80 overflow-y-auto rounded-xl
                            border border-slate-200 bg-white shadow-xl
                        ">
                            {filteredProducts.map(
                                (product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() =>
                                            addProductToCart(
                                                product
                                            )
                                        }
                                        className="
                                            flex min-h-16 w-full
                                            items-center gap-3 border-b
                                            border-slate-100 p-3 text-left
                                            last:border-b-0
                                            hover:bg-emerald-50
                                            active:bg-emerald-100
                                        "
                                    >
                                        {/* Image */}
                                        <div className="
                                            h-11 w-11 shrink-0
                                            overflow-hidden rounded-lg
                                            bg-slate-100
                                        ">
                                            {product.imageUrl ? (
                                                <img
                                                    src={
                                                        product.imageUrl
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="
                                                    flex h-full w-full
                                                    items-center justify-center
                                                    text-xs font-semibold
                                                    text-slate-400
                                                ">
                                                    MNX
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <p className="
                                                truncate text-sm font-semibold
                                                text-slate-900
                                            ">
                                                {product.name}
                                            </p>

                                            <p className="
                                                mt-0.5 truncate font-mono
                                                text-xs text-slate-400
                                            ">
                                                {product.barcode}
                                            </p>

                                            <div className="mt-1 flex items-center gap-3">
                                                <span className="
                                                    text-xs font-semibold
                                                    text-emerald-600
                                                ">
                                                    Rs.{" "}
                                                    {Number(
                                                        product.sellingPrice ||
                                                        0
                                                    ).toLocaleString()}
                                                </span>

                                                <span className="text-xs text-slate-500">
                                                    Stock:{" "}
                                                    {
                                                        product.stockQuantity
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                )
                            )}
                        </div>
                    )}

                {/* No Results */}
                {query.trim() &&
                    !loadingProducts &&
                    !scanning &&
                    filteredProducts.length === 0 && (
                        <div className="
                            absolute left-0 right-0 z-50 mt-2
                            rounded-xl border border-slate-200
                            bg-white p-4 text-center shadow-lg
                        ">
                            <p className="text-sm font-medium text-slate-700">
                                No product found
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Check the product name or MNX barcode.
                            </p>
                        </div>
                    )}
            </div>

            {/* Hint */}
            <div className="
                mt-3 flex flex-col gap-1 text-xs text-slate-400
                sm:flex-row sm:items-center sm:justify-between
            ">
                <span>
                    Search by product name or barcode
                </span>

                <span>
                    Scanner: scan → Enter
                </span>
            </div>
        </div>
    );
}

export default ScanPanel;