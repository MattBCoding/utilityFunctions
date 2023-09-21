import getLoginVariablesFromDb from "./getLoginVariablesFromDb.js";
import convertIdTo16ByteArray from "./convertIdTo16ByteArray.js";
import deriveKeyFromPassword from "./deriveKeyFromPassword.js";
import importPrivDSAFromJwk from "./importPrivDSAFromJwk.js";
import unsignedLoginTransaction from "./unsignedLoginTransaction.js";
import unwrapKeyWithKey from "./unwrapKeyWithKey.js";
import generateSignature from "./generateSignature.js";
import convertArrayBufferToBase64 from "./convertArrayBufferToBase64.js";
import generateLoginRequest from "./generateLoginRequest.js";


async function login(email, password, bID, tID) {
    let resultArray;
    const updateResultArray = async (value) => {
        resultArray = value;
        let deviceId = value[0];
        let salt = value[1];
        let userId = value[2];
        let wrappedDeviceDSAPriv = value[3];

        let iv = await convertIdTo16ByteArray(userId);
        let wrappingKey = await deriveKeyFromPassword(password, salt);
        let deviceDSAPrivJwk = await unwrapKeyWithKey(wrappedDeviceDSAPriv, wrappingKey, iv);
        //let deviceDSAPriv = await importPrivDSAFromJwk(deviceDSAPrivJwk);
        let unsignedLoginTransactionObj = await unsignedLoginTransaction(bID, deviceId, tID);

        // convert javascript object to JSON object
        let unsignedTransactionJSON = await JSON.stringify(unsignedLoginTransactionObj);

        // convert unsigned transaction to array buffer
        let unsignedTransactionAB = new TextEncoder().encode(unsignedTransactionJSON);

        // sign transaction
        let signature = await generateSignature(unsignedTransactionAB, deviceDSAPrivJwk);
        let unsignedTransactionBase64 = await convertArrayBufferToBase64(unsignedTransactionAB);
        let request = await generateLoginRequest(unsignedTransactionBase64, signature, email);

        return request;
    };
    return await getLoginVariablesFromDb(email, updateResultArray);


}

export default login;