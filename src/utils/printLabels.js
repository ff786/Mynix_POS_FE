export function printLabels(labels) {

    const printWindow = window.open(
        "",
        "_blank",
        "width=800,height=600"
    );

    if (!printWindow) {
        alert("Please allow popups to print labels.");
        return;
    }

    const labelsHtml = labels
        .map(label => label.html)
        .join("");

    printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>Mynix Product Labels</title>

            <style>

                @page {
                    size: 80mm 50mm;
                    margin: 0;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }

                body {
                    width: 80mm;
                }

                .label {
                    width: 80mm;
                    height: 50mm;

                    page-break-after: always;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;

                    padding: 4mm;

                    background: white;
                    color: black;

                    font-family: Arial, sans-serif;
                }

                .brand {
                    font-size: 16px;
                    font-weight: 800;
                    letter-spacing: 4px;
                }

                .system {
                    font-size: 9px;
                    margin-top: 1px;
                    color: #444;
                }

                .product-name {
                    font-size: 13px;
                    font-weight: 700;
                    margin-top: 5px;
                    text-align: center;
                }

                .barcode {
                    width: 68mm;
                    height: 14mm;
                    margin-top: 4px;
                }

                .barcode-text {
                    font-family: monospace;
                    font-size: 9px;
                    font-weight: 600;
                    margin-top: 2px;
                }

                .price {
                    font-size: 14px;
                    font-weight: 800;
                    margin-top: 2px;
                }

            </style>

        </head>

        <body>

            ${labelsHtml}

        </body>

        </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {

        printWindow.print();

        printWindow.close();

    }, 500);
}