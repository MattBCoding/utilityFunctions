
async function generateLoginRequest(unsignedTransactionBase64, signature) {
    let requestObject = {
        "STX": {
            "UTX": unsignedTransactionBase64,
            "SIG": signature,
        },
    };
    let request = JSON.stringify(requestObject);
    return request;
}

export default generateLoginRequest;