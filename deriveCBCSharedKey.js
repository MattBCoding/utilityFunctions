

async function deriveCBCSharedKey(privateKey, publicKey) {
    console.log("deriveCBCSharedKey called");
    let sharedKey = await window.crypto.subtle.deriveKey(
        {
            name: "ECDH",
            public: publicKey,
        },
        privateKey,
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["wrapKey", "unwrapKey"],
    );
    return sharedKey;
}

export default deriveCBCSharedKey;