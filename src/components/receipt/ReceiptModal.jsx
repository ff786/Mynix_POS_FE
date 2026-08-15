import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import Receipt from "./Receipt";

function ReceiptModal({
                          open,
                          onOpenChange,
                          sale,
                      }) {
    if (!sale) {
        return null;
    }

    function handlePrint() {
        window.print();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-1rem)] max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
                <div id="receipt-print-area" className="bg-white">
                    <Receipt sale={sale} />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2.5 mt-4 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 min-h-11 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Done
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 min-h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold"
                    >
                        Print Receipt
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ReceiptModal;