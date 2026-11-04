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

/** Customers who paid online but whose order could not be placed (open alerts only). */
export async function getPaymentAlerts() {
    const response = await api.get("/payment-alerts");
    return response.data;
}

export async function markPaymentAlertHandled(id) {
    const response = await api.put(`/payment-alerts/${id}/handled`);
    return response.data;
}
