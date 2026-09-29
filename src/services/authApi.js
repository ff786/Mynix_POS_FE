import axios from "axios";
import api from "./api";

const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

export async function loginUser(username, password) {

    const response = await authApi.post(
        "/login",
        {
            username,
            password,
        }
    );

    return response.data;
}

/** Step 1 of a password change: an SMS code to the shop phone. */
export async function requestPasswordCode() {

    const response = await api.post("/auth/password/code", {});

    return response.data;
}


/** Step 2: the SMS code and the new password. */
export async function changePassword(code, newPassword) {

    const response = await api.post("/auth/password", { code, newPassword });

    return response.data;
}
