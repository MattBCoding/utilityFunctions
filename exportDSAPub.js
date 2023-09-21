

async function exportDSAPub(key) {
    let exportableKey = await window.crypto.subtle.exportKey(
        "spki",
        key
    );
    return exportableKey;
}
export default exportDSAPub;