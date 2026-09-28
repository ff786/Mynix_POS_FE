import api from "./api";

/** Newsletter subscribers from the website (admins only). */
export async function getSubscribers() {
    const response = await api.get("/newsletter-subscribers");
    return response.data;
}

export async function deleteSubscriber(id) {
    await api.delete(`/newsletter-subscribers/${id}`);
}
