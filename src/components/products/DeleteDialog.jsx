import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import {
    AlertTriangle,
    Trash2,
} from "lucide-react";


function DeleteDialog({
                          open,
                          onOpenChange,
                          product,
                          onConfirm,
                      }) {

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="
                w-[calc(100%-1rem)]
                max-w-md
                rounded-2xl
                p-5
                sm:p-6
            ">

                <DialogHeader>

                    <div className="
                        w-11 h-11
                        rounded-xl
                        bg-red-50
                        flex
                        items-center
                        justify-center
                        mb-3
                    ">
                        <AlertTriangle
                            size={21}
                            className="text-red-600"
                        />
                    </div>


                    <DialogTitle className="
                        text-xl
                        font-bold
                        text-slate-900
                    ">
                        Delete Product
                    </DialogTitle>


                    <DialogDescription className="
                        pt-2
                        text-sm
                        leading-6
                    ">

                        Are you sure you want to delete{" "}

                        <span className="
                            font-semibold
                            text-slate-800
                        ">
                            {product?.name}
                        </span>
                        ?

                        <br />

                        <span className="text-slate-400">
                            This product will no longer appear in the POS system.
                        </span>

                    </DialogDescription>

                </DialogHeader>


                <div className="
                    flex
                    flex-col-reverse
                    sm:flex-row
                    sm:justify-end
                    gap-3
                    mt-6
                ">

                    <button
                        type="button"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        className="
                            w-full
                            sm:w-auto
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-700
                            font-medium
                            hover:bg-slate-50
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={onConfirm}
                        className="
                            w-full
                            sm:w-auto
                            px-4
                            py-2.5
                            rounded-xl
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <Trash2 size={16} />

                        Delete Product

                    </button>

                </div>

            </DialogContent>

        </Dialog>
    );
}

export default DeleteDialog;