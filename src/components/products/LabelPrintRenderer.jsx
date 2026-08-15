import { useEffect } from "react";
import Barcode from "react-barcode";
import { printLabels } from "@/utils/printLabels";


function LabelPrintRenderer({
                                products,
                                quantities,
                                printRequested,
                                onPrinted,
                            }) {

    useEffect(() => {

        if (!printRequested) {
            return;
        }

        if (!products?.length) {
            return;
        }

        const timer = setTimeout(() => {

            const labels = [];

            products.forEach(product => {

                const quantity =
                    quantities[product.id] || 1;

                const container =
                    document.querySelector(
                        `[data-print-product="${product.id}"]`
                    );

                if (!container) {
                    return;
                }

                const barcode =
                    container
                        .querySelector("svg")
                        ?.outerHTML || "";

                for (
                    let i = 0;
                    i < quantity;
                    i++
                ) {

                    labels.push({

                        html: `
                            <div
                                class="mynix-print-label"
                                style="
                                    width: 50mm;
                                    height: 30mm;
                                    box-sizing: border-box;
                                    padding: 2.5mm;
                                    background: white;
                                    color: black;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: space-between;
                                    overflow: hidden;
                                    font-family: Arial, Helvetica, sans-serif;
                                    page-break-inside: avoid;
                                "
                            >

                                <div
                                    style="
                                        text-align: center;
                                        line-height: 1;
                                    "
                                >
                                    <div
                                        style="
                                            font-size: 13px;
                                            font-weight: 800;
                                            letter-spacing: 3px;
                                        "
                                    >
                                        MYNIX
                                    </div>

                                    <div
                                        style="
                                            margin-top: 1px;
                                            font-size: 6px;
                                            letter-spacing: 1.5px;
                                        "
                                    >
                                        POS SYSTEM
                                    </div>
                                </div>

                                <div
                                    style="
                                        width: 100%;
                                        text-align: center;
                                        font-size: 10px;
                                        font-weight: 700;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    "
                                >
                                    ${escapeHtml(product.name)}
                                </div>

                                <div
                                    style="
                                        display: flex;
                                        justify-content: center;
                                        width: 100%;
                                    "
                                >
                                    ${barcode}
                                </div>

                                <div
                                    style="
                                        font-family: monospace;
                                        font-size: 7px;
                                        letter-spacing: 1px;
                                    "
                                >
                                    ${escapeHtml(product.barcode)}
                                </div>

                                <div
                                    style="
                                        font-size: 11px;
                                        font-weight: 800;
                                    "
                                >
                                    Rs. ${Number(
                            product.sellingPrice
                        ).toLocaleString()}
                                </div>

                            </div>
                        `,

                    });

                }

            });

            if (labels.length > 0) {

                printLabels(labels);

                onPrinted?.();

            }

        }, 150);

        return () => clearTimeout(timer);

    }, [
        printRequested,
        products,
        quantities,
        onPrinted,
    ]);


    return (

        <div
            className="
                fixed
                left-[-99999px]
                top-0
                pointer-events-none
            "
        >

            {products.map(product => (

                <div
                    key={product.id}
                    data-print-product={product.id}
                >

                    <Barcode
                        value={product.barcode}
                        format="CODE128"
                        width={1.7}
                        height={45}
                        displayValue={false}
                        margin={0}
                    />

                </div>

            ))}

        </div>
    );
}


/*
 * Prevent product names/barcodes from breaking
 * the generated print HTML.
 */
function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


export default LabelPrintRenderer;