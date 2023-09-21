

async function exportDHPub(key) {
    let exportableKey = await window.crypto.subtle.exportKey(
        "raw",
        key
    );
    return exportableKey;
}
export default exportDHPub;