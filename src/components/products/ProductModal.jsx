import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ProductForm from "./ProductForm";

function ProductModal({
                          open,
                          onOpenChange,
                          product,
                          onSuccess,
                      }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        {product ? "Edit Product" : "Add Product"}
                    </DialogTitle>
                </DialogHeader>

                <ProductForm
                    product={product}
                    onSuccess={onSuccess}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ProductModal;