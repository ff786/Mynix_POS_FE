export function printLabels(labels) {

    const printWindow = window.open(
        "",
        "_blank",
        "width=600,height=400"
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

            <title>MYNIX Product Labels</title>

            <style>

                @page {
                    size: 30mm 15mm;
                    margin: 0;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    width: 30mm;
                    background: white;
                }

                body {
                    font-family: Arial, Helvetica, sans-serif;
                }

                .mynix-print-label {
                    width: 30mm !important;
                    height: 15mm || 20mm !important;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0.8mm 1mm;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    overflow: hidden;
                    background: white;
                    color: black;
                    page-break-after: always;
                    break-after: page;
                    font-family: Arial, Helvetica, sans-serif;
                }

                .mynix-print-label:last-child {
                    page-break-after: auto;
                    break-after: auto;
                }

                .product-name {
                    width: 100%;
                    font-size: 9px;
                    font-weight: 700;
                    line-height: 1;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .barcode-wrap {
                    width: 100%;
                    height: 7mm;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                }
                
                .barcode-wrap svg {
                    display: block;
                    max-width: 27mm;
                    max-height: 7mm;
                    width: auto;
                    height: auto;
                }

                .barcode-text {
                    font-family: monospace;
                    font-size: 9px;
                    font-weight: 700;
                    line-height: 1;
                    letter-spacing: 0.25px;
                    white-space: nowrap;
                }

                .price {
                    font-size: 9px;
                    font-weight: 800;
                    line-height: 1;
                }

                @media print {

                    html,
                    body {
                        width: 30mm;
                        height: auto;
                    }

                    .mynix-print-label {
                        width: 30mm !important;
                        height: 15mm !important;
                    }

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

        setTimeout(() => {
            printWindow.close();
        }, 300);

    }, 700);
}