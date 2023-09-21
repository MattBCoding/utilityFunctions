/*
Export the given key.
*/
async function exportCryptoKey(key) {
    console.log("exportCryptoKey called");
    const exported = await window.crypto.subtle.exportKey("jwk", key);
    return exported;
}

export default exportCryptoKey;