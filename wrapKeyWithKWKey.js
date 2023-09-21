
async function wrapKeyWithKWKey(keyToBeWrapped, wrappingKey) {

    // get the wrapped key
    try {
        let wrappedKey = await window.crypto.subtle.wrapKey(
            "raw",
            keyToBeWrapped,
            wrappingKey,
            {
                name: "AES-KW",
            }
        );
        return wrappedKey;
    } catch (e) {
        console.log("wrapKeyWithKey error: ", e);
    }

}

export default wrapKeyWithKWKey;