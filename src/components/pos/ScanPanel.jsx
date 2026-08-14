import { ScanBarcode } from "lucide-react";

function ScanPanel() {

    return (
        <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center gap-3 mb-5">
                <ScanBarcode className="text-emerald-600"/>
                <h2 className="text-xl font-semibold">
                    Scan Barcode
                </h2>
            </div>
            <input
                autoFocus
                placeholder="Waiting for scanner..."
                className="w-full border rounded-lg p-4 text-lg"
            />
        </div>
    );
}

export default ScanPanel;