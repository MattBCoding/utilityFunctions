


async function unwrapKeyWithKey(keyToBeUnwrapped, wrappingKey, iv) {

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


        return unwrappedKey;
    } catch (e) {
        console.log("unwrapKeyWithKey error: ", e);
    }

}

export default unwrapKeyWithKey;