import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,} from "@/components/ui/dialog";

function DeleteDialog({open, onOpenChange, product, onConfirm,}) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-red-600">
                        Delete Product
                    </DialogTitle>
                    <DialogDescription className="pt-3">
                        Are you sure you want to delete
                        <span className="font-semibold">
                            {" "}{product?.name}
                        </span>?
                        <br /><br />
                        This product will no longer appear in the POS system.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="border rounded-lg px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2"
                    >
                        Delete Product
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteDialog;