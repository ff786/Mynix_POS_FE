import Barcode from "react-barcode";


function ProductLabel({ product }) {

    return (

        <div
            className="
                w-[260px]
                h-[156px]
                shrink-0
                bg-white
                border
                border-slate-300
                rounded-xl
                p-3
                flex
                flex-col
                items-center
                justify-between
                shadow-sm
            "
        >

            {/* Brand */}
            <div className="text-center leading-none">

                <h2 className="
                    text-base
                    font-black
                    tracking-[0.25em]
                    text-slate-900
                ">
                    MYNIX
                </h2>

                <p className="
                    text-[7px]
                    text-slate-400
                    uppercase
                    tracking-[0.2em]
                    mt-1
                ">
                    POS SYSTEM
                </p>

            </div>


            {/* Product */}
            <p className="
                w-full
                text-center
                text-[11px]
                font-bold
                text-slate-900
                truncate
            ">
                {product.name}
            </p>


            {/* Barcode */}
            <Barcode
                value={product.barcode}
                format="CODE128"
                width={1.25}
                height={34}
                displayValue={false}
                margin={0}
            />


            {/* Barcode text */}
            <p className="
                font-mono
                text-[8px]
                font-semibold
                tracking-[0.12em]
                text-slate-700
            ">
                {product.barcode}
            </p>


            {/* Price */}
            <p className="
                text-sm
                font-black
                text-slate-900
            ">
                Rs. {Number(
                product.sellingPrice
            ).toLocaleString()}
            </p>

        </div>
    );
}

export default ProductLabel;