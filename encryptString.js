import convertArrayBufferToBase64 from "./convertArrayBufferToBase64";
import convertIdTo16ByteArray from "./convertIdTo16ByteArray";
import convertKWToCBC from "./convertKWToCBC";


async function encryptString(data, key, nodeID) {
    // convert the data to be encrypted to an array buffer
    let enc = new TextEncoder();
    let encoded = enc.encode(data);

    // convert the key to be used for encryption to AES-CBC
    let convertedKey = await convertKWToCBC(key);

    // get the IV from the parent ID
    let convertedId = await convertIdTo16ByteArray(nodeID);

    // encrypt the data using the converted key
    let encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: convertedId,
        },
        convertedKey,
        encoded
    );

    // convert the encrypted data to a base64 string
    let encString = await convertArrayBufferToBase64(encrypted);

    // return the encrypted data in base64 format
    return encString;
}

export default encryptString;