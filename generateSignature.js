async function generateSignature(message, key) {

    let signature = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        key,
        message
    );
    

    // convert signature from array buffer to base64
    let binary = '';
    let bytes = new Uint8Array(signature);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    let base64 = window.btoa(binary);

    return base64;
    
}

export default generateSignature;