async function generateSignature(message, key) {
    //console.log("generating signature")
    let signature = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        key,
        message
    );
    
    //console.log("signature generated - converting to base64 string")
    // convert signature from array buffer to base64
    let binary = '';
    let bytes = new Uint8Array(signature);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    let base64 = window.btoa(binary);
    //console.log("signature converted to base64 string")
    //console.log(base64);
    return base64;
    
}

export default generateSignature;