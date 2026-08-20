import ProductRow from "./ProductRow";

function ProductTable({
                          products,
                          onEdit,
                          onDelete,
                          onPrintLabel,
                          selectedProducts = [],
                          onSelect,
                          onSelectAll,
                          isAdmin = false,
                      }) {
    const allSelected =
        isAdmin &&
        products.length > 0 &&
        products.every((product) =>
            selectedProducts.some(
                (selected) => selected.id === product.id
            )
        );

    return (
        <div className="w-full">
            {/* =========================
                DESKTOP
            ========================== */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                <div className="max-h-[calc(100vh-320px)] overflow-auto">
                    <table className="w-full min-w-[780px]">
                        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
                        <tr>
                            {isAdmin && (
                                <th className="w-12 px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={onSelectAll}
                                        className="h-4 w-4 cursor-pointer accent-emerald-600"
                                    />
                                </th>
                            )}

                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Product
                            </th>

                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Barcode
                            </th>

                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Category
                            </th>

                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Selling Price
                            </th>

                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Available Stock
                            </th>

                            {isAdmin && (
                                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            )}
                        </tr>
                        </thead>

                        <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 5}>
                                    <EmptyProducts isAdmin={isAdmin} />
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onPrintLabel={onPrintLabel}
                                    selected={selectedProducts.some(
                                        (selected) =>
                                            selected.id === product.id
                                    )}
                                    onSelect={onSelect}
                                    mobile={false}
                                    isAdmin={isAdmin}
                                />
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =========================
                MOBILE
            ========================== */}

            <div className="space-y-3 md:hidden">
                {isAdmin && products.length > 0 && (
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={onSelectAll}
                                className="h-4 w-4 accent-emerald-600"
                            />
                            Select all
                        </label>

                        {selectedProducts.length > 0 && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                {selectedProducts.length}
                            </span>
                        )}
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <EmptyProducts isAdmin={isAdmin} />
                    </div>
                ) : (
                    products.map((product) => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onPrintLabel={onPrintLabel}
                            selected={selectedProducts.some(
                                (selected) => selected.id === product.id
                            )}
                            onSelect={onSelect}
                            mobile
                            isAdmin={isAdmin}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function EmptyProducts({ isAdmin = false }) {
    return (
        <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📦
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
                No products found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
                {isAdmin
                    ? "Try changing your search or add a new product."
                    : "Try changing your search or category filter."}
            </p>
        </div>
    );
}

export default ProductTable;