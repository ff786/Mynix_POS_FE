import api from "./api";

export async function scanBarcode(barcode) {
    const response = await api.get(
        `/pos/product/${encodeURIComponent(barcode)}`
    );

    return response.data;
}

export async function searchProducts(query) {
    const response = await api.get(
        "/pos/products/search",
        {
            params: { query },
        }
    );

    return response.data;
}

export async function completeSale(payload) {
    const response = await api.post(
        "/pos/checkout",
        payload
    );

    return response.data;
}