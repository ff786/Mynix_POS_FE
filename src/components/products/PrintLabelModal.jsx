import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ProductLabel from "./ProductLabel";
import LabelPrintRenderer from "./LabelPrintRenderer";

function PrintLabelModal({
                             open,
                             onOpenChange,
                             products,
                         }) {

    const [quantities, setQuantities] =
        useState({});

    const productList =
        Array.isArray(products)
            ? products
            : products
                ? [products]
                : [];

    function getQuantity(product) {

        return quantities[product.id] || 1;

    }

    function setQuantity(productId, value) {

        const quantity =
            Math.max(
                1,
                Math.min(
                    100,
                    Number(value) || 1
                )
            );

        setQuantities(previous => ({
            ...previous,
            [productId]: quantity,
        }));

    }

    const totalLabels =
        productList.reduce(
            (total, product) =>
                total + getQuantity(product),
            0
        );

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-3xl">

                <DialogHeader>

                    <DialogTitle>
                        Print Product Labels
                    </DialogTitle>

                </DialogHeader>

                <div className="space-y-5">

                    <div className="border rounded-xl overflow-hidden">

                        {productList.map(product => (

                            <div
                                key={product.id}
                                className="flex items-center justify-between p-4 border-b last:border-b-0"
                            >

                                <div>

                                    <p className="font-semibold">
                                        {product.name}
                                    </p>

                                    <p className="text-sm text-slate-500 font-mono">
                                        {product.barcode}
                                    </p>

                                </div>

                                <div className="flex items-center gap-3">

                                    <label className="text-sm text-slate-500">
                                        Labels
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={getQuantity(product)}
                                        onChange={(e) =>
                                            setQuantity(
                                                product.id,
                                                e.target.value
                                            )
                                        }
                                        className="w-24 border rounded-lg px-3 py-2 text-center"
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="bg-slate-50 border rounded-xl p-5">

                        <p className="font-medium mb-4">
                            Preview
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center max-h-[350px] overflow-auto">

                            {productList.map(product => (

                                <ProductLabel
                                    key={product.id}
                                    product={product}
                                />

                            ))}

                        </div>

                    </div>

                    <div className="flex justify-between items-center">

                        <p className="text-sm text-slate-500">

                            {productList.length} product
                            {productList.length !== 1
                                ? "s"
                                : ""}

                            {" • "}

                            {totalLabels} label
                            {totalLabels !== 1
                                ? "s"
                                : ""}

                        </p>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    onOpenChange(false)
                                }
                                className="px-5 py-2.5 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "start-label-print"
                                        )
                                        ?.click()
                                }
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                            >
                                Print {totalLabels} Label
                                {totalLabels !== 1
                                    ? "s"
                                    : ""}
                            </button>

                        </div>

                    </div>

                </div>

                <button
                    id="start-label-print"
                    className="hidden"
                />

                <LabelPrintRenderer
                    products={productList}
                    quantities={quantities}
                    onPrinted={() =>
                        onOpenChange(false)
                    }
                />

            </DialogContent>

        </Dialog>
    );
}

export default PrintLabelModal;