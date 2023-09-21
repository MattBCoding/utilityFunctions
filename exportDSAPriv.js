

async function exportDSAPriv(privateKey) {
    let key = await window.crypto.subtle.exportKey(
        "jwk",
        privateKey
    );
    return key;
}
export default exportDSAPriv;