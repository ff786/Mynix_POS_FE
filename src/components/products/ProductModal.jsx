import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ProductForm from "./ProductForm";


function ProductModal({open, onOpenChange, product, onSuccess,}) {

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="
                w-[calc(100%-1rem)]
                max-w-6xl
                max-h-[96vh]
                overflow-y-auto
                rounded-2xl
                p-5
                sm:p-6
            ">

                <DialogHeader>

                    <DialogTitle className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-slate-900
                    ">
                        {product
                            ? "Edit Product"
                            : "Add Product"
                        }
                    </DialogTitle>

                </DialogHeader>


                <ProductForm
                    product={product}
                    onSuccess={onSuccess}
                    onClose={() =>
                        onOpenChange(false)
                    }
                />

            </DialogContent>

        </Dialog>
    );
}

export default ProductModal;