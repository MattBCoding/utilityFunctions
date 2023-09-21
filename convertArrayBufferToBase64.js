/**
 * Convert an array buffer to base64 string
 * @param {any} arrayBuffer
 * @returns
 */

async function convertArrayBufferToBase64(arrayBuffer) {
    let binary = '';
    let bytes = new Uint8Array(arrayBuffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
export default convertArrayBufferToBase64;