/** Initial state of New Sale's "Deliver this order" panel. */
export const EMPTY_DELIVERY = {
    enabled: false,
    channel: "PHONE",
    savedAddressId: null,
    address: { label: "Home", addressLine1: "", addressLine2: "", city: "", district: "", postalCode: "" },
    saveAddress: true,
    notes: "",
};
