import { useEffect, useState } from "react";

import SalesToolbar from "../components/sales/SalesToolbar";
import SalesTable from "../components/sales/SalesTable";

import ReceiptModal from "@/components/receipt/ReceiptModal";

import {
    getSales,
    getSale,
} from "../services/salesApi";

function Sales() {

    const [sales, setSales] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [selectedSale, setSelectedSale] = useState(null);

    const [receiptOpen, setReceiptOpen] = useState(false);

    useEffect(() => {
        loadSales();
    }, []);

    async function loadSales() {

        try {

            const data = await getSales();

            setSales(data);

        } catch (error) {

            console.error(
                "Failed to load sales:",
                error
            );

        } finally {

            setLoading(false);

        }
    }

    async function handleViewSale(sale) {

        try {

            const data = await getSale(
                sale.invoiceNumber
            );

            /*
             * Current backend SaleResponse does not
             * contain items, so we preserve the sale
             * information we already have.
             */
            setSelectedSale(data);

            setReceiptOpen(true);

        } catch (error) {

            console.error(error);

        }

    }

    const filteredSales = sales.filter((sale) =>
        sale.invoiceNumber
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {

        return (
            <div className="flex items-center justify-center h-full">
                Loading sales...
            </div>
        );

    }

    return (

        <div>

            <SalesToolbar
                search={search}
                setSearch={setSearch}
            />

            <SalesTable
                sales={filteredSales}
                onView={handleViewSale}
            />

            <ReceiptModal
                open={receiptOpen}
                onOpenChange={setReceiptOpen}
                sale={selectedSale}
            />

        </div>

    );

}

export default Sales;