
function openDb() {
    console.log("openDb called")
    const DB_NAME = "endocloudDb";
    const DB_VERSION = 1;
    const DB_STORE_NAME = "keyStore";

    // define constants for the name and version of the database to be created

    // call open method of indexedDB, which returns a request object
    const dbRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

    // handle error event if dbRequest returned an error
    dbRequest.onerror = (event) => {
        console.error("Database error: " + event.target.errorCode);
    };

    // if the database does not already exist, it is created by the open operation,
    // then an onupgradeneeded event is triggered and you create the schema for the database
    // in the handler for this event
    // if it does exist but you specified an upgraded version number, then the onupgradeneeded
    // event is also triggered and you can use it to upgrade the structure of the database
    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;

        // check if the object store already exists
        if (!db.objectStoreNames.contains(DB_STORE_NAME)) {

            // create a new object store
            const objectStore = db.createObjectStore(DB_STORE_NAME, { keyPath: "id", autoIncrement: true });

            // Define indices (optional)
            objectStore.createIndex("email", "email", { unique: true });
        }

        console.log("Database setup complete");
        
    };

    dbRequest.onsuccess = (event) => {
        console.log("Database opened successfully");
        const db = event.target.result;
        return db;
    }

}

export default openDb;