import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import Receipt from "./Receipt";
import ThermalReceipt from "./ReceiptPrint";

function ReceiptModal({open, onOpenChange, sale,}) {

    if (!sale) {
        return null;
    }

    function collectStyles() {
        return Array.from(
            document.querySelectorAll("style, link[rel='stylesheet']")
        )
            .map((node) => {
                if (node.tagName.toLowerCase() === "style") {
                    return node.outerHTML;
                }

                const href = node.getAttribute("href");

                if (!href) {
                    return "";
                }

                return `<link rel="stylesheet" href="${href}" />`;
            })
            .filter(Boolean)
            .join("\n");
    }

    function handlePrint() {
        const printArea = document.getElementById(
            "thermal-receipt-print-area"
        );

        if (!printArea) {
            console.error(
                "Thermal receipt print area not found."
            );
            return;
        }

        const printWindow = window.open(
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

        const receiptHtml = printArea.innerHTML;
        const applicationStyles = collectStyles();

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
                    font-family: Arial, Helvetica, sans-serif !important;
                    font-size: 10px !important;
                    line-height: 1.3 !important;
                    overflow: visible !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                *,
                *::before,
                *::after {
                    box-sizing: border-box !important;
                }

                #thermal-receipt-print {
                    width: 79mm !important;
                    min-width: 79mm !important;
                    max-width: 79mm !important;
                    min-height: 76mm !important;
                    margin: 0 !important;
                    padding: 4mm 4mm 5mm 4mm !important;
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

                .thermal-header {
                    width: 100% !important;
                    text-align: center !important;
                }

                .thermal-brand {
                    font-family: Arial, Helvetica, sans-serif !important;
                    font-size: 24px !important;
                    line-height: 1 !important;
                    font-weight: 900 !important;
                    letter-spacing: 2.2px !important;
                }

                .thermal-tagline {
                    margin-top: 1.2mm !important;
                    font-size: 9.5px !important;
                    line-height: 1.25 !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.65px !important;
                }

                .thermal-contact {
                    margin-top: 0.9mm !important;
                    font-size: 9px !important;
                    line-height: 1.25 !important;
                    font-weight: 700 !important;
                }

                .thermal-divider {
                    width: calc(100% - 4px) !important;
                    height: 0 !important;
                    margin: 2mm auto !important;
                    border-top: 1px dashed #000000 !important;
                    background: transparent !important;
                    box-sizing: border-box !important;
                    overflow: visible !important;
                }

                .thermal-sale-header {
                    width: 100% !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: flex-start !important;
                    gap: 3mm !important;
                    font-size: 9.5px !important;
                    line-height: 1.45 !important;
                }

                .thermal-sale-left,
                .thermal-sale-right {
                    min-width: 0 !important;
                }

                .thermal-sale-left {
                    max-width: 54% !important;
                }

                .thermal-sale-right {
                    max-width: 46% !important;
                    text-align: right !important;
                }

                .thermal-invoice-number {
                    margin-top: 0.5mm !important;
                    font-size: 9px !important;
                    font-weight: 700 !important;
                    overflow-wrap: anywhere !important;
                }

                .thermal-customer {
                    width: 100% !important;
                    font-size: 9.5px !important;
                    line-height: 1.45 !important;
                    overflow-wrap: anywhere !important;
                }

                .thermal-customer-title {
                    margin-bottom: 0.6mm !important;
                    font-size: 8.5px !important;
                    font-weight: 900 !important;
                    letter-spacing: 0.8px !important;
                }

                .thermal-customer-name {
                    font-weight: 800 !important;
                }

                .thermal-customer-contact {
                    margin-top: 0.4mm !important;
                    font-size: 9px !important;
                    font-weight: 700 !important;
                }

                .thermal-item-header {
                    width: 100% !important;
                    display: grid !important;
                    grid-template-columns: 5mm minmax(0, 1fr) 9mm 15mm 18mm !important;
                    column-gap: 0.7mm !important;
                    align-items: end !important;
                    font-size: 8.5px !important;
                    line-height: 1.2 !important;
                    font-weight: 900 !important;
                    letter-spacing: 0.15px !important;
                }

                .thermal-item-header span {
                    min-width: 0 !important;
                }

                .thermal-item-header .col-qty,
                .thermal-item-header .col-price,
                .thermal-item-header .col-amount {
                    text-align: right !important;
                }

                .thermal-items {
                    width: 100% !important;
                    min-width: 0 !important;
                }

                .thermal-item {
                    width: 100% !important;
                    min-width: 0 !important;
                    padding: 2mm 0 !important;
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }

                .thermal-item-main {
                    width: 100% !important;
                    display: grid !important;
                    grid-template-columns: 5mm minmax(0, 1fr) 9mm 15mm 18mm !important;
                    column-gap: 0.7mm !important;
                    align-items: start !important;
                    font-size: 9px !important;
                    line-height: 1.4 !important;
                }

                .thermal-item-number {
                    font-weight: 800 !important;
                }

                .thermal-item-name {
                    min-width: 0 !important;
                    font-size: 9px !important;
                    font-weight: 800 !important;
                    line-height: 1.35 !important;
                    overflow-wrap: anywhere !important;
                    word-break: break-word !important;
                }

                .thermal-item-qty,
                .thermal-item-price,
                .thermal-item-amount {
                    min-width: 0 !important;
                    text-align: right !important;
                    white-space: nowrap !important;
                    font-size: 9px !important;
                    line-height: 1.35 !important;
                }

                .thermal-item-amount {
                    font-weight: 900 !important;
                }

                .thermal-item-barcode {
                    margin-top: 0.8mm !important;
                    margin-left: 5.7mm !important;
                    max-width: calc(100% - 5.7mm) !important;
                    font-size: 7.5px !important;
                    line-height: 1.2 !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.2px !important;
                    overflow-wrap: anywhere !important;
                    word-break: break-all !important;
                }

                .thermal-empty {
                    width: 100% !important;
                    padding: 2mm 0 !important;
                    text-align: center !important;
                    font-size: 8.5px !important;
                    font-weight: 700 !important;
                }

                .thermal-totals {
                    width: 100% !important;
                    margin-top: 0.5mm !important;
                }

                .thermal-amount-row {
                    width: 100% !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: baseline !important;
                    gap: 4mm !important;
                    min-width: 0 !important;
                    font-size: 9.5px !important;
                    line-height: 1.65 !important;
                    font-weight: 700 !important;
                }

                .thermal-amount-row span:first-child {
                    min-width: 0 !important;
                    overflow-wrap: anywhere !important;
                }

                .thermal-amount-row span:last-child {
                    flex-shrink: 0 !important;
                    white-space: nowrap !important;
                    text-align: right !important;
                }

                .thermal-amount-row-strong {
                    font-size: 11.5px !important;
                    font-weight: 900 !important;
                    line-height: 1.7 !important;
                }

                .thermal-payment-summary {
                    width: 100% !important;
                    margin-top: 1mm !important;
                }

                .thermal-payment-notice {
                    width: 100% !important;
                    text-align: center !important;
                    font-size: 9px !important;
                    line-height: 1.55 !important;
                    font-weight: 700 !important;
                }

                .thermal-payment-notice-title {
                    font-size: 9.5px !important;
                    font-weight: 900 !important;
                    letter-spacing: 0.4px !important;
                }

                .thermal-footer {
                    width: 100% !important;
                    margin-top: auto !important;
                    padding-top: 1mm !important;
                    text-align: center !important;
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }

                .thermal-footer .thermal-divider {
                    margin-top: 0 !important;
                    margin-bottom: 2.5mm !important;
                }

                .thermal-footer-thanks {
                    font-size: 10px !important;
                    font-weight: 900 !important;
                    line-height: 1.45 !important;
                }

                .thermal-footer-brand {
                    margin-top: 0.8mm !important;
                    font-size: 10px !important;
                    font-weight: 900 !important;
                    line-height: 1.35 !important;
                }

                .thermal-footer-tagline {
                    margin-top: 1mm !important;
                    font-size: 7.5px !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.8px !important;
                }

                .thermal-footer-contact {
                    margin-top: 1.5mm !important;
                    font-size: 8.5px !important;
                    font-weight: 800 !important;
                }

                .thermal-footer-generated {
                    margin-top: 1.2mm !important;
                    font-size: 6.5px !important;
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
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>${sale.invoiceNumber || "MYNIX Receipt"}</title>
                    ${applicationStyles}
                    ${thermalStyles}
                </head>
                <body>
                    <div id="thermal-receipt-print">
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
            <DialogContent className="fixed left-0 top-0 z-[100] flex h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-0 bg-slate-100 p-0 shadow-none sm:left-1/2 sm:top-1/2 sm:h-[92vh] sm:w-[calc(100%-2rem)] sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:shadow-2xl md:max-w-2xl">
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4">
                    <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900 sm:text-lg">
                            Invoice Preview
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[10px] font-medium text-slate-400 sm:text-xs">
                            {sale.invoiceNumber}
                        </p>
                    </div>

                    <div className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 sm:text-[10px]">
                        Receipt
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-100 px-2 py-3 sm:px-4 sm:py-5">
                    <div
                        id="receipt-print-area"
                        className="mx-auto w-full max-w-[480px] overflow-visible rounded-2xl bg-white shadow-sm sm:rounded-xl"
                    >
                        <Receipt sale={sale} />
                    </div>

                    <div
                        id="thermal-receipt-print-area"
                        aria-hidden="true"
                        className="fixed left-[-100000px] top-0 w-[79mm] overflow-hidden bg-white"
                    >
                        <ThermalReceipt sale={sale} />
                    </div>
                </div>

                <div className="shrink-0 border-t border-slate-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99] sm:w-auto"
                        >
                            Done
                        </button>

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="min-h-11 w-full rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] sm:w-auto"
                        >
                            Print Invoice
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ReceiptModal;
