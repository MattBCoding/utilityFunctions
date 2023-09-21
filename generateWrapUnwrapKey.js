async function generateWrapUnwrapKey() {
    console.log("Start of generateWrapUnwrapKey")
    let key = window.crypto.subtle.generateKey(
        {
            name: "AES-KW",
            length: 256,
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["wrapKey", "unwrapKey"] //can be any combination of "sign" and "verify"
    );
    console.log("End of generateWrapUnwrapKey");
    return key;
}

export default generateWrapUnwrapKey;