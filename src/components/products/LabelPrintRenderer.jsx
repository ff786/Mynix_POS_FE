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
                            >

                                <div
                                    class="product-name"
                                    title="${escapeHtml(product.name)}"
                                >
                                    ${escapeHtml(product.name)}
                                </div>


                                <div class="barcode-wrap">
                                    ${barcode}
                                </div>


                                <div class="barcode-text">
                                    ${escapeHtml(product.barcode)}
                                </div>


                                <div class="price">
                                    Rs. ${Number(
                            product.sellingPrice || 0
                        ).toLocaleString(
                            "en-LK",
                            {
                                maximumFractionDigits: 0,
                            }
                        )}
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

        }, 200);


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
                        width={1.2}
                        height={25}
                        displayValue={false}
                        margin={0}
                        background="transparent"
                        lineColor="#000000"
                    />

                </div>

            ))}

        </div>

    );
}


/*
 * Prevent product names/barcodes from
 * breaking the generated print HTML.
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