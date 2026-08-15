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

    if (!sale) return null;

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="max-w-lg">

                <Receipt sale={sale} />

                <div className="flex gap-3 mt-6">

                    <button
                        onClick={() => window.print()}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3"
                    >
                        Print Receipt
                    </button>

                    <button
                        onClick={() => onOpenChange(false)}
                        className="flex-1 border rounded-lg py-3"
                    >
                        Done
                    </button>

                </div>

            </DialogContent>

        </Dialog>

    );

}

export default ReceiptModal;