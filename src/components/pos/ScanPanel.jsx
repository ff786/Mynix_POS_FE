import {useState, useRef} from "react";
import { ScanBarcode } from "lucide-react";
import {toast} from "sonner";
import {scanBarcode} from "@/services/posApi.js";

function ScanPanel({ cart, setCart }) {

    const [barcode, setBarcode] = useState("");

    const inputRef = useRef(null);

    async function handleKeyDown(e) {

        if (e.key !== "Enter") return;
        if (!barcode.trim()) return;
        try {
            const product = await scanBarcode(barcode);
            setCart(previous => {
                const existing = previous.find(
                    item => item.barcode === product.barcode
                );
                if (existing) {
                    if (existing.quantity >= product.stockQuantity) {
                        toast.error(
                            `Only ${product.stockQuantity} available in stock.`
                        );
                        return previous;
                    }
                    toast.success(`${product.name} quantity increased`);
                    return previous.map(item =>
                        item.barcode === product.barcode
                            ? {
                                ...item,
                                quantity: item.quantity + 1,
                            }
                            : item
                    );
                }
                if (product.stockQuantity <= 0) {
                    toast.error(
                        `${product.name} is out of stock.`
                    );
                    return previous;
                }
                toast.success(`${product.name} added`);
                return [
                    ...previous,
                    {
                        ...product,
                        quantity: 1,
                    },
                ];
            });
        } catch {
            toast.error("Product not found.");
        }
        setBarcode("");
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }
    return (
        <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <ScanBarcode className="text-emerald-600"/>
                <h2 className="text-lg sm:text-xl font-semibold">
                    Scan Barcode
                </h2>
            </div>
            <input
                ref={inputRef}
                autoFocus
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Waiting for scanner..."
                className="w-full border rounded-lg p-3.5 sm:p-4 text-base sm:text-lg"
            />
        </div>
    );
}

export default ScanPanel;