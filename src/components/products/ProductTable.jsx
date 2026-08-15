import ProductRow from "./ProductRow";

function ProductTable({
                          products,
                          onEdit,
                          onDelete,
                          onPrintLabel,
                          selectedProducts,
                          onSelect,
                          onSelectAll,
                      }) {

    const allSelected =
        products.length > 0 &&
        products.every(product =>
            selectedProducts.some(
                selected => selected.id === product.id
            )
        );

    return (
        <div className="w-full">

            {/* ================= DESKTOP / TABLET ================= */}

            <div className="
                hidden
                md:block
                bg-white
                rounded-2xl
                border border-slate-200
                shadow-sm
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[950px]">

                        <thead className="bg-slate-50 border-b border-slate-200">

                        <tr>

                            <th className="w-12 px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onSelectAll}
                                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                />
                            </th>

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
                                Price
                            </th>

                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Stock
                            </th>

                            <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Actions
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {products.length === 0 ? (

                            <tr>
                                <td colSpan="7">
                                    <EmptyProducts />
                                </td>
                            </tr>

                        ) : (

                            products.map(product => (

                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onPrintLabel={onPrintLabel}
                                    selected={selectedProducts.some(
                                        selected =>
                                            selected.id === product.id
                                    )}
                                    onSelect={onSelect}
                                />

                            ))

                        )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ================= MOBILE ================= */}

            <div className="md:hidden space-y-3">

                {/* Select All */}
                {products.length > 0 && (
                    <div className="
                        flex
                        items-center
                        justify-between
                        bg-white
                        border border-slate-200
                        rounded-xl
                        px-4 py-3
                        shadow-sm
                    ">

                        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">

                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={onSelectAll}
                                className="w-4 h-4 accent-emerald-600"
                            />

                            Select all visible products

                        </label>

                        {selectedProducts.length > 0 && (
                            <span className="
                                text-xs
                                font-semibold
                                text-emerald-700
                                bg-emerald-50
                                px-2.5 py-1
                                rounded-full
                            ">
                                {selectedProducts.length} selected
                            </span>
                        )}

                    </div>
                )}

                {products.length === 0 ? (

                    <div className="
                        bg-white
                        border border-slate-200
                        rounded-2xl
                        shadow-sm
                    ">
                        <EmptyProducts />
                    </div>

                ) : (

                    products.map(product => (

                        <ProductRow
                            key={product.id}
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onPrintLabel={onPrintLabel}
                            selected={selectedProducts.some(
                                selected =>
                                    selected.id === product.id
                            )}
                            onSelect={onSelect}
                            mobile
                        />

                    ))

                )}

            </div>

        </div>
    );
}


function EmptyProducts() {

    return (
        <div className="py-16 px-6 text-center">

            <div className="
                mx-auto
                w-14 h-14
                rounded-2xl
                bg-slate-100
                flex
                items-center
                justify-center
                text-2xl
            ">
                📦
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
                No products found
            </h3>

            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Try changing your search or add a new product.
            </p>

        </div>
    );
}

export default ProductTable;