import generateTimestamp from './generateTimestamp';

async function unsignedLoginTransaction(bID, dID, tID) {
    console.log("unsignedLoginTransaction called")
    console.log("bID: ", bID)
    console.log("dID: ", dID)
    console.log("tID: ", tID)

    let unsignedTransaction = {
        "bID": bID,
        "dID": dID,
        "tID": tID,
        "TS": await generateTimestamp(),
        "RT": true,
        "REQ": [{ "TYP": "Login" }],
    }
    console.log("unsignedTransaction: ", unsignedTransaction)
    return unsignedTransaction;
}

export default unsignedLoginTransaction;