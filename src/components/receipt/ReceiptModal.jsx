import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import Receipt from "./Receipt";
import ThermalReceipt from "./ReceiptPrint";

function ReceiptModal({
                          open,
                          onOpenChange,
                          sale,
                      }) {

    if (!sale) {
        return null;
    }


    function collectStyles() {

        return Array.from(
            document.querySelectorAll(
                'style, link[rel="stylesheet"]'
            )
        )
            .map((node) => {

                if (
                    node.tagName.toLowerCase() ===
                    "style"
                ) {
                    return node.outerHTML;
                }

                const href =
                    node.getAttribute("href");

                if (!href) {
                    return "";
                }

                return `
                    <link
                        rel="stylesheet"
                        href="${href}"
                    />
                `;
            })
            .filter(Boolean)
            .join("\n");
    }


    function handlePrint() {

        const printArea =
            document.getElementById(
                "thermal-receipt-print-area"
            );

        if (!printArea) {

            console.error(
                "Thermal receipt print area not found."
            );

            return;
        }


        const printWindow =
            window.open(
                "",
                "_blank",
                "width=600,height=900"
            );


        if (!printWindow) {

            alert(
                "Please allow popups to print the invoice."
            );

            return;
        }


        const receiptHtml =
            printArea.innerHTML;


        const applicationStyles =
            collectStyles();



        const thermalStyles = `
        <style>
        
            @page {
                size: 79mm auto;
                margin: 0;
            }
        
            html,
            body {
                width: 79mm !important;
                min-width: 79mm !important;
                max-width: 79mm !important;
        
                margin: 0 !important;
                padding: 0 !important;
        
                background: #ffffff !important;
            }
        
            body {
                color: #000000 !important;
        
                font-family:
                    "Courier New",
                    Courier,
                    monospace !important;
        
                font-size: 9px !important;
        
                overflow: visible !important;
            }
        
            *,
            *::before,
            *::after {
                box-sizing: border-box !important;
            }
        
        
            /*
             * RECEIPT
             *
             * 79mm WIDTH
             * 76mm MINIMUM HEIGHT
             *
             * HEIGHT IS NOT FIXED.
             */
        
            #thermal-receipt-print {
                width: 79mm !important;
                min-width: 79mm !important;
                max-width: 79mm !important;
        
                min-height: 76mm !important;
        
                margin: 0 !important;
        
                padding:
                    4mm
                    4mm
                    5mm
                    4mm !important;
        
                display: flex !important;
                flex-direction: column !important;
        
                background: #ffffff !important;
                color: #000000 !important;
        
                overflow: visible !important;
            }
        
            #mynix-thermal-receipt {
                width: 100% !important;
        
                min-width: 0 !important;
                max-width: 100% !important;
        
                min-height: 66mm !important;
        
                display: flex !important;
                flex-direction: column !important;
        
                background: #ffffff !important;
                color: #000000 !important;
            }
        
        
            /* =========================
               HEADER
            ========================== */
        
            .thermal-header {
                width: 100% !important;
                text-align: center !important;
            }
        
            .thermal-brand {
                font-family:
                    Arial,
                    Helvetica,
                    sans-serif !important;
        
                font-size: 22px !important;
                line-height: 1 !important;
                font-weight: 900 !important;
        
                letter-spacing: 2.5px !important;
            }
        
            .thermal-tagline {
                margin-top: 1.2mm !important;
        
                font-size: 9px !important;
                line-height: 1.2 !important;
        
                font-weight: 700 !important;
                letter-spacing: 0.9px !important;
            }
        
            .thermal-business {
                margin-top: 0.8mm !important;
        
                font-size: 8px !important;
                line-height: 1.2 !important;
        
                letter-spacing: 0.5px !important;
            }
        
            .thermal-contact {
                margin-top: 0.8mm !important;
        
                font-size: 8px !important;
                line-height: 1.2 !important;
        
                font-weight: 700 !important;
            }
        
        
            /* =========================
               DIVIDER
            ========================== */
        
            .thermal-divider {
                width: 100% !important;
        
                margin:
                    1.8mm
                    0 !important;
        
                overflow: hidden !important;
        
                white-space: nowrap !important;
        
                font-size: 8px !important;
                line-height: 1 !important;
        
                letter-spacing: 0.2px !important;
            }
        
        
            /* =========================
               SALE HEADER
            ========================== */
        
            .thermal-sale-header {
                width: 100% !important;
        
                display: flex !important;
        
                justify-content:
                    space-between !important;
        
                gap: 4mm !important;
        
                font-size: 8.5px !important;
        
                line-height: 1.5 !important;
            }
        
            .thermal-sale-left {
                min-width: 0 !important;
        
                flex: 1 1 auto !important;
            }
        
            .thermal-sale-right {
                flex: 0 0 auto !important;
        
                text-align: right !important;
            }
        
            .thermal-sale-left strong {
                font-weight: 900 !important;
            }
        
        
            /* =========================
               CUSTOMER
            ========================== */
        
            .thermal-customer {
                width: 100% !important;
        
                font-size: 8.5px !important;
        
                line-height: 1.5 !important;
            }
        
            .thermal-customer-title {
                margin-bottom: 0.5mm !important;
        
                font-weight: 900 !important;
            }
        
        
            /* =========================
               ITEM HEADER
            ========================== */
        
            .thermal-item-header {
                width: 100% !important;
        
                display: grid !important;
        
                grid-template-columns:
                    5mm
                    minmax(0,1fr)
                    9mm
                    15mm
                    18mm !important;
        
                column-gap: 0.7mm !important;
        
                align-items: end !important;
        
                font-size: 7.5px !important;
        
                line-height: 1 !important;
        
                font-weight: 900 !important;
            }
        
            .thermal-item-header
            .col-qty,
            .thermal-item-header
            .col-price,
            .thermal-item-header
            .col-amount {
                text-align: right !important;
            }
        
        
            /* =========================
               ITEMS
            ========================== */
        
            .thermal-item {
                width: 100% !important;
        
                min-width: 0 !important;
        
                padding:
                    1.8mm
                    0 !important;
            }
        
            .thermal-item-main {
                width: 100% !important;
        
                display: grid !important;
        
                grid-template-columns:
                    5mm
                    minmax(0,1fr)
                    9mm
                    15mm
                    18mm !important;
        
                column-gap: 0.7mm !important;
        
                align-items: start !important;
        
                font-size: 8px !important;
        
                line-height: 1.3 !important;
            }
        
            .thermal-item-number {
                font-weight: 700 !important;
            }
        
            .thermal-item-name {
                min-width: 0 !important;
        
                overflow-wrap:
                    anywhere !important;
        
                word-break:
                    break-word !important;
        
                font-weight: 700 !important;
            }
        
            .thermal-item-qty,
            .thermal-item-price,
            .thermal-item-amount {
                text-align: right !important;
        
                white-space: nowrap !important;
            }
        
            .thermal-item-amount {
                font-weight: 900 !important;
            }
        
            .thermal-item-barcode {
                margin-top: 0.8mm !important;
                margin-left: 5.7mm !important;
        
                font-size: 7px !important;
                line-height: 1 !important;
        
                letter-spacing: 0.25px !important;
            }
        
        
            /* =========================
               TOTALS
            ========================== */
        
            .thermal-totals {
                width: 100% !important;
        
                margin-top: 0.5mm !important;
            }
        
            .thermal-amount-row {
                width: 100% !important;
        
                display: flex !important;
        
                justify-content:
                    space-between !important;
        
                align-items: baseline !important;
        
                gap: 4mm !important;
        
                font-size: 8.5px !important;
        
                line-height: 1.6 !important;
            }
        
            .thermal-amount-row span:last-child {
                white-space: nowrap !important;
        
                text-align: right !important;
            }
        
            .thermal-amount-row-strong {
                font-size: 10px !important;
                font-weight: 900 !important;
            }
        
            .thermal-payment-summary {
                width: 100% !important;
        
                margin-top: 1mm !important;
            }
        
        
            /* =========================
               PAYMENT NOTICE
            ========================== */
        
            .thermal-payment-notice {
                width: 100% !important;
        
                text-align: center !important;
        
                font-size: 8px !important;
        
                line-height: 1.5 !important;
            }
        
            .thermal-payment-notice-title {
                font-weight: 900 !important;
            }
        
        
            /* =========================
               FOOTER
            ========================== */
        
            .thermal-footer {
                width: 100% !important;
        
                margin-top: auto !important;
        
                padding-top: 1mm !important;
        
                text-align: center !important;
            }
        
            .thermal-footer
            .thermal-divider {
                margin-top: 0 !important;
        
                margin-bottom: 2.5mm !important;
            }
        
            .thermal-footer-thanks {
                font-size: 9px !important;
        
                font-weight: 900 !important;
        
                line-height: 1.4 !important;
            }
        
            .thermal-footer-brand {
                margin-top: 0.7mm !important;
        
                font-size: 9px !important;
        
                font-weight: 900 !important;
        
                line-height: 1.3 !important;
            }
        
            .thermal-footer-tagline {
                margin-top: 1mm !important;
        
                font-size: 7px !important;
        
                font-weight: 700 !important;
        
                letter-spacing: 0.8px !important;
            }
        
            .thermal-footer-contact {
                margin-top: 1.5mm !important;
        
                font-size: 8px !important;
        
                font-weight: 800 !important;
            }
        
            .thermal-footer-generated {
                margin-top: 1.2mm !important;
        
                font-size: 6px !important;
        
                letter-spacing: 0.5px !important;
        
                color: #555555 !important;
            }
        
        </style>
        `;


        printWindow.document.write(`
            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8" />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <title>
                    ${
            sale.invoiceNumber ||
            "MYNIX Receipt"
        }
                </title>

                ${applicationStyles}

                ${thermalStyles}

            </head>

            <body>

                <div
                    id="thermal-receipt-print"
                >
                    ${receiptHtml}
                </div>

            </body>

            </html>
        `);


        printWindow.document.close();

        printWindow.focus();


        setTimeout(() => {

            printWindow.print();

            setTimeout(() => {
                printWindow.close();
            }, 500);

        }, 900);
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="
                w-[calc(100%-1rem)]
                max-w-xl
                max-h-[92vh]
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-0
                shadow-lg
            ">

                {/* HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    bg-white
                    px-6
                    py-4
                ">
                    <div>
                        <p className="
                            text-base
                            font-bold
                            text-slate-900
                        ">
                            Invoice Preview
                        </p>
                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        ">
                            {sale.invoiceNumber}
                        </p>
                    </div>
                </div>


                {/* RECEIPT CONTENT */}

                <div className="
                    min-h-0
                    overflow-y-auto
                    px-4
                    py-4
                ">

                    <div
                        id="receipt-print-area"
                        className="
                            mx-auto
                            w-full
                            max-w-[480px]
                            bg-white
                        "
                    >
                        <Receipt sale={sale} />
                    </div>


                    {/* HIDDEN THERMAL VERSION FOR PRINTING */}

                    <div
                        id="thermal-receipt-print-area"
                        aria-hidden="true"
                        className="
                            fixed
                            left-[-100000px]
                            top-0
                            w-[79mm]
                            overflow-hidden
                            bg-white
                        "
                    >
                        <ThermalReceipt sale={sale} />
                    </div>

                </div>


                {/* ACTION BUTTONS */}

                <div className="
                    flex
                    flex-col-reverse
                    gap-2
                    border-t
                    border-slate-200
                    bg-white
                    p-4
                    sm:flex-row
                    sm:justify-end
                    sm:gap-3
                ">

                    <button
                        type="button"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        className="
                            min-h-10
                            flex-1
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            active:scale-[0.98]
                            sm:flex-none
                        "
                    >
                        Done
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="
                            min-h-10
                            flex-1
                            rounded-lg
                            bg-emerald-600
                            px-5
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-emerald-700
                            active:scale-[0.98]
                            sm:flex-none
                        "
                    >
                        Print Invoice
                    </button>

                </div>

            </DialogContent>
        </Dialog>
    );
}

export default ReceiptModal;