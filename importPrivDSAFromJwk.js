

async function importPrivDSAFromJwk(keyData) {
    console.log("importPrivDSAFromJwk called")
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
    console.log("importPrivDSAFromJwk key: ", key);
    return key;

}

export default importPrivDSAFromJwk;