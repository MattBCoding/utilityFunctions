/**
 * Combines two strings into a 16 byte array.
 * The first 8 bytes are the first string, the second 8 bytes are the second string.
 * 
 * @param {string} string1
 * @param {string} string2
 * @returns {Uint8Array}
 */

function combineStrIdTo16ByteArray(string1, string2) {
    // Convert strings to byte arrays
    let utf8EncodeString1 = new TextEncoder();
    let string1ByteArray = utf8EncodeString1.encode(string1);
    let utf8EncodeString2 = new TextEncoder();
    let string2ByteArray = utf8EncodeString2.encode(string2);

    // Combine the two byte arrays into one 16 byte array
    let newByteArray = new Uint8Array(16);
    for (let i = 8; i < 16; i++) {
        newByteArray[i - 8] = string1ByteArray[i];
    }
    for (let i = 8; i < 16; i++) {
        newByteArray[i] = string2ByteArray[i];
    }

    return newByteArray;
}

export default combineStrIdTo16ByteArray;