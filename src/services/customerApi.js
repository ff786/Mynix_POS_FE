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
    const response = await api.post(
        "/customers",
        data
    );

    return response.data;
}

export async function updateCustomer(id, data) {
    const response = await api.put(
        `/customers/${id}`,
        data
    );

    return response.data;
}

export async function deactivateCustomer(id) {
    await api.delete(`/customers/${id}`);
}

export async function searchCustomers(query) {
    const response = await api.get(
        "/customers/search",
        {
            params: { query },
        }
    );

    return response.data;
}

export async function getCustomerTransactions(customerId) {
    const response = await api.get(
        `/customers/${customerId}/transactions`
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

export async function getCustomerCheques(customerId) {
    const response = await api.get(
        `/cheques/customer/${customerId}`
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

export async function updateChequeStatus(
    chequeId,
    status,
    options = {}
) {

    const payload = {
        status,
    };

    if (status === "DEPOSITED") {
        payload.depositDate =
            options.depositDate ??
            new Date().toISOString().split("T")[0];
    }

    if (status === "BOUNCED") {
        payload.bounceReason =
            options.bounceReason;
    }

    if (options.notes) {
        payload.notes = options.notes;
    }

    const response = await api.patch(
        `/cheques/${chequeId}/status`,
        payload
    );

    return response.data;
}