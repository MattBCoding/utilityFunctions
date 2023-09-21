


async function unwrapKeyWithKey(keyToBeUnwrapped, wrappingKey, iv) {
    console.log("unwrapKeyWithKey called");
    // get the wrapped key
    try {
        let unwrappedKey = await window.crypto.subtle.unwrapKey(
            "jwk",
            keyToBeUnwrapped,
            wrappingKey,
            {
                name: "AES-CBC",
                iv: iv
            },
            {
                name: "ECDSA",
                namedCurve: "P-256",
            },
            true,
            ["sign"]
        );
        console.log("unwrappedKey unwrapKeyWithKey: ", unwrappedKey);

        return unwrappedKey;
    } catch (e) {
        console.log("unwrapKeyWithKey error: ", e);
    }

}

export default unwrapKeyWithKey;