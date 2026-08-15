import Barcode from "react-barcode";

function ProductLabel({ product }) {

    return (
        <div
            className="
                product-label
                w-[300px]
                min-h-[180px]
                bg-white
                border-2
                border-slate-900
                rounded-lg
                px-5
                py-4
                flex
                flex-col
                items-center
                justify-between
            "
        >

            <div className="text-center">

                <h2 className="text-lg font-bold tracking-[0.2em]">
                    MYNIX
                </h2>

                <p className="text-xs text-slate-500 uppercase tracking-wider">
                    POS SYSTEM
                </p>

            </div>

            <div className="text-center">

                <p className="font-semibold text-base">
                    {product.name}
                </p>

            </div>

            <Barcode
                value={product.barcode}
                format="CODE128"
                width={1.7}
                height={45}
                displayValue={false}
                margin={0}
            />

            <p className="font-mono text-sm font-semibold tracking-wider">
                {product.barcode}
            </p>

            <p className="text-lg font-bold">
                Rs. {Number(product.sellingPrice).toLocaleString()}
            </p>

        </div>
    );
}

export default ProductLabel;