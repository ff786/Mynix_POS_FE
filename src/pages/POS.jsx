import ScanPanel from "../components/pos/ScanPanel";
import CartTable from "../components/pos/CartTable";
import CartSummary from "../components/pos/CartSummary";
import PaymentPanel from "../components/pos/PaymentPanel";

function POS() {

    return (
        <div className="grid grid-cols-3 gap-6 h-full">
            <div className="col-span-2 flex flex-col gap-6">
                <ScanPanel />
                <CartTable />
            </div>
            <div className="flex flex-col gap-6">
                <CartSummary />
                <PaymentPanel />
            </div>
        </div>
    );
}

export default POS;