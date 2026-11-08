import api from "./api";

/** Whether text messages are going out (text.lk). */
export async function getSmsStatus() {
    const response = await api.get("/sms-status");
    return response.data;
}
