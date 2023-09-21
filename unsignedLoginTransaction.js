import generateTimestamp from './generateTimestamp';

async function unsignedLoginTransaction(bID, dID, tID) {

    let unsignedTransaction = {
        "bID": bID,
        "dID": dID,
        "tID": tID,
        "TS": await generateTimestamp(),
        "RT": true,
        "REQ": [{ "TYP": "Login" }],
    }

    return unsignedTransaction;
}

export default unsignedLoginTransaction;