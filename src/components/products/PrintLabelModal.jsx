import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Printer,
    Minus,
    Plus,
    Package,
} from "lucide-react";

import ProductLabel from "./ProductLabel";
import LabelPrintRenderer from "./LabelPrintRenderer";


function PrintLabelModal({open, onOpenChange, products,}) {

    const [quantities, setQuantities] = useState({});
    const [printRequested, setPrintRequested] = useState(false);


    const productList =
        Array.isArray(products)
            ? products
            : products
                ? [products]
                : [];


    /*
     * Reset quantities whenever a new
     * print session starts.
     */
    useEffect(() => {

        if (!open) {
            return;
        }

        const initialQuantities = {};

        productList.forEach(product => {

            initialQuantities[product.id] = 1;

        });

        setQuantities(initialQuantities);
        setPrintRequested(false);

    }, [open, products]);


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


    function decreaseQuantity(product) {

        const current =
            getQuantity(product);

        setQuantity(
            product.id,
            current - 1
        );

    }


    function increaseQuantity(product) {

        const current =
            getQuantity(product);

        setQuantity(
            product.id,
            current + 1
        );

    }


    const totalLabels =
        productList.reduce(
            (total, product) =>
                total + getQuantity(product),
            0
        );


    function handlePrint() {

        if (!productList.length) {
            return;
        }

        setPrintRequested(true);

    }


    function handlePrinted() {

        setPrintRequested(false);

        onOpenChange(false);

    }


    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="
                max-w-6xl
                max-h-[96vh]
                overflow-y-auto
                rounded-2xl
                p-5
                sm:p-6
            ">

                <DialogHeader>

                    <DialogTitle className="
                        flex
                        items-center
                        gap-2
                        text-xl
                        sm:text-2xl
                    ">

                        <div className="
                            w-9 h-9
                            rounded-xl
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                        ">
                            <Printer
                                size={18}
                                className="text-emerald-600"
                            />
                        </div>

                        Print Product Labels

                    </DialogTitle>

                </DialogHeader>


                {productList.length === 0 ? (

                    <div className="
                        py-12
                        text-center
                        text-slate-500
                    ">
                        No products selected.
                    </div>

                ) : (

                    <div className="space-y-5">


                        {/* Products */}
                        <div className="
                            border
                            border-slate-200
                            rounded-2xl
                            overflow-hidden
                        ">

                            {productList.map((product, index) => (

                                <div
                                    key={product.id}
                                    className={`
                                        p-4
                                        flex
                                        flex-col
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                        gap-4
                                        ${
                                        index !==
                                        productList.length - 1
                                            ? "border-b border-slate-100"
                                            : ""
                                    }
                                    `}
                                >

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        min-w-0
                                    ">

                                        {product.imageUrl ? (

                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="
                                                    w-12 h-12
                                                    rounded-xl
                                                    object-cover
                                                    border
                                                    border-slate-200
                                                    shrink-0
                                                "
                                            />

                                        ) : (

                                            <div className="
                                                w-12 h-12
                                                rounded-xl
                                                bg-slate-100
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                            ">
                                                <Package
                                                    size={19}
                                                    className="text-slate-400"
                                                />
                                            </div>

                                        )}

                                        <div className="min-w-0">

                                            <p className="
                                                font-semibold
                                                text-slate-900
                                                truncate
                                            ">
                                                {product.name}
                                            </p>

                                            <p className="
                                                text-xs
                                                text-slate-500
                                                font-mono
                                                mt-1
                                            ">
                                                {product.barcode}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Quantity */}
                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        sm:justify-end
                                        gap-3
                                    ">

                                        <span className="
                                            text-sm
                                            text-slate-500
                                        ">
                                            Labels
                                        </span>

                                        <div className="
                                            flex
                                            items-center
                                            border
                                            border-slate-200
                                            rounded-xl
                                            overflow-hidden
                                        ">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        product
                                                    )
                                                }
                                                disabled={
                                                    getQuantity(product) <= 1
                                                }
                                                className="
                                                    w-9 h-9
                                                    flex
                                                    items-center
                                                    justify-center
                                                    hover:bg-slate-50
                                                    disabled:opacity-30
                                                "
                                            >
                                                <Minus size={15} />
                                            </button>

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
                                                className="
                                                    w-12
                                                    h-9
                                                    border-x
                                                    border-slate-200
                                                    text-center
                                                    text-sm
                                                    font-semibold
                                                    outline-none
                                                "
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(
                                                        product
                                                    )
                                                }
                                                disabled={
                                                    getQuantity(product) >= 100
                                                }
                                                className="
                                                    w-9 h-9
                                                    flex
                                                    items-center
                                                    justify-center
                                                    hover:bg-slate-50
                                                    disabled:opacity-30
                                                "
                                            >
                                                <Plus size={15} />
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* Preview */}
                        <div className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                            sm:p-5
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                mb-4
                            ">

                                <div>

                                    <p className="
                                        font-semibold
                                        text-slate-800
                                    ">
                                        Label Preview
                                    </p>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                        mt-0.5
                                    ">
                                        Actual printed labels use a compact
                                        label layout.
                                    </p>

                                </div>

                                <span className="
                                    text-xs
                                    font-semibold
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-full
                                    px-3
                                    py-1
                                    text-slate-600
                                ">
                                    {totalLabels} label
                                    {totalLabels !== 1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>


                            <div className="
                                flex
                                flex-wrap
                                gap-4
                                justify-center
                                max-h-[360px]
                                overflow-auto
                                p-2
                            ">

                                {productList.map(product => (

                                    <ProductLabel
                                        key={product.id}
                                        product={product}
                                    />

                                ))}

                            </div>

                        </div>


                        {/* Footer */}
                        <div className="
                            flex
                            flex-col-reverse
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-3
                        ">

                            <p className="
                                text-sm
                                text-slate-500
                                text-center
                                sm:text-left
                            ">
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


                            <div className="
                                flex
                                gap-2
                            ">

                                <button
                                    type="button"
                                    onClick={() =>
                                        onOpenChange(false)
                                    }
                                    className="
                                        flex-1
                                        sm:flex-none
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        border
                                        border-slate-200
                                        text-sm
                                        font-medium
                                        text-slate-600
                                        hover:bg-slate-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    disabled={printRequested}
                                    className="
                                        flex-1
                                        sm:flex-none
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        bg-emerald-600
                                        hover:bg-emerald-700
                                        text-white
                                        text-sm
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        disabled:opacity-50
                                    "
                                >

                                    <Printer size={16} />

                                    {printRequested
                                        ? "Preparing..."
                                        : `Print ${totalLabels} Label${totalLabels !== 1 ? "s" : ""}`
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )}


                <LabelPrintRenderer
                    products={productList}
                    quantities={quantities}
                    printRequested={printRequested}
                    onPrinted={handlePrinted}
                />

            </DialogContent>

        </Dialog>
    );
}

export default PrintLabelModal;