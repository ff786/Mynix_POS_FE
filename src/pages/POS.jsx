import { useCallback, useState } from "react";

import ScanPanel from "@/components/pos/ScanPanel";
import CartTable from "@/components/pos/CartTable";
import CartSummary from "@/components/pos/CartSummary";
import PaymentPanel from "@/components/pos/PaymentPanel";
import CustomerSelector from "@/components/pos/CustomerSelector";
import DeliveryPanel from "@/components/pos/DeliveryPanel";
import { EMPTY_DELIVERY } from "@/constants/delivery";
import ReceiptModal from "@/components/receipt/ReceiptModal";

import { completeSale } from "@/services/posApi";
import { toast } from "sonner";

function POS() {
    const [cart, setCart] = useState([]);

    const [paymentMethod, setPaymentMethod] =
        useState("CASH");

    const [processing, setProcessing] =
        useState(false);

    const [discount, setDiscount] =
        useState(0);

    const [deliveryFee, setDeliveryFee] =
        useState(0);

    const [receipt, setReceipt] =
        useState(null);

    const [receiptOpen, setReceiptOpen] =
        useState(false);

    const [selectedCustomer, setSelectedCustomer] =
        useState(null);

    const [customerError, setCustomerError] =
        useState(false);

    /* "Deliver this order" (phone / WhatsApp orders) */
    const [delivery, setDelivery] =
        useState(EMPTY_DELIVERY);

    const DELIVERY_PAYMENTS = ["CREDIT", "BANK_DEPOSIT"];

    const handleDeliveryChange = useCallback(
        (update) => setDelivery(update),
        []
    );

    const toggleDelivery = (enabled) => {
        setDelivery((d) => ({ ...d, enabled }));
        if (enabled && !DELIVERY_PAYMENTS.includes(paymentMethod)) {
            // Cash on delivery is recorded as a credit sale.
            setPaymentMethod("CREDIT");
        }
    };


    const increaseQuantity = (barcode) => {
        setCart((previous) =>
            previous.map((item) => {

                if (item.barcode !== barcode) {
                    return item;
                }

                if (
                    item.quantity >=
                    item.stockQuantity
                ) {
                    toast.error(
                        `Only ${item.stockQuantity} available in stock.`
                    );

                    return item;
                }

                return {
                    ...item,
                    quantity:
                        item.quantity + 1,
                };
            })
        );
    };


    const decreaseQuantity = (barcode) => {
        setCart((previous) =>
            previous
                .map((item) =>
                    item.barcode === barcode
                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1,
                        }
                        : item
                )
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    };


    const removeItem = (barcode) => {
        setCart((previous) =>
            previous.filter(
                (item) =>
                    item.barcode !== barcode
            )
        );
    };


    async function handleCompleteSale() {

        if (cart.length === 0) {
            toast.error("Cart is empty.");
            return;
        }


        /*
         * MYNIX sales are customer-linked so the
         * backend can send the official invoice SMS.
         */

        if (!selectedCustomer) {

            setCustomerError(true);

            toast.error(
                "Please select or create a customer before completing the sale."
            );

            return;
        }


        setCustomerError(false);

        if (delivery.enabled) {
            if (!DELIVERY_PAYMENTS.includes(paymentMethod)) {
                toast.error("Delivery orders are paid by Credit (cash on delivery) or Bank Deposit.");
                return;
            }
            const a = delivery.address;
            if (delivery.savedAddressId === null &&
                (!a.addressLine1.trim() || !a.city.trim() || !a.district)) {
                toast.error("Enter the delivery address, city and district.");
                return;
            }
        }


        try {

            setProcessing(true);


            const payload = {
                customerId:
                selectedCustomer.id,

                paymentMethod,

                discount:
                    Number(discount) || 0,

                deliveryFee:
                    Number(deliveryFee) || 0,

                items: cart.map((item) => ({
                    barcode: item.barcode,
                    quantity: item.quantity,
                })),

                delivery: delivery.enabled
                    ? {
                        channel: delivery.channel,
                        savedAddressId: delivery.savedAddressId,
                        ...(delivery.savedAddressId === null ? delivery.address : {}),
                        saveAddress: delivery.saveAddress,
                        notes: delivery.notes,
                    }
                    : undefined,
            };


            const response =
                await completeSale(
                    payload
                );


            const saleReceipt = {
                ...response,

                /*
                 * Prefer the backend response for
                 * customer details.
                 */

                customerId:
                    response.customerId ??
                    selectedCustomer.id,

                customerName:
                    response.customerName ??
                    selectedCustomer.name,

                customerContactNumber:
                    response.customerContactNumber ??
                    selectedCustomer.contactNumber,

                customerOutstanding:
                    response.customerOutstanding ??
                    selectedCustomer.outstanding ??
                    0,

                /*
                 * Cart gives us the exact item
                 * snapshot shown at checkout.
                 */

                items: [...cart],

                /*
                 * Prefer the backend timestamp.
                 */

                createdAt:
                    response.createdAt ??
                    new Date().toISOString(),
            };


            setReceipt(
                saleReceipt
            );

            setReceiptOpen(true);


            toast.success(
                delivery.enabled
                    ? "Delivery order created — see Online Orders."
                    : "Sale completed successfully."
            );

            setDelivery(EMPTY_DELIVERY);


            setCart([]);

            setSelectedCustomer(null);

            setCustomerError(false);

            setPaymentMethod(
                "CASH"
            );

            setDiscount(0);

            setDeliveryFee(0);


        } catch (error) {

            console.error(
                "CHECKOUT ERROR:",
                error.response?.data ||
                error
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
        <div className="
            flex
            flex-col
            gap-4
            md:gap-6
            lg:grid
            lg:grid-cols-3
        ">

            {/* =====================================================
                PRODUCTS / CART
            ====================================================== */}

            <div className="
                flex
                min-w-0
                flex-col
                gap-4
                md:gap-6
                lg:col-span-2
            ">

                <ScanPanel
                    cart={cart}
                    setCart={setCart}
                />


                <CustomerSelector
                    customer={
                        selectedCustomer
                    }

                    onCustomerChange={
                        setSelectedCustomer
                    }

                    onSelect={(
                        customer
                    ) => {
                        setSelectedCustomer(
                            customer
                        );

                        setCustomerError(
                            false
                        );
                    }}

                    onClear={() => {
                        setSelectedCustomer(
                            null
                        );

                        setDelivery(EMPTY_DELIVERY);

                        setCustomerError(
                            false
                        );
                    }}

                    showError={
                        customerError
                    }
                />


                <DeliveryPanel
                    customer={selectedCustomer}
                    delivery={delivery}
                    onChange={handleDeliveryChange}
                    onToggle={toggleDelivery}
                />


                <CartTable
                    cart={cart}
                    onIncrease={
                        increaseQuantity
                    }
                    onDecrease={
                        decreaseQuantity
                    }
                    onRemove={
                        removeItem
                    }
                />

            </div>


            {/* CHECKOUT*/}

            <div className="
                flex
                min-w-0
                flex-col
                gap-4
                md:gap-6
            ">

                <CartSummary
                    cart={cart}
                    discount={discount}
                    setDiscount={
                        setDiscount
                    }
                    deliveryFee={
                        deliveryFee
                    }
                    setDeliveryFee={
                        setDeliveryFee
                    }
                />


                <PaymentPanel
                    cart={cart}
                    paymentMethod={
                        paymentMethod
                    }
                    setPaymentMethod={
                        setPaymentMethod
                    }
                    onCompleteSale={
                        handleCompleteSale
                    }
                    allowedMethods={
                        delivery.enabled
                            ? DELIVERY_PAYMENTS
                            : null
                    }
                    loading={
                        processing
                    }
                />

            </div>


            {/*RECEIPT*/}

            <ReceiptModal
                open={receiptOpen}
                onOpenChange={
                    setReceiptOpen
                }
                sale={receipt}
            />

        </div>
    );
}

export default POS;