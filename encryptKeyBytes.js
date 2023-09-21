import exportCryptoKey from "./exportCryptoKey";
/**
 * Encrypts the key bytes using AES-CBC.
 * @param {*} data - the data to encrypt
 * @param {CryptoKey} key 
 * @returns {ArrayBuffer}
 */
async function encryptKeyBytes(data, key) {

    let keyBytes = await exportCryptoKey(data);
    let iv = window.crypto.getRandomValues(new Uint8Array(16));
    // return encrypted key

    try {
        let encryptedKey = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv: iv,
            },
            key,
            keyBytes
        );

        return encryptedKey;

    } catch (e) {
        console.log("ERROR in encryptKeyBytes: ", e);
    }
}

export default encryptKeyBytes;