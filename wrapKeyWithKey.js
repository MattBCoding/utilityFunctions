
async function wrapKeyWithKey(keyToBeWrapped, wrappingKey, iv) {

    // get the wrapped key
    try {
        let wrappedKey = await window.crypto.subtle.wrapKey(
            "jwk",
            keyToBeWrapped,
            wrappingKey,
            {
                name: "AES-CBC",
                iv: iv
            }
        );
        return wrappedKey;
    } catch (e) {
        console.log("wrapKeyWithKey error: ", e);
    }

}

export default wrapKeyWithKey;