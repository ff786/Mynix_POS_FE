export function buildInvoiceSms({
                                    customerName,
                                    invoiceNumber,
                                    amount,
                                    outstanding,
                                }) {
    return `Dear ${customerName}, your invoice ${invoiceNumber} total is Rs. ${formatAmount(amount)} and your total outstanding is Rs. ${formatAmount(outstanding)}. Thank you for choosing MYNIX.`;
}

export function buildPaymentSms({
                                    customerName,
                                    amount,
                                    paymentMethod,
                                    outstanding,
                                }) {
    const methodLabel =
        paymentMethod === "BANK_DEPOSIT"
            ? "Bank Deposit"
            : paymentMethod === "CASH"
                ? "Cash"
                : paymentMethod || "Payment";

    return `Dear ${customerName}, we have received your payment by ${methodLabel} of Rs. ${formatAmount(amount)} and your total outstanding is Rs. ${formatAmount(outstanding)}. Thank you for choosing MYNIX.`;
}

export function buildChequeReceivedSms({
                                           customerName,
                                           amount,
                                           chequeNumber,
                                       }) {
    return `Dear ${customerName}, we have received your cheque ${chequeNumber} for Rs. ${formatAmount(amount)}. Your cheque is currently pending clearance. Thank you for choosing MYNIX.`;
}

export function buildChequeDepositedSms({
                                            customerName,
                                            amount,
                                            chequeNumber,
                                        }) {
    return `Dear ${customerName}, your cheque ${chequeNumber} for Rs. ${formatAmount(amount)} has been deposited for processing. Thank you for choosing MYNIX.`;
}

export function buildChequeCreditedSms({
                                           customerName,
                                           amount,
                                           chequeNumber,
                                           outstanding,
                                       }) {
    return `Dear ${customerName}, your cheque ${chequeNumber} for Rs. ${formatAmount(amount)} has been credited successfully. Your total outstanding is now Rs. ${formatAmount(outstanding)}.`;
}

export function buildChequeBouncedSms({
                                          customerName,
                                          amount,
                                          chequeNumber,
                                          outstanding,
                                      }) {
    return `Dear ${customerName}, your cheque ${chequeNumber} for Rs. ${formatAmount(amount)} has been returned unpaid. Your total outstanding remains Rs. ${formatAmount(outstanding)}. Please contact us for further details.`;
}

function formatAmount(value) {
    return Number(value || 0).toLocaleString(
        "en-LK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
}