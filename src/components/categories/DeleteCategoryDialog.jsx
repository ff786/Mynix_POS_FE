import {
    AlertTriangle,
    Trash2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

function DeleteCategoryDialog({
                                  open,
                                  onOpenChange,
                                  category,
                                  onConfirm,
                              }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-1rem)] max-w-md rounded-2xl p-5 sm:p-6">
                <DialogHeader>
                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                        <AlertTriangle size={21} className="text-red-600" />
                    </div>

                    <DialogTitle className="text-xl font-bold text-slate-900">
                        Delete Category
                    </DialogTitle>

                    <DialogDescription className="pt-2 text-sm leading-6">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-800">
                            {category?.name}
                        </span>
                        ?

                        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700 leading-5">
                            Products belonging to this category may prevent the category from being deleted.
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-5">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete Category
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteCategoryDialog;