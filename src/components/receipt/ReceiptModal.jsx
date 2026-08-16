import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import Receipt from "./Receipt";
import { Printer, X } from "lucide-react";

function ReceiptModal({
                          open,
                          onOpenChange,
                          sale,
                      }) {
    if (!sale) return null;

    function handlePrint() {
        window.print();
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className="
                    w-[calc(100%-1rem)]
                    max-w-lg
                    max-h-[92vh]
                    overflow-y-auto
                    rounded-2xl
                    p-0
                    print:fixed
                    print:inset-0
                    print:w-full
                    print:max-w-none
                    print:max-h-none
                    print:overflow-visible
                    print:p-0
                    print:border-0
                    print:shadow-none
                "
            >
                {/* Receipt */}
                <div
                    id="receipt-print-area"
                    className="
                        bg-white
                        p-4
                        sm:p-6
                        print:p-0
                    "
                >
                    <Receipt sale={sale} />
                </div>

                {/* Actions */}
                <div
                    className="
                        flex
                        flex-col-reverse
                        sm:flex-row
                        gap-2.5
                        p-4
                        sm:p-6
                        pt-0
                        print:hidden
                    "
                >
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="
                            flex-1
                            min-h-11
                            border
                            border-slate-200
                            rounded-xl
                            text-sm
                            font-semibold
                            text-slate-600
                            hover:bg-slate-50
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <X size={17} />
                        Done
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="
                            flex-1
                            min-h-11
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            rounded-xl
                            text-sm
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <Printer size={17} />
                        Print Receipt
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ReceiptModal;