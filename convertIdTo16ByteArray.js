/**
 * Convert an id string to 16 byte array
 * @param {string} str
 * @returns
 */

function convertIdTo16ByteArray(str) {
    // Convert string to byte array
    let utf8EncodeString1 = new TextEncoder();
    let stringByteArray = utf8EncodeString1.encode(str);
    return stringByteArray;
}

export default convertIdTo16ByteArray;