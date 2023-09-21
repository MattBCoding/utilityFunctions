onmessage = (e) => {

    const db = self.indexedDB.open(e.data[0], e.data[1]);

    db.onerror = (event) => {
        const error = `Database error: ${event.target.errorCode}`;
        console.error(error);
        postMessage(error);
    };

    db.onupgradeneeded = (event) => {
        const db = event.target.result;

        // check if the object store already exists
        if (!db.objectStoreNames.contains(e.data[2])) {

            // create a new object store
            const objectStore = db.createObjectStore(e.data[2], { keyPath: "id", autoIncrement: true });

            // Define indices (optional)
            objectStore.createIndex("email", "email", { unique: true });
        }

    };

    db.onsuccess = (event) => {
        const db = event.target.result;
        // create a transaction object for the object store
        const transaction = db.transaction([e.data[2]], "readwrite");

        transaction.oncomplete = (event) => {
            console.log("transaction completed from within webworker");
            postMessage(event.target.result)
        };

        transaction.onerror = (event) => {
            console.error(`ERROR: ${event.target.errorCode}`);
            postMessage(`ERROR: ${event.target.errorCode}`);
        };

        // get the object store
        const objectStore = transaction.objectStore(e.data[2]);
        const deleteRequest = objectStore.clear();
        deleteRequest.onsuccess = (event) => {
            console.log("object store cleared");
        };

        deleteRequest.onerror = (event) => {
            console.error(`ERROR: ${event.target.errorCode}`);
            postMessage(`ERROR: ${event.target.errorCode}`);
        };
        // add the data
        const request = objectStore.add(e.data[3]);
        request.onsuccess = (event) => {
            console.log("Data added to object store from within webworker");

        };

        request.onerror = (event) => {
            console.error(`ERROR: ${event.target.errorCode}`);
            postMessage(`ERROR: ${event.target.errorCode}`);
        };

        request.oncomplete = (event) => {
            console.log("request completed from within webworker");
        };
    };
};
