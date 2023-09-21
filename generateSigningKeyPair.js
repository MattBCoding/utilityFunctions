async function generateSigningKeyPair() {

    let key = window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        true,
        ["sign", "verify"]
    );
    return key;
}

export default generateSigningKeyPair;