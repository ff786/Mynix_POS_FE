import { useEffect } from "react";
import Barcode from "react-barcode";
import { printLabels } from "@/utils/printLabels";

function LabelPrintRenderer({
                                products,
                                quantities,
                                onPrinted
                            }) {

    useEffect(() => {

        if (!products.length) return;

        const timer = setTimeout(() => {

            const labels = [];

            products.forEach(product => {

                const quantity =
                    quantities[product.id] || 1;

                const container =
                    document.querySelector(
                        `[data-print-product="${product.id}"]`
                    );

                if (!container) return;

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
                            <div class="label">

                                <div class="brand">
                                    MYNIX
                                </div>

                                <div class="system">
                                    POS SYSTEM
                                </div>

                                <div class="product-name">
                                    ${product.name}
                                </div>

                                ${barcode}

                                <div class="barcode-text">
                                    ${product.barcode}
                                </div>

                                <div class="price">
                                    Rs. ${Number(
                            product.sellingPrice
                        ).toLocaleString()}
                                </div>

                            </div>
                        `

                    });

                }

            });

            printLabels(labels);

            onPrinted?.();

        }, 100);

        return () => clearTimeout(timer);

    }, [products, quantities]);

    return (

        <div className="fixed -left-[99999px] top-0">

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

export default LabelPrintRenderer;