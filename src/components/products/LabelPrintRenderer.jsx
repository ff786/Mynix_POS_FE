import { useEffect } from "react";
import bwipjs from "bwip-js/browser";

import { printLabels } from "@/utils/printLabels";


function LabelPrintRenderer({products, quantities, printRequested, onPrinted,}) {

    useEffect(() => {

        if (!printRequested) {
            return;
        }

        if (!products?.length) {
            return;
        }

        let cancelled = false;

        async function prepareLabels() {

            const labels = [];

            try {

                for (const product of products) {

                    if (cancelled) {
                        return;
                    }

                    const quantity =
                        quantities[product.id] || 1;


                    /*
                     * 203 DPI is common for thermal
                     * label printers.
                     *
                     * Physical target:
                     * 27mm wide × ~6mm high
                     */

                    const canvas =
                        document.createElement("canvas");


                    bwipjs.toCanvas(canvas, {

                        bcid: "code128",

                        text: String(
                            product.barcode || ""
                        ),

                        scale: 2,
                        height: 24,
                        includetext: false,
                        backgroundcolor: "FFFFFF",
                        barcolor: "000000",
                        paddingwidth: 0,
                        paddingheight: 0,
                    });


                    const barcodeImage =
                        canvas.toDataURL(
                            "image/png"
                        );


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
                                    >
                                        ${escapeHtml(
                                product.name
                            )}
                                    </div>


                                    <div
                                        class="barcode-wrap"
                                    >

                                        <img
                                            src="${barcodeImage}"
                                            class="barcode-image"
                                            alt=""
                                        />

                                    </div>


                                    <div
                                        class="barcode-text"
                                    >
                                        ${escapeHtml(
                                product.barcode
                            )}
                                    </div>


                                    <div
                                        class="price"
                                    >
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

                }


                if (
                    !cancelled &&
                    labels.length > 0
                ) {

                    printLabels(labels);

                    onPrinted?.();

                }

            } catch (error) {

                console.error(
                    "Barcode generation failed:",
                    error
                );

                alert(
                    "Unable to generate the barcode for printing."
                );

            }

        }

        prepareLabels();

        return () => {
            cancelled = true;
        };

    }, [
        printRequested,
        products,
        quantities,
        onPrinted,
    ]);


    return null;
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