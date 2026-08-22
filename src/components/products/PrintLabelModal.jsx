import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
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
                w-[calc(100%-1rem)]
                max-w-4xl
                max-h-[92vh]
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-0
                shadow-lg
            ">

                {/* HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    bg-white
                    px-5
                    py-4
                    sm:px-6
                ">

                    <div className="flex items-center gap-3">

                        <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-emerald-100
                            flex
                            items-center
                            justify-center
                            shrink-0
                        ">
                            <Printer
                                size={18}
                                className="text-emerald-600"
                            />
                        </div>

                        <div>
                            <p className="
                                font-bold
                                text-base
                                text-slate-900
                            ">
                                Print Product Labels
                            </p>
                            <p className="
                                text-xs
                                text-slate-500
                                mt-0.5
                            ">
                                {productList.length} product{productList.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                    </div>

                </div>


                {/* CONTENT */}

                <div className="
                    min-h-0
                    overflow-y-auto
                    px-5
                    py-4
                    sm:px-6
                ">

                    {productList.length === 0 ? (

                        <div className="
                            py-12
                            text-center
                            text-slate-500
                        ">
                            No products selected.
                        </div>

                    ) : (

                        <div className="space-y-4">


                            {/* PRODUCTS LIST */}
                            <div className="
                                border
                                border-slate-200
                                rounded-lg
                                overflow-hidden
                                divide-y
                                divide-slate-100
                            ">

                                {productList.map((product) => (

                                    <div
                                        key={product.id}
                                        className="
                                            p-4
                                            flex
                                            flex-col
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                            gap-4
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                            min-w-0
                                            flex-1
                                        ">

                                            {product.imageUrl ? (

                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="
                                                        w-11
                                                        h-11
                                                        rounded-lg
                                                        object-cover
                                                        border
                                                        border-slate-200
                                                        shrink-0
                                                    "
                                                />

                                            ) : (

                                                <div className="
                                                    w-11
                                                    h-11
                                                    rounded-lg
                                                    bg-slate-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                ">
                                                    <Package
                                                        size={18}
                                                        className="text-slate-400"
                                                    />
                                                </div>

                                            )}

                                            <div className="min-w-0">

                                                <p className="
                                                    font-semibold
                                                    text-slate-900
                                                    text-sm
                                                    truncate
                                                ">
                                                    {product.name}
                                                </p>

                                                <p className="
                                                    text-xs
                                                    text-slate-500
                                                    font-mono
                                                    mt-0.5
                                                    truncate
                                                ">
                                                    {product.barcode}
                                                </p>

                                            </div>

                                        </div>


                                        {/* QUANTITY CONTROL */}
                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            sm:justify-end
                                            gap-3
                                        ">

                                            <span className="
                                                text-xs
                                                sm:text-sm
                                                text-slate-500
                                                font-medium
                                            ">
                                                Labels
                                            </span>

                                            <div className="
                                                flex
                                                items-center
                                                border
                                                border-slate-200
                                                rounded-lg
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
                                                        w-8
                                                        h-8
                                                        flex
                                                        items-center
                                                        justify-center
                                                        hover:bg-slate-50
                                                        disabled:opacity-30
                                                        transition
                                                    "
                                                >
                                                    <Minus size={14} />
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
                                                        w-10
                                                        h-8
                                                        border-x
                                                        border-slate-200
                                                        text-center
                                                        text-xs
                                                        sm:text-sm
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
                                                        w-8
                                                        h-8
                                                        flex
                                                        items-center
                                                        justify-center
                                                        hover:bg-slate-50
                                                        disabled:opacity-30
                                                        transition
                                                    "
                                                >
                                                    <Plus size={14} />
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>


                            {/* PREVIEW SECTION */}
                            <div className="
                                rounded-lg
                                border
                                border-slate-200
                                bg-slate-50
                                p-4
                            ">

                                <div className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-3
                                    mb-4
                                ">

                                    <div>

                                        <p className="
                                            font-semibold
                                            text-slate-800
                                            text-sm
                                        ">
                                            Label Preview
                                        </p>

                                        <p className="
                                            text-xs
                                            text-slate-500
                                            mt-0.5
                                        ">
                                            Compact label layout used for printing.
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
                                        whitespace-nowrap
                                    ">
                                        {totalLabels} label{totalLabels !== 1 ? "s" : ""}
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    flex-wrap
                                    gap-3
                                    justify-center
                                    max-h-[300px]
                                    overflow-auto
                                ">

                                    {productList.map(product => (

                                        <ProductLabel
                                            key={product.id}
                                            product={product}
                                        />

                                    ))}

                                </div>

                            </div>

                        </div>

                    )}

                </div>


                {/* FOOTER */}

                <div className="
                    flex
                    flex-col-reverse
                    gap-2
                    border-t
                    border-slate-200
                    bg-white
                    p-4
                    sm:p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <p className="
                        text-xs
                        sm:text-sm
                        text-slate-600
                        text-center
                        sm:text-left
                    ">
                        {productList.length} product{productList.length !== 1 ? "s" : ""} • {totalLabels} label{totalLabels !== 1 ? "s" : ""}
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
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                text-xs
                                sm:text-sm
                                font-medium
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                active:scale-[0.98]
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
                                px-4
                                py-2
                                rounded-lg
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                text-xs
                                sm:text-sm
                                font-semibold
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition
                                disabled:opacity-50
                                active:scale-[0.98]
                            "
                        >

                            <Printer size={15} />

                            <span className="hidden sm:inline">
                                {printRequested
                                    ? "Preparing..."
                                    : `Print ${totalLabels} Label${totalLabels !== 1 ? "s" : ""}`
                                }
                            </span>

                            <span className="sm:hidden">
                                {printRequested ? "..." : "Print"}
                            </span>

                        </button>

                    </div>

                </div>


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