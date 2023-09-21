async function generateWrapUnwrapKey() {

    let key = window.crypto.subtle.generateKey(
        {
            name: "AES-KW",
            length: 256,
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["wrapKey", "unwrapKey"] //can be any combination of "sign" and "verify"
    );

    return key;
}

export default generateWrapUnwrapKey;