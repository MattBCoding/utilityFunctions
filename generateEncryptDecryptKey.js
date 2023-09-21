async function generateEncryptDecryptKey() {

    let key = window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be any combination of "sign" and "verify"
    );

    return key;
}

export default generateEncryptDecryptKey;