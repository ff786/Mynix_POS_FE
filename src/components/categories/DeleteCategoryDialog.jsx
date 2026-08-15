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

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-md">

                <DialogHeader>

                    <DialogTitle className="text-red-600">
                        Delete Category
                    </DialogTitle>

                    <DialogDescription className="pt-3">

                        Are you sure you want to delete

                        <span className="font-semibold">
                            {" "}
                            {category?.name}
                        </span>
                        ?

                        <br />
                        <br />

                        Products belonging to this category
                        may prevent deletion.

                    </DialogDescription>

                </DialogHeader>


                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={() =>
                            onOpenChange(false)
                        }
                        className="
                            border
                            rounded-lg
                            px-4
                            py-2
                        "
                    >
                        Cancel
                    </button>


                    <button
                        onClick={onConfirm}
                        className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            rounded-lg
                            px-4
                            py-2
                        "
                    >
                        Delete Category
                    </button>

                </div>

            </DialogContent>

        </Dialog>
    );
}

export default DeleteCategoryDialog;