function ProductRow({ product, onEdit, onDelete }) {

    return (

        <tr className="border-b hover:bg-slate-50">

            <td className="px-4 py-3">

                {product.imageUrl ? (

                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                    />

                ) : (

                    <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                        📦
                    </div>

                )}

            </td>

            <td>{product.name}</td>
            <td>{product.barcode}</td>
            <td>{product.category}</td>
            <td>Rs. {Number(product.sellingPrice).toLocaleString()}</td>
            <td>{product.stockQuantity}</td>
            <td className="px-4 py-3">
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(product)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </td>

        </tr>

    );

}

export default ProductRow;