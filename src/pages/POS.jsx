import { useState } from "react";

import ScanPanel from "@/components/pos/ScanPanel";
import CartTable from "@/components/pos/CartTable";
import CartSummary from "@/components/pos/CartSummary";
import PaymentPanel from "@/components/pos/PaymentPanel";
import CustomerSelector from "@/components/pos/CustomerSelector";

import ReceiptModal from "@/components/receipt/ReceiptModal";

import { completeSale } from "@/services/posApi";
import { toast } from "sonner";
function POS() {

    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [processing, setProcessing] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);

    const [receipt, setReceipt] = useState(null);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const increaseQuantity = (barcode) => {
        setCart(previous =>
            previous.map(item => {

                if (item.barcode !== barcode) {
                    return item;
                }

                if (item.quantity >= item.stockQuantity) {
                    toast.error(
                        `Only ${item.stockQuantity} available in stock.`
                    );

                    return item;
                }

                return {
                    ...item,
                    quantity: item.quantity + 1,
                };
            })
        );
    };

    const decreaseQuantity = (barcode) => {
        setCart(previous =>
            previous
                .map(item =>
                    item.barcode === barcode
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const removeItem = (barcode) => {
        setCart(previous =>
            previous.filter(item => item.barcode !== barcode)
        );
    };

    async function handleCompleteSale() {

        if (cart.length === 0) {
            toast.error("Cart is empty.");
            return;
        }

        if (!customer) {
            toast.error(
                "Please select or create a customer before completing the sale."
            );
            return;
        }
        try {
            setProcessing(true);
            const payload = {
                customerId: selectedCustomer?.id ?? null,
                paymentMethod,
                discount: Number(discount),
                deliveryFee: Number(deliveryFee),

                items: cart.map(item => ({
                    barcode: item.barcode,
                    quantity: item.quantity,
                })),
            };


            const response = await completeSale(payload);

            const saleReceipt = {
                ...response,
                items: [...cart],
                createdAt: new Date().toISOString(),
            };

            setReceipt(saleReceipt);
            setReceiptOpen(true);

            toast.success("Sale Completed");

            setCart([]);
            setSelectedCustomer(null);
            setPaymentMethod("CASH");
            setDiscount(0);
            setDeliveryFee(0);

        } catch (error) {

            console.error(
                "CHECKOUT ERROR:",
                error.response?.data || error
            );

            toast.error(
                error.response?.data?.message ??
                "Sale failed."
            );

        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:h-full">

            <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 lg:h-full lg:overflow-hidden">

                <ScanPanel
                    cart={cart}
                    setCart={setCart}
                />

                <CustomerSelector
                    customer={selectedCustomer}
                    onCustomerChange={setSelectedCustomer}
                    onSelect={setSelectedCustomer}
                    onClear={() => setSelectedCustomer(null)}
                />

                <CartTable
                    cart={cart}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={removeItem}
                />

            </div>

            <div className="flex flex-col gap-4 md:gap-6">

                <CartSummary
                    cart={cart}
                    discount={discount}
                    setDiscount={setDiscount}
                    deliveryFee={deliveryFee}
                    setDeliveryFee={setDeliveryFee}
                />

                <PaymentPanel
                    cart={cart}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onCompleteSale={handleCompleteSale}
                    loading={processing}
                />

            </div>

            <ReceiptModal
                open={receiptOpen}
                onOpenChange={setReceiptOpen}
                sale={receipt}
            />

        </div>
    );
}

export default POS;
