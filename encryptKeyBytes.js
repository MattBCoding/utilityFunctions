import exportCryptoKey from "./exportCryptoKey";

async function encryptKeyBytes(data, key) {
    console.log("Start of encryptKeyBytes");
    let keyBytes = await exportCryptoKey(data);
    let iv = window.crypto.getRandomValues(new Uint8Array(16));
    // return encrypted key
    console.log("about to encrypt key bytes");
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