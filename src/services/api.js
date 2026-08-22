import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


/*
 * Attach JWT to every authenticated request.
 */
api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) =>
        Promise.reject(error)
);


/*
 * Centralized authentication failure handling.
 *
 * When the backend returns 401 for an authenticated
 * request, the current session is no longer valid.
 *
 * We remove the token immediately and notify the
 * React application so it can display the session
 * expired interface.
 */
api.interceptors.response.use(

    (response) => response,

    (error) => {

        const status =
            error.response?.status;

        const requestUrl =
            error.config?.url || "";

        const token =
            localStorage.getItem("token");


        /*
         * Do not treat login failures as expired
         * sessions. A failed login is simply a
         * failed login attempt.
         */
        const isLoginRequest =
            requestUrl.includes("/auth/login");


        if (
            status === 401 &&
            token &&
            !isLoginRequest
        ) {

            /*
             * Remove the invalid session immediately.
             */
            localStorage.removeItem("token");

            localStorage.removeItem("user");


            /*
             * Notify the React application.
             *
             * The session-expired component listens
             * for this event globally.
             */
            window.dispatchEvent(
                new Event("mynix:session-expired")
            );
        }


        return Promise.reject(error);
    }
);


export default api;