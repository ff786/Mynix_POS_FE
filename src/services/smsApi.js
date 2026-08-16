export function openSmsComposer(
    phoneNumber,
    message
) {
    if (!phoneNumber) {
        throw new Error(
            "Customer does not have a contact number."
        );
    }

    const cleanNumber =
        String(phoneNumber).replace(
            /[^0-9+]/g,
            ""
        );

    const url =
        `sms:${cleanNumber}?body=${encodeURIComponent(
            message
        )}`;

    window.location.href = url;
}

export async function sendCustomerSms({
                                          phoneNumber,
                                          message,
                                      }) {
    /*
     * Backend SMS gateway is intentionally not
     * connected yet.
     *
     * For now this opens the device SMS composer.
     *
     * Later this function can become:
     *
     * await api.post("/notifications/sms", {
     *     phoneNumber,
     *     message,
     * });
     */

    openSmsComposer(
        phoneNumber,
        message
    );

    return {
        success: true,
        mode: "composer",
    };
}