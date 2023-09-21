
/**
 * Derives a shared AES-KW key for wrapping/unwrapping from a private and public key.
 * @param {CryptoKey} privateKey 
 * @param {CryptoKey} publicKey 
 * @returns {CryptoKey} - The shared AES-KW key
 */


async function deriveKWSharedKey(privateKey, publicKey) {
    console.log("deriveKWSharedKey called");
    let sharedKey = await window.crypto.subtle.deriveKey(
        {
            name: "ECDH",
            public: publicKey,
        },
        privateKey,
        {
            name: "AES-KW",
            length: 256,
        },
        true,
        ["wrapKey", "unwrapKey"],
    );
    return sharedKey;
}

export default deriveKWSharedKey;