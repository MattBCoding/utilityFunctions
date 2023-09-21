



async function getLoginVariablesFromDb(email, updateResultArray) {
    const DB_NAME = "endocloudDb";
    const DB_VERSION = 1;
    const DB_STORE_NAME = "keyStore";
    //let db;
    //let databaseEntry;
    //const dbRequest = await window.indexedDB.open(DB_NAME, DB_VERSION);
    //dbRequest.onerror = (event) => {
    //    console.log("error opening database within login.js");
    //    console.log("error: ", event.target.errorCode);
    //};
    //dbRequest.onupgradeneeded = (event) => {
    //    console.log("database upgrade needed within login.js");
    //    console.log("event: ", event);
    //};
    //dbRequest.onsuccess = (event) => {
    //    db = event.target.result;
        
    //    /*return await request.onsuccess;*/
    //    console.log("end of dbRequest.onsuccess");
    //};
    ///*return await dbRequest.onsuccess.result;*/
    //const transaction = db.transaction([DB_STORE_NAME]);
    //const objectStore = transaction.objectStore(DB_STORE_NAME);
    //const index = objectStore.index("email");
    //const request = index.get(email);
    //request.onerror = (event) => {
    //    console.log("error getting data from object store within login.js");
    //    console.log("error: ", event.target.errorCode);
    //};
    //request.onsuccess = async (event) => {
    //    databaseEntry = event.target.result;
        
    //};
    //console.log("data retrieved from object store within login.js");
    //let dbDeviceId = databaseEntry.deviceId;
    //let dbSalt = databaseEntry.salt;
    //let dbUserId = databaseEntry.userId;
    //let dbWrappedDeviceDSAPriv = databaseEntry.wrappedDeviceDSAPriv;
    //let resultArray = [dbDeviceId, dbSalt, dbUserId, dbWrappedDeviceDSAPriv];
    //console.log("resultArray: ", resultArray)
    function getDataFromDB(email) {
        return new Promise(
            function (resolve, reject) {
                let dbRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
                dbRequest.onerror = function (event) {
                    reject(Error("Error text"));
                };

                dbRequest.onupgradeneeded = function (event) {
                    // Objectstore does not exist. Nothing to load
                    event.target.transaction.abort();
                    reject(Error('Not found'));
                };

                dbRequest.onsuccess = function (event) {
                    console.log("dbRequest.onsuccess called")
                    let database = event.target.result;
                    let transaction = database.transaction([DB_STORE_NAME]);
                    let objectStore = transaction.objectStore(DB_STORE_NAME);
                    let index = objectStore.index("email");
                    let request = index.get(email);

                    request.onerror = function (event) {
                        reject(Error('Error text'));
                    };

                    request.onsuccess = function (event) {
                        console.log("request.onsuccess called")
                        if (request.result) resolve(request.result);
                        else reject(Error('object not found'));
                    };
                };
            }
        );
    }

    let databaseEntry = await getDataFromDB(email);
    let dbDeviceId = databaseEntry.deviceId;
    let dbSalt = databaseEntry.salt;
    let dbUserId = databaseEntry.userId;
    let dbWrappedDeviceDSAPriv = databaseEntry.wrappedDeviceDSAPriv;
    let resultArray = [dbDeviceId, dbSalt, dbUserId, dbWrappedDeviceDSAPriv];
    let request = await updateResultArray(resultArray);
    return request;
}

export default getLoginVariablesFromDb;