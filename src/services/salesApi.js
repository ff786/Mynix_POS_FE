import api from "./api";

export async function getSales() {
    const response = await api.get("/sales");
    return response.data;
}

export async function getSale(invoiceNumber) {
    const response = await api.get(
        `/sales/${invoiceNumber}`
    );

    return response.data;
}

export async function updateSale(invoiceNumber, data) {
    const response = await api.put(
        `/sales/${invoiceNumber}`,
        data
    );

    return response.data;
}

export async function deleteSale(invoiceNumber) {
    await api.delete(
        `/sales/${invoiceNumber}`
    );
}