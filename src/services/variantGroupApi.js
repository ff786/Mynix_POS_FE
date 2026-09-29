import api from "./api";

export async function getVariantGroups() {
    const response = await api.get("/product-variant-groups");
    return response.data;
}

export async function createVariantGroup(data) {
    const response = await api.post("/product-variant-groups", data);
    return response.data;
}

export async function updateVariantGroup(id, data) {
    const response = await api.put(`/product-variant-groups/${id}`, data);
    return response.data;
}

export async function deleteVariantGroup(id) {
    await api.delete(`/product-variant-groups/${id}`);
}
