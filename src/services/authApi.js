import axios from "axios";

const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api/auth",
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