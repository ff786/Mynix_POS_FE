import { Eye } from "lucide-react";

function SalesTable({ sales, onView }) {

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-100">

                <tr>

                    <th className="text-left p-4">
                        Invoice
                    </th>

                    <th className="text-left p-4">
                        Date
                    </th>

                    <th className="text-left p-4">
                        Payment
                    </th>

                    <th className="text-left p-4">
                        Total
                    </th>

                    <th className="text-center p-4">
                        Action
                    </th>

                </tr>

                </thead>

                <tbody>

                {sales.length === 0 ? (

                    <tr>

                        <td
                            colSpan="5"
                            className="text-center py-20 text-slate-400"
                        >
                            No sales found.
                        </td>

                    </tr>

                ) : (

                    sales.map((sale) => (

                        <tr
                            key={sale.invoiceNumber}
                            className="border-t hover:bg-slate-50"
                        >

                            <td className="p-4 font-medium">
                                {sale.invoiceNumber}
                            </td>

                            <td className="p-4 text-slate-600">
                                {new Date(
                                    sale.createdAt
                                ).toLocaleString()}
                            </td>

                            <td className="p-4">

                                <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-medium">
                                    {sale.paymentMethod}
                                </span>

                            </td>

                            <td className="p-4 font-semibold">
                                Rs.{" "}
                                {Number(
                                    sale.grandTotal
                                ).toLocaleString()}
                            </td>

                            <td className="p-4 text-center">

                                <button
                                    onClick={() => onView(sale)}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg  bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-black transition"
                                >
                                    <Eye size={16} />
                                    View
                                </button>

                            </td>

                        </tr>

                    ))

                )}

                </tbody>

            </table>

        </div>
    );
}

export default SalesTable;