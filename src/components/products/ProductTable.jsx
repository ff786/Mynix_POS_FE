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
                        <td
                            colSpan="7"
                            className="text-center py-20"
                        >
                            <div className="text-4xl mb-3">
                                📦
                            </div>
                            <p className="font-medium text-slate-700">
                                No products found
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                Try changing your search or add a new product.
                            </p>
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