import api from "./api";

export async function getCustomers(search = "") {
    const response = await api.get("/customers", {
        params: search ? { search } : {},
    });

    return response.data;
}

export async function getCustomer(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
}

export async function createCustomer(data) {
    const response = await api.post("/customers", data);
    return response.data;
}

export async function updateCustomer(id, data) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
}

export async function deactivateCustomer(id) {
    await api.delete(`/customers/${id}`);
}

export async function searchCustomers(query) {
    const response = await api.get("/customers/search", {
        params: { query },
    });

    return response.data;
}

export async function getCustomerTransactions(id) {
    const response = await api.get(
        `/customers/${id}/transactions`
    );

    return response.data;
}

export async function recordCustomerPayment(id, data) {
    const response = await api.post(
        `/customers/${id}/payments`,
        data
    );

    return response.data;
}

export async function getCustomerCheques(id) {
    const response = await api.get(
        `/cheques/customer/${id}`
    );

    return response.data;
}

export async function createCustomerCheque(id, data) {
    const response = await api.post(
        `/cheques/customer/${id}`,
        data
    );

    return response.data;
}

export async function updateChequeStatus(id, data) {
    const response = await api.patch(
        `/cheques/${id}/status`,
        data
    );

    return response.data;
}
