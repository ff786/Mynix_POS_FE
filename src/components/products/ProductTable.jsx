import ProductRow from "./ProductRow";

function ProductTable({ products, onEdit, onDelete }) {

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
                <thead className="bg-slate-100">
                <tr>
                    <th className="text-left p-4">Image</th>
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">Barcode</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="text-center py-16 text-slate-500">
                            <div className="space-y-3">
                                <div className="text-5xl">
                                    📦
                                </div>
                                <h3 className="text-lg font-semibold">
                                    No Products Found
                                </h3>
                                <p>
                                    Click <strong>Add Product</strong> to create your first product.
                                </p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    products.map(product => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default ProductTable;