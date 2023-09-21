async function generateDeriveKeyPair() {

    let key = window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-521",
        },
        true,
        ["deriveKey"]
    );
    return key;
}

export default generateDeriveKeyPair;