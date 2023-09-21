async function generateEncryptDecryptKey() {
    console.log("Start of generateEncryptionKey")
    let key = window.crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be any combination of "sign" and "verify"
    );
    console.log("End of generateEncryptionKey");
    return key;
}

export default generateEncryptDecryptKey;