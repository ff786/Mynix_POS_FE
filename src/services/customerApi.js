import api from "./api";

export async function getCustomers() {
    const response = await api.get("/customers");
    return response.data;
}

export async function searchCustomers(query) {
    const response = await api.get("/customers/search", {
        params: { query },
    });

    return response.data;
}

export async function getCustomer(id) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
}

export async function createCustomer(payload) {
    const response = await api.post("/customers", payload);
    return response.data;
}
