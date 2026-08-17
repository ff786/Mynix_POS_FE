import axios from "axios";

const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function getPublicInvoice(token) {
    const response = await publicApi.get(
        `/public/invoices/${token}`
    );

    return response.data;
}