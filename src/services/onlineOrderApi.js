import api from "./api";

/** Website orders (placed on the MYNIX website, recorded as POS sales). */
export async function getOnlineOrders() {
    const response = await api.get("/online-orders");
    return response.data;
}

/** action: "pack" | "dispatch" | "deliver" | "cancel" */
export async function updateOnlineOrder(invoiceNumber, action) {
    const response = await api.post(
        `/online-orders/${encodeURIComponent(invoiceNumber)}/${action}`
    );
    return response.data;
}
