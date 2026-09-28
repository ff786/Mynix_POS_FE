import api from "./api";

/** A customer's saved delivery addresses (shared with their website account). */
export async function getAddresses(customerId) {
    const response = await api.get(`/customers/${customerId}/addresses`);
    return response.data;
}

export async function saveAddress(customerId, address, addressId) {
    const response = addressId
        ? await api.put(`/customers/${customerId}/addresses/${addressId}`, address)
        : await api.post(`/customers/${customerId}/addresses`, address);
    return response.data;
}

export async function deleteAddress(customerId, addressId) {
    await api.delete(`/customers/${customerId}/addresses/${addressId}`);
}

export async function makeDefaultAddress(customerId, addressId) {
    const response = await api.post(`/customers/${customerId}/addresses/${addressId}/default`);
    return response.data;
}
