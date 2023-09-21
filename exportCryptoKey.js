/*
Export the given key.
*/
async function exportCryptoKey(key) {

    const exported = await window.crypto.subtle.exportKey("jwk", key);
    return exported;
}

export default exportCryptoKey;