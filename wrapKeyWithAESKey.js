
async function wrapKeyWithAESKey(keyToBeWrapped, wrappingKey) {
    console.log("wrapKeyWithAESKey called");
    // get the wrapped key
    try {
        let wrappedKey = await window.crypto.subtle.wrapKey(
            "raw",
            keyToBeWrapped,
            wrappingKey,
            {
                name: "AES-CBC",
                iv: window.crypto.getRandomValues(new Uint8Array(16)),
            }
        );
        return wrappedKey;
    } catch (e) {
        console.log("wrapKeyWithAESKey error: ", e);
    }

}

export default wrapKeyWithAESKey;