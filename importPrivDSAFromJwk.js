

async function importPrivDSAFromJwk(keyData) {

    let key = await window.crypto.subtle.importKey(
        "jwk",
        keyData,
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        true,
        ["sign"]
    );

    return key;

}

export default importPrivDSAFromJwk;