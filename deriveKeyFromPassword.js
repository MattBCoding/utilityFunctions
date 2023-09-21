/**
 * Derives a key from a password and salt using the PBKDF2 algorithm.
 * @param {string} password 
 * @param {Uint8Array} salt 
 * @returns {CryptoKey}
 */
async function deriveKeyFromPassword(password, salt) {
    console.log("deriveKeyFromPassword called");
    const encoder = new TextEncoder();
    let passwordKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    let key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 10000,
            hash: "SHA-512"
        },
        passwordKey,
        { name: "AES-CBC", length: 256 },
        true,
        ["wrapKey", "unwrapKey"]
    );

    return key;
}

export default deriveKeyFromPassword;